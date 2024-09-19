import { deleteDoc, doc } from "firebase/firestore";
import Button from "react-bootstrap/Button";
import { db } from "./firebaseConfig";
import { useState } from "react";
import { ColorRing } from "react-loader-spinner";
import Swal from "sweetalert2";

export default function DeleteTodo({ setTodo, todo, index, isEdited }) {
  const isButtonDisabled = isEdited === index;
  const [loader, setLoader] = useState(null);
  const deleteTodo = () => {
    try {
      setLoader(true);
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        iconColor: "red",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
        await deleteDoc(doc(db, "Todo_lists", todo[index].todoId));
        todo.splice(index, 1);
        setTodo([...todo]);
        setLoader(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button onClick={deleteTodo} disabled={isButtonDisabled} variant="danger">
      Delete
      {loader ? (
        <ColorRing
          visible={true}
          height="25"
          width="25"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      ) : null}
    </Button>
  );
}