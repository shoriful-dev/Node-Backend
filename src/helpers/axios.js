require("dotenv").config();
const axios = require("axios");

const api = axios.create({
  baseURL: `${process.env.DOMAIN}`,
  headers: {
    "Api-Key": `${process.env.STEADFAST_API_KEY}`,
    "Secret-Key": `${process.env.STEADFAST_API_SECRET}`,
    "Content-Type": "application/json",
  },
});
module.exports = { api };
