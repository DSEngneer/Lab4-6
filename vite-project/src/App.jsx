import React from "react";
import TodoList from "./components/TodoList.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", padding: 24 }}>
      <h1 style={{ textAlign: "center" }}>React Todos (useTodos hook) — Search, Pagination, Edit</h1>
      <TodoList />
    </div>
  );
}

