require("dotenv").config()

const express = require('express');
const app = express();

const errorhandler = require('./middlewares/errorHandler')
const logRequest = require('./middlewares/logger')
const validateTodo = require('./middlewares/validator')
const Todo = require('./models/todo.model')
const cors = require("cors")
const connectDB = require('./database/db')

app.use(express.json()); // Parse JSON bodies


app.use(cors('*'))
connectDB();
app.use(logRequest)




// GET All – Read
app.get('/todos', async (req, res) => {
  try {
    const filter = {};
    if(req.query.completed !== undefined){
      filter.completed = req.query.completed === 'true';
    }
    const todos = await Todo.find(filter);

     res.status(200).json(todos); // Send array as JSON

  } catch (error) {
    next(error);
  }
});

app.get('/todos/completed', async (req, res) => {
  try{
    const completed = await Todo.find({completed: true})
    res.json(completed); // Custom Read!

  }catch(error){
    next(error);

  }
});


app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if(!todo){
      return res.status(404).json({error: "Todo not Found"})
    }
    res.status(200).json(todo); // Send array as JSON
  } catch (error) {
    next(error);
  }
});

// POST New – Create

  app.post('/todos', validateTodo, async (req, res) => { 
    const {task, completed} = req.body;
    newTodo = new Todo({task, completed})
    await newTodo.save();

    try{
      const {task} = req.body;

  res.status(201).json(newTodo); // Echo back
  }catch (error) {
  next(error);
    }
  
});

// PATCH Update – Partial
app.patch('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, 
    {new:true})
    if (!todo){
      res.status(404).json({error: "Todo not Found"})
    }
    res.status(200).json(todo);

  } catch (error) {
    next(error);
  }
});


// DELETE Remove
app.delete('/todos/:id', async (req, res) => {
  try{
    const id = parseInt(req.params.id);
    const todo = await Todo.findByIdAndDelete(req.params.id)
    if(!todo) {
      res.status(404).json({error: "Todo not Found"})
    }
    res.status(204).json({message: `Todo ${req.params.id} deleted successfully`}); // Silent success
  }catch(error){
    next(error);

  }
});



app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
