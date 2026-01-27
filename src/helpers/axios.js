require("dotenv").config();
const axios = require("axios");

const api = axios.create({
  baseURL: `https://portal.packzy.com/api/v1`,
  headers: {
    "Api-Key": `${process.env.STEADFAST_API_KEY}`,
    "Secret-Key": `${process.env.STEADFAST_API_SECRET}`,
    "Content-Type": "application/json",
  },
});
module.exports = { api };
