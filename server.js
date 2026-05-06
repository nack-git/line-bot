require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// 🔑 Token จาก ENV
const LINE_TOKEN = process.env.LINE_TOKEN;

// 📤 ส่งเข้า LINE
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

        console.log("✅ SEND OK");
    } catch (err) {
        console.log("❌ ERROR:", err.response?.data || err.message);
    }
}

// 🔥 รับ order จากเว็บ
app.post("/order", async (req, res) => {
    const { item, qty } = req.body;

    const orderText = `🍽 ออเดอร์ใหม่\nรายการ: ${item} x ${qty}`;

    console.log("ORDER:", orderText);

    // ยิงเข้า LINE (admin)
    const adminUserId = process.env.ADMIN_USER_ID;

    await sendLine(adminUserId, orderText);

    res.json({ success: true });
});

// 🔥 webhook (รับ user chat)
app.post("/webhook", async (req, res) => {
    const events = req.body.events;

    if (Array.isArray(events)) {
        for (const event of events) {

            if (event.type === "message") {
                const userId = event.source.userId;
                const text = event.message.text;

                console.log("CHAT:", text);

                await sendLine(userId, "📩 คุณส่งมา: " + text);
            }
        }
    }

    res.sendStatus(200);
});

// test
app.get("/", (req, res) => {
    res.send("🍔 Food Order System Running");
});

// run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));