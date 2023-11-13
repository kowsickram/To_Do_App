import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [viewdata, setViewdata] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getTodos');
      setTodoList(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/addTodo', { text: newTodo });
      setTodoList([...todoList, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteTodo/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id, updatedText) => {
    try {
      await axios.put(`http://localhost:5000/api/updateTodo/${id}`, { text: updatedText });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const toggleViewData = () => {
    setViewdata(!viewdata);
  };

  return (
    <div className="bg-gray-200 min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg drop-shadow-xl">
        <h1 className="text-2xl text-center font-bold mb-4">To-Do List</h1>
        <div className="flex">
        <input
            type="text"
            placeholder="Add Task"
            className="flex-grow p-2 border rounded-md mr-2"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button className="bg-black text-white px-4 py-2 rounded-md mr-4" onClick={addTodo}>
            Add
          </button>
          {viewdata ? (
            <button className="bg-black text-white px-4 py-2 rounded-md" onClick={toggleViewData}>
              Hide
            </button>
          ) : (
            <button className="bg-black text-white px-4 py-2 rounded-md" onClick={toggleViewData}>
              View
            </button>
          )}
        </div>
        {viewdata ? (
          <ul className="mt-4">
            {todoList.map((todo) => (
              <li key={todo._id} className="flex items-center justify-between p-2 border-b">
              <p>{todo.text}</p>
                <p className="text-xs text-gray-500">{new Date(todo.date).toLocaleString()}</p>
                <div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      const updatedText = prompt('Enter updated text', todo.text);
                      if (updatedText) {
                        updateTodo(todo._id, updatedText);
                      }
                    }}
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
