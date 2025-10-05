App --> TodoList
TodoList --> TodoItem
TodoList --> AddTodoForm
TodoList --- useTodos
subgraph useTodosHook
A[todos state]
B[isLoading]
C[error]
D[deleteTodo(id)]
E[toggleTodo(id)]
F[addLocalTodo(todo)]
end
TodoItem -->|onToggle| useTodos
AddTodoForm -->|onAdd| useTodos

useTodos` містить список джерел істини та логіку API.
- `TodoList` зчитує `todos` та передає кожен елемент до `TodoItem` через props.
- `TodoItem` зберігає власний стан інтерфейсу `completed` (для негайної реакції) та викликає `toggleTodo(id)` хука для збереження.
- Додавання todo є лише локальним (без POST до фальшивого API) та використовує `addLocalTodo` для оновлення стану хука.