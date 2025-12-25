import express from "express";
import { readDataFromFile, WriteDataToFile } from "../utils/fileHandler.js";
import authenticateUser from "../middleware/auth.js";

const routerTickets = express();

const EVENT_PATH = "./db/events.json";
const RECEIPTS_PATH = "./db/receipts.json";

routerTickets.post("/tickets/buy", authenticateUser, async (req, res) => {
  try {
    const { username, password, eventName, quantity } = req.body;
    const events = await readDataFromFile(EVENT_PATH);
    const receipts = await readDataFromFile(RECEIPTS_PATH);
    const eventsIndex = events.findIndex(
      (event) => event.eventName === eventName
    );
    if (eventsIndex === -1) {
      return res.status(400).json({ error: "event not found" });
    }

    if (events[eventsIndex].ticketsForSale - quantity < 0) {
      return res
        .status(400)
        .json({ error: "There are not enough tickets required." });
    }
    receipts.push({ username, password, eventName, quantity });
    events[eventsIndex].ticketsForSale -= quantity;
    await WriteDataToFile(EVENT_PATH, events);
    await WriteDataToFile(RECEIPTS_PATH, receipts);
    res.status(201).json({ message: "Tickets purchased successfully" });
  } catch (error) {
    console.error(`Error creating receipt: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default routerTickets;
