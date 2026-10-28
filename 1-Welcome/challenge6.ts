const SIZE = 50
const DEAD = '.'
const ALIVE = '*'
const DELAY_MS = 10000
type Grid = boolean[][]
type StartMode = 'random' | 'glider'

// change to 'random' for a random start
const START = 'glider' as StartMode

const GLIDER: [number, number][] = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]]

const createEmptyGrid = (): Grid =>
    Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => false)
    )

const createRandomGrid = (): Grid =>
    Array.from({ length: SIZE }, () =>
        Array.from({ length: SIZE }, () => Math.random() < 0.3)
    )

const createGliderGrid = (): Grid => {
    const grid = createEmptyGrid()
    for (const [row, col] of GLIDER) {
        grid[row][col] = true
    }
    return grid
}

const renderGrid = (grid: Grid): string => {
    return grid.map(row => row.map(cell => cell ? ALIVE : DEAD).join('')).join('\n')
}

const countNeighbors = (grid: Grid, row: number, col: number): number => {
    let count = 0
    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
            if (dRow === 0 && dCol === 0) continue
            if (grid[row + dRow]?.[col + dCol]) count++
        }
    }
    return count
}

const nextGeneration = (grid: Grid): Grid =>
    grid.map((row, rowIndex) =>
        row.map((alive, colIndex) => {
            const neighbors = countNeighbors(grid, rowIndex, colIndex)
            if (alive) return neighbors === 2 || neighbors === 3
            return neighbors === 3
        })
    )

let grid = START === 'random' ? createRandomGrid() : createGliderGrid()
let generation = 0

setInterval(() => {
    console.clear()
    console.log(renderGrid(grid))
    console.log(`Generation: ${generation}`)
    grid = nextGeneration(grid)
    generation++
}, DELAY_MS)
