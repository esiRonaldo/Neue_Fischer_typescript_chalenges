export const groupBy = <T, K extends keyof T>(items: T[], key: K): Record<string, T[]> => {
    const result: Record<string, T[]> = {}

    for (const item of items) {
        const group = String(item[key])
        if (!result[group]) result[group] = []
        result[group].push(item)
    }

    return result
}

export const pluck = <T, K extends keyof T>(items: T[], key: K): T[K][] =>
    items.map(item => item[key])

export const merge = <T>(base: T, updates: Partial<T>): T => ({ ...base, ...updates })
