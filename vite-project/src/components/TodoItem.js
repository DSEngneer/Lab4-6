import React, { useState, useEffect } from "react";
export default function TodoItem({ todo, onToggle, onDelete }) {
  const { id, todo: text } = todo;
  const [completed, setCompleted] = useState(Boolean(todo.completed));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCompleted(Boolean(todo.completed));
  }, [todo.completed]);

  const handleToggle = async () => {
    const newVal = !completed;
    setCompleted(newVal);
    setIsSaving(true);
    try {
      await onToggle(id, newVal);
    } catch (err) {
      setCompleted(!newVal);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    await onDelete(id);
  };

  const style = {
    textDecoration: completed ? "line-through" : "none",
    opacity: completed ? 0.6 : 1,
  };

  return (
    <li style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0" }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        disabled={isSaving}
        aria-label={`Toggle ${text}`}
      />
      <span style={{ flex: 1, ...style }}>{text}</span>
      <button onClick={handleDelete} aria-label={`Delete ${text}`}>Delete</button>
    </li>
  );
}
