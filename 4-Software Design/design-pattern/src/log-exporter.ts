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

// Strategy
interface LogFormatter {
    format(logs: LogEntry[]): string
}

class JsonFormatter implements LogFormatter {
    format(logs: LogEntry[]): string {
        return JSON.stringify(logs)
    }
}

class CsvFormatter implements LogFormatter {
    format(logs: LogEntry[]): string {
        return logs
            .map((l) => `${l.timestamp},${l.level},${l.message}`)
            .join("\n")
    }
}

class XmlFormatter implements LogFormatter {
    format(logs: LogEntry[]): string {
        return `<logs>${logs.map((l) => `<log>${l.message}</log>`).join("")}</logs>`;
    }
}

//Factory
function createFormatter(format: string): LogFormatter {
    switch (format) {
        case 'json':
            return new JsonFormatter()
        case 'csv':
            return new CsvFormatter()
        case 'xml':
            return new XmlFormatter()
        default:
            throw new Error(`Unknown format: ${format}`)
    }
}

//Dependency Injection
class LogExporter {
    #repository: LogRepository

    constructor(repository: LogRepository) {
        this.#repository = repository
    }

    async exportLogs(format: string): Promise<string> {
        const logs = await this.#repository.findAll()
        const formatter = createFormatter(format)
        return formatter.format(logs)
        // we add the instance instead of writing db here
        // const db = getMockDB(); 
        // console.log('db')
        // console.log(db)
        // const logs = await db.query("SELECT * FROM system_logs");
        // console.log('logs')
        // console.log(logs)
    }
}

const entries: LogEntry[] = [
    { timestamp: "2026-03-02T09:00:00Z", level: "info", message: "Server started" },
    { timestamp: "2026-03-02T09:05:12Z", level: "warn", message: "Slow response" },
    { timestamp: "2026-03-02T09:07:40Z", level: "error", message: "Database timeout" },
];

const exporter = new LogExporter(new InMemoryLogRepository(entries));

console.log(await exporter.exportLogs("json"));
console.log(await exporter.exportLogs("csv"));
console.log(await exporter.exportLogs("xml"));
