App --> TodoList
TodoList --> AddTodoForm
TodoList --> TodoItem
TodoList --- useTodos

subgraph useTodosHook
A[todos state]
B[isLoading]
C[error]
D[deleteTodo(id)]
E[toggleTodo(id, completed)]
F[addTodoLocal(text)]
end

TodoItem -->|onToggle| useTodos
TodoItem -->|onDelete| useTodos
AddTodoForm -->|onAdd| useTodos

Пояснення:
useTodos містить єдине джерело істини для списку та логіку API:
TodoList зчитує todos і передає їх у TodoItem через props.
TodoItem зберігає локальний стан completed (для негайної реакції) і викликає toggleTodo(id, completed) для оновлення на API.
Видалення виконується через deleteTodo(id) із хуку.
Додавання todo є локальним (без POST-запиту до API) і використовує addTodoLocal(text) для оновлення стану хуку.
------------Lab_4-----------------