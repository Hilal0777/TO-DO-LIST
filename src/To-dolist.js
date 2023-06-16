// TodoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [updatedText, setUpdatedText] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/todos/');
            setTodos(response.data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    };

    const addTodo = async () => {
        if (text.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:5000/todos/', { text });
            setTodos([...todos, response.data]);
            setText('');
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const updateTodo = async (id, text, completed, editing) => {
        try {
            const response = await axios.put(`http://localhost:5000/todos/${id}`, {
                text,
                completed,
                editing,
            });
            const updatedTodos = todos.map((todo) => (todo._id === id ? response.data : todo));
            setTodos(updatedTodos);
            setUpdatedText('');
            setEditId(null);
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${id}`);
            const updatedTodos = todos.filter((todo) => todo._id !== id);
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const cancelEdit = () => {
        setUpdatedText('');
        setEditId(null);
    };

    return (
        <div className="todo-container">
            <h2>To-Do List</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addTodo();
                }}
            >
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter a new task..."
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map((todo) => (
                    <li key={todo._id}>
                        {editId === todo._id ? (
                            <>
                                <input
                                    type="text"
                                    value={updatedText}
                                    onChange={(e) => setUpdatedText(e.target.value)}
                                    onBlur={() => updateTodo(todo._id, updatedText, false)}
                                />
                                <button className="edit-button" onClick={cancelEdit}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span
                                    style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                                    onDoubleClick={() => {
                                        const updatedTodos = todos.map((item) => ({
                                            ...item,
                                            editing: item._id === todo._id,
                                        }));
                                        setTodos(updatedTodos);
                                        setUpdatedText(todo.text);
                                        setEditId(todo._id);
                                    }}
                                >
                                    {todo.text}
                                </span>
                                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div >
    );
};

export default TodoList;
