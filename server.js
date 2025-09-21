const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { spawn } = require("child_process"); // for python AI script

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Local storage for hackathon (JSON file)
const DATA_FILE = "participants.json";

// Helper to read/write participants
function readParticipants() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeParticipants(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Add participant
app.post("/api/participants", (req, res) => {
  const { name, skills } = req.body;
  if (!name || !skills) return res.status(400).json({ error: "Invalid data" });

  const participants = readParticipants();
  participants.push({ name, skills });
  writeParticipants(participants);
  console.log(`Participant added: ${name}`);
  res.json({ success: true });
});

// Get participants
app.get("/api/participants", (req, res) => {
  const participants = readParticipants();
  res.json(participants);
});

// AI Team Matching
app.post("/api/match", (req, res) => {
  // Option 1: Node.js simple matching (rule-based)
  const participants  = readParticipants();
  if (participants.length < 2) return res.json({ error: "Not enough participants" });

  const teams = [];
  const shuffled = participants.sort(() => 0.5 - Math.random());
  const teamSize = 2; // simple 2 per team
  for (let i = 0; i < shuffled.length; i += teamSize) {
    teams.push(shuffled.slice(i, i + teamSize));
  }

  console.log("Teams formed:", teams);
  res.json({ teams });

  // Option 2: If using Python AI script
  // const py = spawn("python", ["aiEngine.py"]);
  // py.stdout.on("data", (data) => { console.log(data.toString()); });
});

// Reward Simulation / Automation
app.post("/api/reward", (req, res) => {
  const { address, amount } = req.body;
  console.log(`Reward triggered -> Wallet: ${address}, Amount: ${amount}`);
  // In real scenario → trigger smart contract / blockchain
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
