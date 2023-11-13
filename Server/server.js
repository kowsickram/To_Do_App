const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Bingo!🙌 Mongodb Connected"))

const TodoSchema = new mongoose.Schema({
  text: String,
  date: Date,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.post('/api/addTodo', async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new Todo({ text, date: Date.now() });
    await newTodo.save();
    res.json(newTodo);

  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'An error occurred while adding the todo.' });
  }
});

app.get('/api/getTodos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'An error occurred while fetching todos.' });
  }
});

app.delete('/api/deleteTodo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'An error occurred while deleting the todo.' });
  }
});

app.put('/api/updateTodo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text, date: Date.now() }, { new: true });
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'An error occurred while updating the todo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
