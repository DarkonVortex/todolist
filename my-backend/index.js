const express = require("express");
const cors = require("cors");
const User = require("./user.model");
const Todo = require("./todo.model");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your-secret-key";
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connection to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://darkonvortex:2627229p@cluster0.tvfkjtl.mongodb.net/todoListApp?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar:", err));

// GET all tasks
app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const todos = await Todo.find({ userId });

    const limit = req.query._limit ? parseInt(req.query._limit) : undefined;
    const limitedData = limit ? todos.slice(0, limit) : todos;

    res.json(limitedData);
  } catch (error) {
    console.error("Error getting tasks:", error);
  }
});

//GET a single task
app.get("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // Find the specific todo by ID that belongs to the authenticated user
    const task = await Todo.findOne({ _id: taskId, userId });

    if (!task) {
      return res.status(400).json({ ërror: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.log("Error getting task:", error);
    res.status(500).json({ error: "failed to fech task" });
  }
});

// POST a new task
app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const { title, userId } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Create new task with the authenticated user's ID
    const newTask = new Todo({
      title,
      userId: req.user.userId,
      completed: false,
    });

    // Save to MongoDB
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "failed to add task" });
  }
});

// DELETE a task
app.delete("/todos/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.id;

    // Find and delete the task ensuring it belongs to the authenticated user
    const result = await Todo.findOneAndDelete({ _id: taskId, userId });

    if (!result) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "failed to delete task" });
  }
});

// UPDATE a task's completion status
app.patch("/todos/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const taskId = req.params.id;
        const { completed } = req.body;

        // Find and update the task
        const task = await Todo.findOneAndUpdate(
            { _id: taskId, userId },
            { completed },
            { new: true } // Return the updated document
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExistence = await User.findOne({ email });
    if (userExistence) {
      return res.status(400).json({ message: "este email ya está regitrado." });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({ message: "usuario registrado con éxito." });
  } catch (error) {
    console.error("Error en /register", error);
    res.status(500).json({ message: "error al registrar el usuario" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    // Verificar la contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Si la autenticación es exitosa, devolver información del usuario (sin la contraseña)
    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    console.log(userInfo);

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: userInfo,
      token: token,
    });
  } catch (error) {
    console.error("Error en /login", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`Sever running on http://localhost:${PORT}`);
});
