import React, { useEffect, useState } from "react"
import {Link} from 'react-router-dom'
import "./TaskPage.css"
const api_base = "http://localhost:5000";

export default function TaskPage() {
	const [todos, setTodos] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState("");
  
	useEffect(() => {
	  GetTodos();
	}, []);
  
	const GetTodos = () => {
	  fetch(api_base + "/todos")
		.then((res) => res.json())
		.then((data) => setTodos(data))
		.catch((err) => console.error("Error: ", err));
	};
  
	const completeTodo = async (id) => {
	  const data = await fetch(api_base + "/todo/complete/" + id).then((res) =>
		res.json()
	  );
  
	  setTodos((todos) =>
		todos.map((todo) => {
		  if (todo._id === data._id) {
			todo.complete = data.complete;
		  }
  
		  return todo;
		})
	  );
	};
  
	const addTodo = async () => {
	  const data = await fetch(api_base + "/todo/new", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  text: newTodo,
		}),
	  }).then((res) => res.json());
  
	  setTodos([...todos, data]);
  
	  setPopupActive(false);
	  setNewTodo("");
	};
  
	const deleteTodo = async (id) => {
	  const data = await fetch(api_base + "/todo/delete/" + id, {
		method: "DELETE",
	  })
		.then((res) => res.json())
		.catch((err) => console.error(err));
	  console.log("data");
	  console.log(data);
	  setTodos((todos) => todos.filter((todo) => todo._id !== data.result._id));
	};
  
	return (
	  <div className="App">
		<h1>Welcome to Notify</h1>
		<h4>Your tasks</h4>
  
		<div className="todos">
		  {todos.length > 0 ? (
			todos.map((todo) => (
			  <div
				className={"todo" + (todo.complete ? " is-complete" : "")}
				key={todo._id}
				onClick={() => completeTodo(todo._id)}
			  >
				<div className="checkbox"></div>
  
				<div className="text">{todo.text}</div>
  
				<div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
				  x
				</div>
			  </div>
			))
		  ) : (
			<p style={{color: "black", paddingBottom: "20px"}}>You currently have no tasks</p>
		  )}
		</div>
  
<div style={{display: "flex", justifyContent: "space-around"}}>
		<div className="addPopup" onClick={() => setPopupActive(true)}>
		  +
		</div>
		
		<Link to="/video">
     <button className="button-video" type="button">
          VIDEO call
     </button>
 </Link>
		
		
		</div>
  
		{popupActive ? (
		  <div className="popup">
			<div className="closePopup" onClick={() => setPopupActive(false)}>
			  X
			</div>
			<div className="content">
			  <h3>Add Task</h3>
			  <input
				type="form"
				className="add-todo-input"
				onChange={(e) => setNewTodo(e.target.value)}
				value={newTodo}
			  />
			  <div className="button" onClick={addTodo}>
				Create Task
			  </div>
			</div>
		  </div>
		) : (
		  ""
		)}
	  </div>
	);
  }
  