
const {Cashfree} = require("cashfree-pg");
const fetch=require('node-fetch');
const Order = require('../models/orders');
const { application } = require("express");
require('dotenv').config();
exports.purchasePremium = async (req, res) => {
 
    try {console.log(req.body)
        const { amount} = req.body;
        const userId = req.user.id;
const order_id=`ORD_${Date.now()}`
const paymentdata={
    order_id,

    order_amount:parseFloat(amount),

    order_currency: "INR",
    customer_details: {
        customer_id: `${userId}`,
        customer_email:req.user.email,
        customer_phone: "9652700100"
    },
order_meta:{
return_url:`http://localhost:3000/purchase/verify-payment?order_id=${order_id}`
}
};
console.log('sending payment request',paymentdata);
const CASHFREE_BASE_URL=process.env.CASHFREE_BASE_URL||"https://sandbox.cashfree.com/pg/orders";
        const response = await fetch(CASHFREE_BASE_URL,
            {method:"POST",
                headers: {
                    accept: 'application/json',
                    'x-client-id':process.env.CASHFREE_APP_ID,
                    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
                    'x-api-version': '2022-09-01',
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(paymentdata),
    });
  
const result= await response.json();
console.log('cashfree response:',result)
if(result.payment_session_id)
{
res.json({paymentSessionId:result.payment_session_id});
}
else{
 
    res.status(500).json({message:'failed to create payment session',result})
}
    } catch (error) {
      
        console.error('cashfree payment error:',error)
        res.status(500).json({ message: "Error creating payment", error: error.message });
    }
};

const User = require('../models/users');
const sequelize = require("../util/database");

exports.verifyPayment = async (req, res) => {
  const orderId = req.query.order_id;
  if (!orderId) return res.status(400).send("Order ID missing");
const t=await sequelize.transaction();
  try {
    const response = await fetch(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2022-09-01'
      }
    });

    const result = await response.json();

    if (result.order_status === 'PAID') {
      const user = await User.findByPk(result.customer_details.customer_id,{transaction:t});
      if (user) {
        user.ispremiumuser = true;
       
        await user.save({transaction:t});
await t.commit();
        return res.send(`
          <html><body>
          <h2>✅ Payment Successful</h2>
          <p>You are now a Premium User!</p>
          <a href="/view/login/login.html">Go Back to App</a>
          </body></html>
        `);
      } else {
        await t.rollback();
        return res.status(404).send("User not found");
      }
    } else {
      return res.send(`
        <html><body>
        <h2>❌ Payment Failed or Pending</h2>
        <p>Status: ${result.order_status}</p>
        <a href="/">Try Again</a>
        </body></html>
      `);
    }

  } catch (err) {
    await t.rollback();
    console.error("Payment verification error:", err);
    return res.status(500).send("Verification failed");
  }
 };
