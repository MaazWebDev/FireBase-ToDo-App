import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export default function Edit({ todo, index, setTodo, item, setEditedIndex }) {
  const [updateTodo, setUpdatodo] = useState(item.todoItem);
  const handleEdit = async () => {
    const trimmedTodo = updateTodo.trim();
    if (trimmedTodo) {
      try {
        let newUpdatedArr = [...todo];
        newUpdatedArr[index].todoItem = trimmedTodo;
        setTodo([...newUpdatedArr]);
        setEditedIndex(false);
        const todoRef = doc(db, "Todo_lists", newUpdatedArr[index].todoId);
        await updateDoc(todoRef, {
          todoItem: trimmedTodo,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Todo item cannot be empty or just whitespace.");
    }
  };

  return (
    <>
      <InputGroup className="todo-inp">
        <Form.Control
          placeholder="Enter Updated Todo"
          value={updateTodo}
          onChange={(e) => setUpdatodo(e.target.value)}
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
        />
        <Button onClick={handleEdit} type="button" variant="primary">
          Update
        </Button>{" "}
      </InputGroup>
    </>
  );
}