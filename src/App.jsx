import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Edit from "./Edit";
import './style.css';
import DeleteTodo from "./DeleteTodo";
import { db, collection, addDoc, getDocs, updateDoc, doc } from "./firebaseConfig";
import { Puff, ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";

export default function App() {
  const [isEdited, setEditedIndex] = useState(null); 
  const [todo, setTodo] = useState([]);               
  const [loading, setLoading] = useState(true);        
  const [loader, setLoader] = useState(null);   
  const todoVal = useRef();                   

  // Add a new todo
  async function addTodo(e) {
    e.preventDefault();
    const newTodo = todoVal.current.value;

    if (!newTodo) {
      Swal.fire({
        icon: "warning",
        iconColor: "red",
        title: "Please Enter Todo",
        position: "top",
      });
      return;
    }
    setLoader(true);
    const docRef = await addDoc(collection(db, "Todo_lists"), {
      todoItem: newTodo,
    });
    setTodo((prevTodo) => [
      ...prevTodo,
      { todoItem: newTodo, todoId: docRef.id },
    ]);
    todoVal.current.value = "";
    setLoader(false);
  }

  // Fetch todos from Firestore
  const getTodos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Todo_lists"));
      const todosArray = querySnapshot.docs.map((doc) => ({
        todoItem: doc.data().todoItem,
        todoId: doc.id,
      }));
      setTodo(todosArray);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  
  const startEdit = (index) => {
    setEditedIndex(index);
  };
  const updateTodo = async (index) => {
    try {
      const todoToUpdate = todo[index];
      const todoRef = doc(db, "Todo_lists", todoToUpdate.todoId);

      await updateDoc(todoRef, {
        todoItem: todoToUpdate.todoItem,
      });

      setEditedIndex(null);

      Swal.fire({
        icon: "success",
        title: "Todo Updated Successfully",
        position: "top",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="text-center mb-4 text-primary todo-heading">TODO APP</h1>
      <div className="todo-div">
        <form className="todo-form" onSubmit={addTodo}>
          <InputGroup className="mb-3 todo-inp">
            <Form.Control
              placeholder="Enter Todo"
              ref={todoVal}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
            <Button type="submit" variant="primary">
              Add Todo
              {loader ? (
                <ColorRing
                  visible={true}
                  height="25"
                  width="25"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{}}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              ) : null}
            </Button>
          </InputGroup>
          {loading ? (
            <div
              style={{ zIndex: 999, backgroundColor: "#fff" }}
              className="position-absolute top-50 start-50 translate-middle d-flex justify-content-center align-items-center w-100 h-100 zindex-100"
            >
              <Puff
                visible={true}
                height="100"
                width="100"
                color="rgb(13 110 253)"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            <ul className={todo.length > 0 ? "todo-list" : "none"}>
              {todo.map((item, index) => (
                <div className="singal-todo" key={index}>
                  {isEdited !== index ? (
                    <li>{item.todoItem}</li>
                  ) : (
                    <Form.Control
                      type="text"
                      defaultValue={item.todoItem}
                      onChange={(e) => setTodo((prev) =>
                        prev.map((todo, i) =>
                          i === index ? { ...todo, todoItem: e.target.value } : todo
                        )
                      )}
                    />
                  )}

                  <div className="singal-todo-buttons">
                    {isEdited !== index ? (
                      <>
                        <Button onClick={() => startEdit(index)} variant="info">
                          Edit
                        </Button>{" "}
                        <DeleteTodo
                          index={index}
                          todo={todo}
                          setTodo={setTodo}
                          isEdited={isEdited}
                        />
                      </>
                    ) : (
                      <Button onClick={() => updateTodo(index)} variant="success">
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
}
