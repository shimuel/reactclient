import React, { useState, useEffect } from "react";
import axios from 'axios'
import "./App.css";

const apiUrl = 'http://10.100.199.91:3001';
//const apiUrl = 'http://localhost:4001'
function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.description}

      <div>
        <button onClick={() => completeTodo(index)}>Complete</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function App() {

  //const [todos, setTodos] = useState([]);

  const [appState, setAppState] = useState({
    loading: false,
    todos: [],
  });

  useEffect(() => {
    setAppState({ loading: true, todos: []});
    const loadData = () => axios.get(`${apiUrl}/notes`).then((resp) => {     
      
      setAppState({ loading: false, todos:resp.data.notes });
    }).catch(function (error) {
      console.log(error);
    });

    loadData()
    
  }, [setAppState]);


  const addTodo = async text => {
    setAppState({ loading: true, todos: appState.todos});
    await axios.post(`${apiUrl}/note`,{
      description: text
    }).then((resp) => {     
      
      setAppState({ loading: false, todos:resp.data.notes });
    }).catch(function (error) {
      console.log(error);
    });
      
    // const newTodos = [...todos, { text }];
    // setTodos(newTodos);    
  };

  const completeTodo = index => {
    // const newTodos = [...todos];
    // newTodos[index].isCompleted = true;
    // setTodos(newTodos);
  };

  const removeTodo = async index => {
  
    setAppState({ loading: true, todos: appState.todos});
    let d = `${apiUrl}/note/${appState.todos[index]['_id']}`
    try{
      var config = {
        headers: {
            'User-Agent':'',
            'Accept':'',
            'Host':''
        }
    };
       axios.delete(d, config).then((resp) => {     
        appState.todos.splice(index, 1)
        setAppState({ loading: false, todos: appState.todos});
      }).catch(function (error) {
        console.log(error);
        setAppState({ loading: false, todos: appState.todos});
      });
      // const newTodos = [...todos];
    }catch(ex){
      console.log(ex);
    }
    // setTodos(newTodos);
  };

  return  (
    <div className="app">
      <div className="todo-list">
        {appState.todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;