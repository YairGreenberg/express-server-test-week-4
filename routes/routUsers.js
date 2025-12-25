import express from "express";
import { readDataFromFile, WriteDataToFile } from "../utils/fileHandler.js";
import authenticateUser from "../middleware/auth.js";

const routerUser = express();

const USERS_PATH = "./db/users.json";
const RECEIPTS_PATH = "./db/receipts.json";

routerUser.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);

    const users = await readDataFromFile(USERS_PATH);
    const existingUser = users.find((use) => use.username === username);
    if (existingUser) {
      return res.status(400).json({ massege: "User already exists" });
    }
    const newUser = { username, password };
    console.log(newUser);

    users.push(newUser);
    await WriteDataToFile(USERS_PATH, users);
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(`Error adding user: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

routerUser.get("/:username/summary", authenticateUser, async (req, res) => {
  try {
    const user_name = req.params.username;
    const receipts = await readDataFromFile(RECEIPTS_PATH);
    const list_receips = receipts.filter(
      (receipt) => receipt.username === user_name
    );

    if (!receipts) {
      return res
        .status(400)
        .json({ totalTicketsBought: 0, events: 0, averageTicketsPerEvent: 0 });
    }
    let list_quantity = 0;
    let list_nameEvents = [];
    for (let quantity of list_receips) {
      list_quantity += quantity.quantity;
      list_nameEvents.push(quantity.eventName);
    }
    const averageTicketsPerEvent1 = list_quantity / list_nameEvents.length;
    res
      .status(200)
      .json({
        totalTicketsBought: list_quantity,
        events: list_nameEvents,
        averageTicketsPerEvent: averageTicketsPerEvent1,
      });
  } catch (error) {
    console.error(`Error summary user: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default routerUser;
