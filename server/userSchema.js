const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  registerNumber: String,
  collegeName: String,
  collegeIDPhoto: String,
  email: String,
  mobileNumber: String,
  password: String,
  confirmPassword:String,
  accommodationRequired: Boolean,
  slotCode: String,
  qrCode: String,
  accommodationDetails: {
    roomNumber: String,
    time: String,
    overtime: Boolean,
  },
  footprints: [
    {
      timestamp: { type: Date, default: Date.now },
      action: String, 
    }
  ],
});

module.exports = mongoose.model('User', userSchema);
