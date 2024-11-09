import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../index.css";

export default function Payment() {
    const navigate = useNavigate();
    const money = 100;


    useEffect(() => {
        const slotCode = Cookies.get("slotCode");
        console.log(slotCode)
        if (!slotCode) {
            navigate("/"); 
        }
    }, [navigate]);
    const handleClick = (e) => {
        e.preventDefault();
        var options = {
            key: "",
            key_secret: "",
            amount: money * 100, 
            currency: "INR",
            name: "Pyros",
            description: "For pyros Club",
            handler: function (res) {
                alert(res.razorpay_payment_id);
            },
            prefill: {
                name: "Pyros",
                email: "tamilboysince2004@gmail.com",
                contact: "6382767198",
            },
            notes: {
                address: "Razorpay corp. office",
            },
            theme: {
                color: "#3399cc",
            },
        };
        var pay = new window.Razorpay(options);
        pay.open();
    };

    return (
        <div>
            <h2>RAZORPAY PAYMENT</h2>
            <div className="pay">
                <img
                    src="https://www.ecommerce-nation.com/wp-content/uploads/2019/02/razorpay.webp"
                    alt=""
                    className="img"
                />
                <div className="num">100</div>
                <button onClick={handleClick}>Submit</button>
            </div>
        </div>
    );
}
