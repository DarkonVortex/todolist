const express = require("express");
const cors = require("cors");
const { readData, addData, removeData } = require("./utils.js");
const User = require('./user.model');
const bcrypt = require("bcrypt");

const app = express()
const PORT = 3000;

app.use(cors())
app.use(express.json())

// Connection to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://darkonvortex:2627229p@cluster0.tvfkjtl.mongodb.net/todoListApp?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error al conectar:', err));

// GET all tasks
app.get("/todos", async (req, res) => {
    try {
        const jsonData = await readData()

        const limit = req.query._limit ? parseInt(req.query._limit) : undefined
        const limitedData = limit ? jsonData.slice(0, limit) : jsonData

        res.json(limitedData)
    } catch (error) {
        console.error("Error getting tasks:" , error)       
    }
})

//GET a single task
app.get("/todos/:id", async (req, res) => {
    try {
        const jsonData= await readData()
        const task = jsonData.find(task => task.id === parseInt(req.params.id))

        if (!task) {
            return res.status(400).json({ ërror: "Task not found" })            
        }

        res.json(task)
    } catch (error) {
        console.log("Error getting task:", error)
        res.status(500).json({ error: "failed to fech task" })        
    }
})

// POST a new task
app.post("/todos", async (req, res) => {
    try {
        const { title, userId } = req.body
        if (!title) {
            return res.status(400).json({error:"Title is required"})
        }

        const newTask = {
            id: Date.now(),
            userId: userId || Date.now(),
            title,
            completed: false
        }

        await addData(newTask)
        res.status(201).json(newTask)

    } catch (error) {
        console.error("Error adding task:", error)
        res.status(500).json({error:"failed to add task"})        
    }    
})

// DELETE a task
app.delete("/todos/:id", async (req, res) => {
    try {
        const taskId = parseInt(req.params.id)

        console.log("taskID:" + taskId)

        const removed = await removeData(taskId)

        if (!removed) {
            return res.status(404).json({error:"Task not found"})
        }

        res.json({})
    } catch (error) {
        console.error("Error deleting task:", error)
        res.status(500).json({error:"failed to delete task"})
    }
    
})

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body
        
        const userExistence = await User.findOne({ email })
        if (userExistence) {
            return res.status(400).json({ message: "este email ya está regitrado." })
        }

        const newUser = new User({ username, email, password })
        await newUser.save()
        return res.status(201).json({ message: "usuario registrado con éxito." })
    } catch (error) {
        console.error("Error en /register", error)
        res.status(500).json({ message: "error al registrar el usuario" })        
    }    
})

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Verificar si el usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Correo o contraseña incorrectos" });
      }
      
      // Verificar la contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Correo o contraseña incorrectos" });
      }
      
      // Si la autenticación es exitosa, devolver información del usuario (sin la contraseña)
      const userInfo = {
        id: user._id,
        username: user.username,
        email: user.email
      };
      console.log(userInfo)

      return res.status(200).json({ 
        message: "Inicio de sesión exitoso", 
        user: userInfo 
      });


    } catch (error) {
      console.error("Error en /login", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });

// start the server
app.listen(PORT, () => {
    console.log(`Sever running on http://localhost:${PORT}`)
})
