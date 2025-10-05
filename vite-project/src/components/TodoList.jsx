import React, { useState } from "react";
import TodoItem from "./TodoItem";
import useTodos from "../hooks/useTodos";
export default function TodoList() {
  const { todos, isLoading, error, deleteTodo, toggleTodo, addTodoLocal } = useTodos();
  const [newText, setNewText] = useState("");

  const handleAdd = () => {
    if (!newText.trim()) return;
    addTodoLocal(newText);
    setNewText("");
  };

  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h2>Todos</h2>

      {/* Add input */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a new task"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ flex: 1 }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* Status */}
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>Error: {error.message || String(error)}</div>}

      {/* Todo list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.length === 0 && !isLoading && <li>No todos found.</li>}
        {todos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </section>
  );
}
