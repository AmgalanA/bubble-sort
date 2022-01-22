const express = require('express');
const app = express();
const cors = require('cors');
const pool = require("./db");

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Save sort result

app.post('/sort', async (req, res) => {
    try {
        const { id, splittedValues } = req.body;

        const storedNumbers = await pool.query('INSERT INTO array_values VALUES($1, $2) RETURNING *', [id, splittedValues])
        
        res.json(storedNumbers.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

// Get sort result

app.get('/sort', async (req, res) => {
    try {
        const sortResult = await pool.query("SELECT * FROM array_values");

        res.json(sortResult.rows);
    } catch (error) {
        console.error(error.message);
    }
});

// Get specific sort result
app.get('/sort/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const sortResult = await pool.query("SELECT * FROM array_values WHERE id = $1", [id]);

        res.json(sortResult.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

// Delete sort
app.delete("/sort/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteTodo = await pool.query("DELETE FROM array_values WHERE id = $1", [id]);
    
        res.json(`Sort with id: ${id}, was successfully deleted.`);
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});