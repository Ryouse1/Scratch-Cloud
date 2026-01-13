import { connectScratch } from "./scratch.js";
import { caesarDecode } from "./crypto.js";
import { askGemini } from "./gemini.js";
import { db } from "./firebase.js";

const cloud = await connectScratch();
let last = 0;

cloud.on("set", async (name, value) => {
  if (name !== "req_flag" || value !== "1") return;
  if (Date.now() - last < 1200) return;
  last = Date.now();

  const session = await cloud.get("req_session");
  const enc = await cloud.get("req_data");

  const snap = await db.ref(`requests/${session}`).get();
  if (snap.exists()) return;

  await db.ref(`requests/${session}`).set({ t: Date.now() });

  const decoded = caesarDecode(String(enc), 3);
  const answer = await askGemini(decoded);

  await db.ref(`responses/${session}`).set(answer);

  // 数字のみ返す（Scratch制限）
  cloud.set("result", answer.replace(/\D/g, "").slice(0, 200));
  cloud.set("req_flag", 2);
});
