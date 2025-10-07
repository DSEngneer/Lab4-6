//Lab_4

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

//Lab_5-6
App --> TodoList
TodoList --> AddTodoForm
TodoList --> SearchBar
TodoList --> PaginationControls
TodoList --> TodoItem
TodoList --- useTodos

subgraph useTodosHook
A[todos state (filtered + paginated)]
B[allTodos (raw data)]
C[isLoading]
D[error]
E[searchTerm]
F[currentPage]
G[limitPerPage]
H[totalTodos]
I[setSearchTerm(term)]
J[goToNextPage()]
K[goToPrevPage()]
L[setLimit(limit)]
M[deleteTodo(id)]
N[toggleTodo(id, completed)]
O[editTodoTitle(id, newTitle)]
P[addTodoLocal(text)]
end

SearchBar -->|onChange| useTodos
AddTodoForm -->|onAdd| useTodos
TodoItem -->|onToggle| useTodos
TodoItem -->|onDelete| useTodos
TodoItem -->|onEdit| useTodos
PaginationControls -->|onNext, onPrev, onLimitChange| useTodos

Пояснення:
useTodos діє як єдине джерело достовірної інформації для всіх даних та логіки Todo:
Обробляє операції CRUD за допомогою API DummyJSON (GET, PUT, DELETE).
Керує станом пагінації (currentPage, limitPerPage, totalTodos) та надає доступ до помічників навігації.
Зберігає пошуковий термін на стороні клієнта , фільтрує завдання внутрішньо та повертає лише відфільтровану + розбиту на сторінки підмножину.
Забезпечує локальне редагування (editTodoTitle), яке оновлює як API, так і локальний стан.
Зберігає прапорці завантаження та помилок для викликів API.
TodoList споживає дані з useTodos (шляхом деструктуризації) та розподіляє їх між компонентами інтерфейсу користувача.
SearchBar дозволяє користувачам вводити пошуковий термін — оновлює стан перехоплювача через setSearchTerm.
PaginationControls керує логікою пагінації — використовує функції пагінації хука.
AddTodoForm дозволяє користувачеві додавати нове завдання локально через addTodoLocal.
TodoItem обробляє власний локальний стан редагування/перемикання для забезпечення швидкодії, але оновлює стан сервера та глобальний стан через перехоплювач.