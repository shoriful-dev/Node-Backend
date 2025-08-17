require('dotenv').config();
const axios = require('axios');

exports.sendSms = async (phoneNumber, smsBody) => {
  try {
    const response = await axios.post(process.env.API_URL, {
      api_key: process.env.API_KEY,
      senderid: process.env.SENDER_ID,
      number: Array.isArray(phoneNumber)
        ? `${phoneNumber.join(',')}`
        : phoneNumber,
      message: smsBody,
    });
    console.log(response);
  } catch (error) {
    console.log('error from send sms', error);
  }
};
