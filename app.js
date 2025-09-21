const form = document.getElementById("participantForm");
const list = document.getElementById("participantList");
const matchBtn = document.getElementById("matchBtn");
const teamList = document.getElementById("teamList");
const rewardForm = document.getElementById("rewardForm");

// Add participant
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const skills = document.getElementById("skills").value.split(",").map(s => s.trim());

  if (!name || skills.length === 0) {
    alert("Please enter valid name and skills");
    return;
  }

  // Send data to backend
  await fetch("/api/participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, skills })
  });

  loadParticipants();
  form.reset();
});

// Load participants list
async function loadParticipants() {
  const res = await fetch("/api/participants");
  const data = await res.json();
  list.innerHTML = data.map(p => `<li>${p.name} - ${p.skills.join(", ")}</li>`).join("");
}
loadParticipants();

// AI Team Matching
matchBtn.addEventListener("click", async () => {
  const res = await fetch("/api/match", { method: "POST" });
  const data = await res.json();
  if (data.error) return alert(data.error);

  teamList.innerHTML = data.teams.map((team, i) =>
    `<li>Team ${i+1}: ${team.map(p => p.name).join(", ")}</li>`).join("");
});

// Reward Simulation
rewardForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const address = document.getElementById("address").value;
  const amount = document.getElementById("amount").value;

  await fetch("/api/reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, amount })
  });

  alert("Reward triggered! Check backend console.");
  rewardForm.reset();
});
