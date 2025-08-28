// hooks/useUndoRedo.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { undo, redo } from "../store/canvasSlice";

export default function useUndoRedo() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        dispatch(undo());
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        dispatch(redo());
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dispatch]);
}
