import express from "express";
import { readDataFromFile, WriteDataToFile } from "../utils/fileHandler.js";
import authenticateUser from "../middleware/auth.js";

const routerEvent = express();

const EVENT_PATH = "./db/events.json";

routerEvent.post("/events", authenticateUser, async (req, res) => {
  try {
    const { eventName, ticketsForSale, username, password } = req.body;

    const events = await readDataFromFile(EVENT_PATH);

    events.push({ eventName, ticketsForSale, username, password });

    await WriteDataToFile(EVENT_PATH, events);
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error(`Error creating event: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default routerEvent;
