const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔑 ใส่ Channel Access Token ของคุณ
const LINE_TOKEN = "p17PUfG/xDUVD/ieH7o7m+HioOr9vZr6Ooha4ggpXaeI4LMCWzX7fRRNmW88LfKm+As3i7aWdGUoDJ5dU0NA3b/8X02VP7HOFCqRFOtthvCXjuT8A9nuHaBTFnI4HryDD98vtEc42c1/T3Ipxgt6EAdB04t89/1O/w1cDnyilFU=";

// 📲 ฟังก์ชันยิงข้อความเข้า LINE
async function sendLine(userId, message) {
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
}

// 🔥 webhook รับ event จาก LINE
app.post("/webhook", async (req, res) => {
    console.log("LINE EVENT:");
    console.log(JSON.stringify(req.body, null, 2));

    const events = req.body.events;

    if (events && events.length > 0) {
        const event = events[0];

        if (event.source && event.source.userId) {
            const userId = event.source.userId;

            // 💬 ส่งข้อความกลับ
            await sendLine(userId, "✅ มีออเดอร์เข้าแล้ว!");
        }
    }

    res.sendStatus(200);
});

// 🧪 test server
app.get("/", (req, res) => {
    res.send("Server running");
});

// 🚀 run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));