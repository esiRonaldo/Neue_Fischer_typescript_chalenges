type BoxColor = "white" | "lightblue" | "lightgreen"
const box = document.getElementById('color-box')
const select = document.getElementById('color-select')

if (!(select instanceof HTMLSelectElement))
    throw new Error(`Element #color-select not found`)

if (!(box instanceof HTMLDivElement))
    throw new Error(`Element #color-box not found`)

const paintBox = (color: BoxColor): void => {
    box.style.backgroundColor = color
}
//TODO: value not Unknown?
const isBoxColor = (value: string): value is BoxColor => {
    return (
        value === "white" ||
        value === "lightblue" ||
        value === "lightgreen"
    )
}

const handleChange = (): void => {
    const value = select.value
    if (isBoxColor(value)) paintBox(value)
}
select.addEventListener("change", handleChange)
