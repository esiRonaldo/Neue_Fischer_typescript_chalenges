interface LogEntry {
    timestamp: string;
    level: "info" | "warn" | "error";
    message: string;
}

function getMockDB() {
    return {
        async query(_sql: string): Promise<LogEntry[]> {
            return [
                {
                    timestamp: "2026-03-02T09:00:00Z",
                    level: "info",
                    message: "Server started",
                },
                {
                    timestamp: "2026-03-02T09:05:12Z",
                    level: "warn",
                    message: "Slow response",
                },
                {
                    timestamp: "2026-03-02T09:07:40Z",
                    level: "error",
                    message: "Database timeout",
                },
            ];
        },
    };
}

// Repository
interface LogRepository {
    findAll(): Promise<LogEntry[]>;
}

class DatabaseLogRepository implements LogRepository {
    async findAll(): Promise<LogEntry[]> {
        const db = getMockDB();
        return db.query("SELECT * FROM system_logs");
    }
}

class InMemoryLogRepository implements LogRepository {
    #entries: LogEntry[];

    constructor(entries: LogEntry[]) {
        this.#entries = entries;
    }

    async findAll(): Promise<LogEntry[]> {
        return this.#entries;
    }
}

class LogExporter {
    async exportLogs(format: "json" | "csv" | "xml") {
        const db = getMockDB();
        console.log('db')
        console.log(db)
        const logs = await db.query("SELECT * FROM system_logs");
        console.log('logs')
        console.log(logs)

        
        if (format === "json") {
            console.log(logs)

            return JSON.stringify(logs);
        } else if (format === "csv") {
            return logs
                .map((l) => `${l.timestamp},${l.level},${l.message}`)
                .join("\n");
        } else if (format === "xml") {
            return `<logs>${logs.map((l) => `<log>${l.message}</log>`).join("")}</logs>`;
        } else {
            throw new Error("Unknown format");
        }
    }
}

const exporter = new LogExporter();

console.log('*********************');
console.log(await exporter.exportLogs("json"));
console.log('----------------');
console.log(await exporter.exportLogs("csv"));
console.log('++++++++++++++++++++');
console.log(await exporter.exportLogs("xml"));
console.log('===================');
