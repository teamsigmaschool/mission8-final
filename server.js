const express = require("express");
// Imports the Express library so we can build the server

const path = require("path");
// Imports Node's built-in "path" module — used to safely build file paths
// (needed below to point to the "public" folder, regardless of OS)

const app = express();
// Creates the Express application — this is what we attach all routes to

const PORT = process.env.PORT || 3000;
// Sets the port the server runs on.
// process.env.PORT lets a hosting platform (like Render or Vercel) assign its own port;
// falls back to 3000 when running locally, where no such variable is set

// Parses incoming JSON request bodies (needed for POST requests)
app.use(express.json());

// Serves everything in /public as static files including index.html,
// which Express serves automatically at "/". That page fetches /names
// itself and renders the list in the browser.
app.use(express.static(path.join(__dirname, "public")));

// In-memory list of names,resets when the server restarts.
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

  // ✅ CHALLENGE 1:Block Duplicate Names
  // .some() checks if ANY existing entry already has this name.
  // If so, we return early with a 400 error,the code below never runs,
  // so the name never gets added twice.
  const alreadyExists = names.some((entry) => entry.name === name);
  if (alreadyExists) {
    return res.status(400).json({ message: `${name} has already been added!` });
  }

  // ✅ CHALLENGE 2:Add a Timestamp
  // Instead of storing just the plain name string, we store an object
  // with an `addedAt` field set to the current date/time.
  const entry = { name, addedAt: new Date().toISOString() };
  names.push(entry);

  res.status(201).json({ message: `${name} added!`, entry, names });
});

// ---------- DELETE /names/:name ----------
// ✅ CHALLENGE 3:Add a DELETE Endpoint
// This whole route is the solution. req.params reads the name straight
// out of the URL (e.g. /names/Alex → req.params.name is "Alex"), and
// .filter() rebuilds the array with every entry EXCEPT that one.
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
