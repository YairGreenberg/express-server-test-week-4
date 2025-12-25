import { readDataFromFile } from "../utils/fileHandler.js";
const USERS_PATH = "./db/users.json";

export default async function authenticateUser(req, res, next) {
  try {
    const username = req.headers["x-username"];
    const password = req.headers["x-password"];

    if (!username || !password) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing credentials" });
    }
    const users = await readDataFromFile(USERS_PATH);
    const user = users.find(
      (use) => use.username === username && use.password === password
    );

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid credentials" });
    }
    next();
  } catch (error) {
    console.error(`Authentication error: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


