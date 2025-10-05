import { useEffect, useState, useCallback } from "react";
const BASE = "https://dummyjson.com/todos";

export default function useTodos() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE}`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        const list = Array.isArray(data.todos) ? data.todos : data;
        if (mounted) setTodos(list);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTodos();
    return () => { mounted = false; };
  }, []);

  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTodo = useCallback(async (id, completed) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      const updated = await res.json();

      setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTodoLocal = useCallback((text) => {
    if (!text || !text.trim()) return;
    const newTodo = {
      id: Date.now(),
      todo: text.trim(),
      completed: false,
      userId: 1,
    };
    setTodos(prev => [newTodo, ...prev]);
  }, []);

  return {
    todos,
    isLoading,
    error,
    deleteTodo,
    toggleTodo,
    addTodoLocal,
  };
}
