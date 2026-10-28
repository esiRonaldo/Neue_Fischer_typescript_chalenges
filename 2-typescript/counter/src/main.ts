const counter = document.getElementById('counter')
if (!(counter instanceof HTMLSpanElement)) throw new Error(`Element #counter not found`)

let count = 0
const render = (): void => {
    counter.textContent = String(count)
}
render()

const handleClick = (event: MouseEvent): void => {
    const button = event.target
    if (!(button instanceof HTMLButtonElement)) return

    const step = Number(button.dataset.step)
    if (count + step < 0) return
    count += step

    render()
}

const buttons = document.querySelectorAll('button')
if (buttons.length === 0) throw new Error(`No buttons found`)
buttons.forEach(button => button.addEventListener('click', handleClick))