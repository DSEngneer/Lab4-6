import React, { useState } from "react";
import useTodos from "../hooks/useTodos";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const {
    todos,
    rawTodos,
    isLoading,
    error,
    currentPage,
    limitPerPage,
    totalTodos,
    searchTerm,
    setSearchTerm,
    goToNextPage,
    goToPrevPage,
    setLimit,
    deleteTodo,
    toggleTodo,
    editTodoTitle,
    addTodoLocal,
  } = useTodos({ initialLimit: 10 });

  const [newText, setNewText] = useState("");

  const handleAdd = () => {
    if (!newText.trim()) return;
    addTodoLocal(newText);
    setNewText("");
  };

  const pageCount = Math.max(1, Math.ceil(totalTodos / limitPerPage));
  const showRangeStart = (currentPage - 1) * limitPerPage + 1;
  const showRangeEnd = Math.min(totalTodos, (currentPage - 1) * limitPerPage + rawTodos.length);

  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h2>Todos</h2>

      {/* controls: add, search */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Add a new task"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          style={{ flex: 1 }}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search current page..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />

        <label>
          Per page:
          <select
            value={limitPerPage}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{ marginLeft: 6 }}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {/* status */}
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>Error: {error.message || String(error)}</div>}

      {/* pagination info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          Showing {rawTodos.length > 0 ? `${showRangeStart}-${showRangeEnd}` : "0"} of {totalTodos}
        </div>
        <div>
          Page {currentPage} / {pageCount}
        </div>
      </div>

      {/* list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.length === 0 && !isLoading && <li>No todos match the search on this page.</li>}
        {todos.map(t => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEditTitle={editTodoTitle}
          />
        ))}
      </ul>

      {/* pagination controls */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={goToPrevPage} disabled={currentPage <= 1}>Previous</button>
        <button onClick={goToNextPage} disabled={currentPage >= pageCount}>Next</button>
      </div>
    </section>
  );
}
