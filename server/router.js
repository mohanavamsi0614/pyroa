const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const User = require('./userSchema');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const bcrypt = require('bcrypt');

// Register User
router.post('/register', upload.single('collegeIDPhoto'), async (req, res) => {
  try {
    const { password, confirmPassword, name, email, mobileNumber } = req.body;

    // Validate that password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedConfirm = await bcrypt.hash(confirmPassword, 10);

    // Generate slot code and QR code data
    const slotCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const qrCodeData = await QRCode.toDataURL(`Name: ${name}, Slot Code: ${slotCode}`);

    const newUser = new User({
      ...req.body,
      password: hashedPassword, 
      confirmPassword: hashedConfirm,
      collegeIDPhoto: req.file.path,
      slotCode,
      qrCode: qrCodeData,
      footPrint: [
        {
          name,
          slotCode,
          paymentId: null,
        },
      ],
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', slotCode });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Admin login and access
router.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ role: 'admin' }, 'secretKey');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get user data by slot code
router.get('/user/:slotCode', async (req, res) => {
  try {
    const user = await User.findOne({ slotCode: req.params.slotCode });
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user data' });
  }
});

// Update accommodation details
router.put('/update-accommodation/:slotCode', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { slotCode: req.params.slotCode },
      { $set: { accommodationDetails: req.body } },
      { new: true }
    );
    res.json({ message: 'Accommodation updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Error updating accommodation details' });
  }
});

// Get user data and footPrint by slot code
router.get('/scan/:slotCode', async (req, res) => {
  try {
    const user = await User.findOne({ slotCode: req.params.slotCode });
    if (user) {
      res.json({
        name: user.name,
        slotCode: user.slotCode,
        footPrint: user.footPrint,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user data' });
  }
});

// Placeholder route for payment completion
router.post('/complete-payment', async (req, res) => {
  const { slotCode, paymentId } = req.body;

  try {
    const user = await User.findOne({ slotCode });
    if (user) {
      user.footPrint.push({
        name: user.name,
        slotCode: user.slotCode,
        paymentId,  
      });
      await user.save();

      res.json({ message: 'Payment processed and footPrint updated' });
    } else {
      res.status(404).json({ message: 'User not found for provided slot code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error processing payment' });
  }
});

// In userRouter.js
router.post('/log-footprint/:slotCode', async (req, res) => {
  const { slotCode } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { slotCode },
      { $push: { footprints: { name: user.name, slot: user.slotCode, paid: 'Amount Paid' } } },
      { new: true }
    );

    if (user) {
      res.status(200).json({ message: 'Footprint logged successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging footprint' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.admin && password === process.env.adminPass) {
    // Admin login
    const token = jwt.sign({ role: 'admin' }, 'secretKey');
    return res.json({ token, role: 'admin' });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'user' }, 'secretKey'); 

    res.json({ token, role: 'user' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Routes that are only accessible to the admin
router.get('/admin-data', authenticateToken, (req, res) => {
  if (req.user.role === 'admin') {
    res.json({ message: 'Admin data accessible only by admins.' });
  } else {
    res.status(403).json({ message: 'Access denied for non-admin users' });
  }
});

// Middleware for verifying JWT token and user authentication
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'secretKey'); 
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Define the /user-profile route to fetch user data
router.get('/user-profile', authenticateUser, async (req, res) => {
  try {
    // Find the user by ID (assuming the token contains the user ID)
    const user = await User.findById(req.user.id).select('name email mobileNumber qrCode collegeName collegeIDPhoto'); // Adjust the fields you want to send
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userProfile = {
      username: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      qrCode: user.qrCode,
      collegeName: user.collegeName,
      collegeIDPhoto: user.collegeIDPhoto,
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
