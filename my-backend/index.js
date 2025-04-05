// const { readData, addData } = require("./utils.js");

// async function main() {
//     const jsonData = await readData() 
//     console.log(jsonData)
// }

// main()

// const newTask = {
//     id: Date.now(),
//     name: "Nueva tarea",
//     status: "pendiente"
// };

// addData(newTask);

const express = require("express");
const cors = require("cors");
const { readData, addData, removeData } = require("./utils.js");

const app = express()
const PORT = 3000;

app.use(cors())
app.use(express.json())

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



// start the server
app.listen(PORT, () => {
    console.log(`Sever running on http://localhost:${PORT}`)
})
