require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔑 ใช้จาก Environment Variable
const LINE_TOKEN = process.env.LINE_TOKEN;

// 📤 ฟังก์ชันส่งข้อความเข้า LINE
async function sendLine(userId, message) {
    try {
        await axios.post(
            "https://api.line.me/v2/bot/message/push",
            {
                to: userId,
                messages: [
                    {
                        type: "text",
                        text: message
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + LINE_TOKEN
                }
            }
        );

        console.log("✅ SEND SUCCESS");
    } catch (err) {
        console.log("❌ SEND ERROR:", err.response?.data || err.message);
    }
}

// 🔥 Webhook หลัก
app.post("/webhook", async (req, res) => {
    const events = req.body.events;

    if (Array.isArray(events)) {
        for (const event of events) {

            if (event.type === "message" && event.source?.userId) {
                const userId = event.source.userId;
                const text = event.message.text;

                console.log("📩 LINE EVENT:", text);

                await sendLine(
                    userId,
                    "🛒 มีออเดอร์เข้า\nรายการ: " + text
                );
            }
        }
    }

    res.sendStatus(200);
});

// 🧪 test server
app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

// 🚀 start server (Render ใช้ port นี้)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on port", PORT));