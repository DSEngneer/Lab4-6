import { useCallback, useEffect, useMemo, useState } from "react";

const BASE = "https://dummyjson.com/todos";

export default function useTodos({ initialLimit = 10 } = {}) {
  const [rawTodos, setRawTodos] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1); 
  const [limitPerPage, setLimitPerPage] = useState(initialLimit);
  const [totalTodos, setTotalTodos] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const skip = useMemo(() => (currentPage - 1) * limitPerPage, [currentPage, limitPerPage]);

  const fetchPage = useCallback(async (page = currentPage, limit = limitPerPage) => {
    const skipVal = (page - 1) * limit;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}?limit=${limit}&skip=${skipVal}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      setRawTodos(Array.isArray(data.todos) ? data.todos : []);
      setTotalTodos(typeof data.total === "number" ? data.total : data.todos?.length ?? 0);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limitPerPage]);

  useEffect(() => {
    fetchPage(currentPage, limitPerPage);
  }, [fetchPage, currentPage, limitPerPage]);

  const goToNextPage = useCallback(() => {
    const maxPage = Math.max(1, Math.ceil(totalTodos / limitPerPage));
    setCurrentPage(prev => Math.min(maxPage, prev + 1));
  }, [limitPerPage, totalTodos]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const setLimit = useCallback((newLimit) => {
    setLimitPerPage(Number(newLimit) || 1);
    setCurrentPage(1);
  }, []);

  const todos = useMemo(() => {
    if (!searchTerm) return rawTodos;
    const term = searchTerm.toLowerCase();
    return rawTodos.filter(t => (t.todo || "").toLowerCase().includes(term));
  }, [rawTodos, searchTerm]);

  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setRawTodos(prev => prev.filter(t => t.id !== id));
      setTotalTodos(prev => Math.max(0, prev - 1));
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
      setRawTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    } catch (err) {
      setError(err);
      throw err; 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editTodoTitle = useCallback(async (id, newTitle) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: newTitle }),
      });
      if (!res.ok) throw new Error(`Edit failed: ${res.status}`);
      const updated = await res.json();
      setRawTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    } catch (err) {
      setError(err);
      throw err;
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
    setRawTodos(prev => [newTodo, ...prev]);
    setTotalTodos(prev => prev + 1);
  }, []);

  return {
    todos,
    rawTodos, 
    isLoading,
    error,

    currentPage,
    limitPerPage,
    totalTodos,
    searchTerm,

    goToNextPage,
    goToPrevPage,
    setLimit,
    setSearchTerm,
    deleteTodo,
    toggleTodo,
    editTodoTitle,
    addTodoLocal,
  };
}
