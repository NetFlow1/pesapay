const express = require("express");
const router = express.Router();

const { initiateSTK, verifyPayment } = require("../services/payhero");

// ✅ INITIATE PAYMENT
router.post("/initiate-payment", async (req, res) => {
    try {
        let { phone_number, amount, description } = req.body;

        if (!phone_number || !amount) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const result = await initiateSTK(phone_number, amount, description);

        return res.json({
            success: true,
            reference: result.reference || result.external_reference,
            data: result
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ VERIFY PAYMENT
router.get("/verify-payment", async (req, res) => {
    try {
        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({ message: "Reference required" });
        }

        const result = await verifyPayment(reference);

        return res.json({
            status: result.status || result.data?.status,
            raw: result
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ CALLBACK (optional but useful)
router.post("/callback", (req, res) => {
    console.log("🔥 PAYHERO CALLBACK:", req.body);
    res.sendStatus(200);
});

module.exports = router;