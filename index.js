import { connectScratch } from "./scratch.js";
import { db } from "./firebase.js";
import { caesarDecode } from "./crypto.js";
import { askGemini } from "./gemini.js";

const cloud = await connectScratch();
let last = 0;

cloud.on("set", async (name, value) => {
  if (name !== "req_flag" || value !== "1") return;
  if (Date.now() - last < 1200) return; // レート制御
  last = Date.now();

  cloud.get("req_session", async session => {
    cloud.get("req_data", async enc => {
      const snap = await db.ref(`requests/${session}`).get();
      if (snap.exists()) return;

      await db.ref(`requests/${session}`).set({ t: Date.now() });

      const decoded = caesarDecode(String(enc), 3);
      const answer = await askGemini(decoded);

      await db.ref(`responses/${session}`).set(answer);
      cloud.set("result", answer.replace(/\D/g,"").slice(0,200)); // 数字のみ
      cloud.set("req_flag", 2);
    });
  });
});
