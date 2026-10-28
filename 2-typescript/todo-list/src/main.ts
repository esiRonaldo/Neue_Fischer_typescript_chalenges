interface Todo {
    id: number
    text: string
    done: boolean
}

const input = document.getElementById('todo-input')
const addButton = document.getElementById('add-todo')
const list = document.getElementById('todo-list')

if (!(input instanceof HTMLInputElement))
    throw new Error('Element #todo-input not found')
if (!(addButton instanceof HTMLButtonElement))
    throw new Error('Element #add-todo not found')
if (!(list instanceof HTMLUListElement))
    throw new Error('Element #todo-list not found')

const STORAGEKEY = 'todos'
const saveTodos = (): void => localStorage.setItem(STORAGEKEY, JSON.stringify(todos))
const loadTodos = (): unknown => {
    const saved = localStorage.getItem(STORAGEKEY)
    if (saved === null) return []
    try {
        return JSON.parse(saved)
    } catch {
        return []
    }
}

const savedTodos: unknown = loadTodos()

const isTodo = (value: unknown): value is Todo =>
    typeof value === 'object' &&
    value !== null &&
    'id' in value && typeof value.id === 'number' &&
    'text' in value && typeof value.text === 'string' &&
    'done' in value && typeof value.done === 'boolean'

let todos: Todo[] = Array.isArray(savedTodos) ? savedTodos.filter(isTodo) : []

const render = (todos: Todo[]): void => {
    list.replaceChildren(...todos.map(todo => {
        const item = document.createElement('li')
        item.dataset.id = String(todo.id)

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.done

        const text = document.createElement('span')
        text.textContent = todo.text
        text.style.textDecoration = todo.done ? 'line-through' : 'none'

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'

        item.append(checkbox, text, deleteButton)
        return item
    }))
}

render(todos)


const addToList = (text: string): void => {
    if (text.trim() === '') return
    todos.push(createTodo(text.trim()))
    saveTodos()
    render(todos)
}

const createTodo = (text: string): Todo => {
    let maxId = 0
    for (const todo of todos) {
        maxId = Math.max(maxId, todo.id)
    }
    return { id: maxId + 1, text, done: false }
}

addButton.addEventListener('click', () => {
    addToList(input.value)
    input.value = ''
})

list.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    const item = target.closest('li')
    if (!item) return
    const id = Number(item.dataset.id)


    if (target instanceof HTMLInputElement) {
        const todo = todos.find((todo) => todo.id === id)
        if (todo) todo.done = target.checked
    }
    else if (target instanceof HTMLButtonElement) {
        todos = todos.filter((todo) => todo.id !== id)
    }
    else return
    saveTodos()
    render(todos)
})