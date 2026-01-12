import admin from "firebase-admin";
import fs from "fs";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(fs.readFileSync("serviceAccountKey.json"))
  ),
  databaseURL: process.env.FIREBASE_DB_URL
});

export const db = admin.database();
