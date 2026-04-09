const axios = require("axios");

const PAYHERO_BASE_URL = "https://backend.payhero.co.ke/api/v2";

function getAuthHeader() {
    const username = process.env.PAYHERO_USERNAME;
    const password = process.env.PAYHERO_PASSWORD;

    const token = Buffer.from(`${username}:${password}`).toString("base64");

    return {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json"
    };
}

// 🚀 INITIATE STK PUSH
async function initiateSTK(phone, amount, description) {
    try {
        const response = await axios.post(
            `${PAYHERO_BASE_URL}/payments`,
            {
                amount: amount,
                phone_number: phone,
                channel_id: process.env.PAYHERO_CHANNEL_ID,
                external_reference: "SPIN_" + Date.now(),
                description: description,
                callback_url: `${process.env.BASE_URL}/api/callback`
            },
            { headers: getAuthHeader() }
        );

        return response.data;

    } catch (error) {
        console.error("PAYHERO ERROR:", error.response?.data || error.message);
        throw new Error("Failed to initiate payment");
    }
}

// 🔍 VERIFY PAYMENT
async function verifyPayment(reference) {
    try {
        const response = await axios.get(
            `${PAYHERO_BASE_URL}/transaction-status?reference=${reference}`,
            { headers: getAuthHeader() }
        );

        return response.data;

    } catch (error) {
        console.error("VERIFY ERROR:", error.response?.data || error.message);
        throw new Error("Failed to verify payment");
    }
}

module.exports = {
    initiateSTK,
    verifyPayment
};