const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Parses incoming JSON request bodies (needed for POST requests)
app.use(express.json());

// Serves everything in /public as static files — including index.html,
// which Express serves automatically at "/". That page fetches /names
// itself and renders the list in the browser.
app.use(express.static(path.join(__dirname, "public")));

// In-memory list of names — resets when the server restarts.
let names = [];

// ---------- GET /names ----------
// Return the full list of names that have been added so far.
app.get("/names", (req, res) => {
  res.json(names);
});

// ---------- POST /names ----------
// Add a new name to the list.
// - Rejects the request if `name` is missing.
// - Rejects the request if that name has already been added.
// - Stores each entry with a timestamp of when it was added.
app.post("/names", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  const alreadyExists = names.some((entry) => entry.name === name);
  if (alreadyExists) {
    return res.status(400).json({ message: `${name} has already been added!` });
  }

  const entry = { name, addedAt: new Date().toISOString() };
  names.push(entry);

  res.status(201).json({ message: `${name} added!`, entry, names });
});

// ---------- DELETE /names/:name ----------
// Remove a name from the list, in case someone changes their mind.
app.delete("/names/:name", (req, res) => {
  const { name } = req.params;
  const before = names.length;
  names = names.filter((entry) => entry.name !== name);

  if (names.length === before) {
    return res.status(404).json({ message: `${name} was not found.` });
  }

  res.json({ message: `${name} removed.`, names });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
