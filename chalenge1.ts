console.log("Hello, TypeScript!");
const AWAY_IN_MINUTE = 10
type UserStatus = "online" | "offline";
type AcitivityStatus = "online" | "offline" | "away";

interface User {
    username: string;
    status: UserStatus;
    lastActivity: number;
}

const dummyUser: User[] = [
    {
        username: 'David',
        status: 'online',
        lastActivity: 10
    },
    {
        username: 'Lucy',
        status: 'offline',
        lastActivity: 22
    },
    {
        username: 'Bob',
        status: 'online',
        lastActivity: 104
    }
]

const dummyUserNotOnline: User[] = [
    {
        username: 'Lucy',
        status: 'offline',
        lastActivity: 22
    },
    {
        username: 'Bob',
        status: 'online',
        lastActivity: 104
    }
]

interface ActivityResult {
    online?: string[];
    offline?: string[];
    away?: string[];
}

getActiveUsers(dummyUser)
getActiveUsers(dummyUserNotOnline)

function getActiveUsers(users: User[]): ActivityResult {
    const result: ActivityResult = {}

    for (const user of users) {
        let status: AcitivityStatus = user.status;

        if (user.status === 'online' && user.lastActivity > AWAY_IN_MINUTE) {
            status = 'away'
        }
        if (!result[status]) {
            result[status] = [];
        }
        result[status]!.push(user.username);
    }
    console.log(result)
    return result
}