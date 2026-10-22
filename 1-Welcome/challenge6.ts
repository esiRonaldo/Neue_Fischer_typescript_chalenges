const SIZE = 50
const DEAD = '.'
const ALIVE = '*'
type Grid = boolean[][]



const createEmptyGrid = (): Grid =>
    Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => false)
    )

const renderGrid = (grid: Grid): string => {
    return grid.map(row => row.map(cell => cell ? ALIVE : DEAD).join('')).join('\n')
}

const grid = createEmptyGrid()
console.log(renderGrid(grid))