import path from "path";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import { bootStrap } from "./src/bootStrap.js";
import { scheduleJob } from "node-schedule";
import { User } from "./db/index.js";
const app = express();
const port = process.env.PORT || 3000;
dotenv.config({ path: path.resolve("./config/.env") });
// console.log(process.env.DB_URL);

connectDB();
bootStrap(app, express);
app.listen(port, () => {
  console.log("server is running on port", port);
});
// 2/1
// 1/2
const job = scheduleJob("1 1 1 * * *", async function () {
  const deletedUsers = await User.find({
    status: "deleted",
    updatedAt: { $lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 },
  }); // [{}],[]
  const userIds = deletedUsers.map((user) => user._id);
  console.log(deletedUsers);

  await User.deleteMany({ _id: { $in: userIds } });
});
