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

    async exportLogs(format: "json" | "csv" | "xml") {
        const logs = await this.#repository.findAll()
        // we add the instance instead of writing db here
        // const db = getMockDB(); 
        // console.log('db')
        // console.log(db)
        // const logs = await db.query("SELECT * FROM system_logs");
        // console.log('logs')
        // console.log(logs)


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

const exporter = new LogExporter(new DatabaseLogRepository());

console.log('*********************');
console.log(await exporter.exportLogs("json"));
console.log('----------------');
console.log(await exporter.exportLogs("csv"));
console.log('++++++++++++++++++++');
console.log(await exporter.exportLogs("xml"));
console.log('===================');
