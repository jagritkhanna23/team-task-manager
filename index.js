const cors = require("cors");

app.use(cors({
  origin: "*"
}));
const express = require("express");
const app = express();
//app.use(cors());
 //origin: "http://localhost:3000"
const db = require("./db");

app.use(express.json());

/* -------- BASIC -------- */
app.get("/", (req, res) => {
  res.send("Server running");
});

/* -------- AUTH (still simple) -------- */
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    (err) => {
      if (err) return res.send(err);
      res.send("Signup done");
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.send(err);

      if (result.length > 0) {
        res.send("Login success");
      } else {
        res.send("Wrong details");
      }
    }
  );
});

/* -------- PROJECTS -------- */
app.post("/projects", (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO projects (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.send(err);

      res.send({
        id: result.insertId,
        name
      });
    }
  );
});

app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

/* -------- TASKS -------- */
app.post("/tasks", (req, res) => {
  const { title, projectId } = req.body;

  db.query(
    "INSERT INTO tasks (title, status, projectId) VALUES (?, ?, ?)",
    [title, "TODO", projectId],
    (err, result) => {
      if (err) return res.send(err);

      res.send({
        id: result.insertId,
        title,
        projectId,
        status: "TODO"
      });
    }
  );
});

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

app.put("/tasks/:id", (req, res) => {
  db.query(
    "UPDATE tasks SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Task updated");
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Task deleted");
    }
  );
});

/* -------- DASHBOARD -------- */
app.get("/dashboard", (req, res) => {
  db.query("SELECT * FROM tasks", (err, tasks) => {
    if (err) return res.send(err);

    const total = tasks.length;
    const done = tasks.filter(t => t.status === "DONE").length;
    const pending = tasks.filter(t => t.status !== "DONE").length;

    res.send({ total, done, pending });
  });
});

/* -------- SERVER -------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});