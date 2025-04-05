const fs = require("fs").promises; // fs.promises permite usar async/await
const path = require("path");

const filePath = path.join(__dirname, "data.json");

async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error("Error leyendo archivo", error);
  }
}

async function addData(newData) {
  try {
    const data = await fs.readFile(filePath, "utf8");

    const jsonData = JSON.parse(data);

    jsonData.push(newData)

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    console.log("Datos agregados correctamente")
  } catch (error) {
    console.error("Error escribiendo los datos", error);
  }
}

async function removeData(taskId) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    const initialLength = jsonData.length
    const filteredData = jsonData.filter(task => task.id !== taskId)

    if (filteredData.length === initialLength) {
      return false;
    }

    await fs.writeFile(filePath, JSON.stringify(filteredData, null, 2));

    console.log("Task deleted succesfully")
  } catch (error) {
    console.error("Error deleting task", error);
  }
}

module.exports = { readData, addData, removeData };
