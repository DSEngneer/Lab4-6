import React, { useEffect, useState } from "react";
export default function TodoItem({ todo, onToggle, onDelete, onEditTitle }) {
  const { id, todo: textFromProps } = todo;

  const [completed, setCompleted] = useState(Boolean(todo.completed));
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(textFromProps);

  useEffect(() => {
    setCompleted(Boolean(todo.completed));
    setDraft(todo.todo);
  }, [todo.completed, todo.todo]);

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

  const startEditing = () => setEditing(true);
  const cancelEditing = () => {
    setEditing(false);
    setDraft(textFromProps);
  };

  const saveEdit = async () => {
    if (draft.trim() === "") {
      alert("Title cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await onEditTitle(id, draft.trim());
      setEditing(false);
    } catch (err) {

      console.error(err);
      alert("Failed to save. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEditing();
  };

  const style = { textDecoration: completed ? "line-through" : "none", opacity: completed ? 0.65 : 1 };

  return (
    <li style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0" }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        disabled={isSaving}
        aria-label={`Toggle ${draft}`}
      />

      <div style={{ flex: 1 }}>
        {editing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            style={{ width: "100%" }}
          />
        ) : (
          <span style={style}>{textFromProps}</span>
        )}
      </div>

      {editing ? (
        <>
          <button onClick={saveEdit} disabled={isSaving}>Save</button>
          <button onClick={cancelEditing} disabled={isSaving}>Cancel</button>
        </>
      ) : (
        <>
          <button onClick={startEditing}>Edit</button>
          <button onClick={handleDelete} disabled={isSaving}>Delete</button>
        </>
      )}
    </li>
  );
}
