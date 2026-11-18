// Problems before the refactoring:
// - SRP: printOverdueReport does four jobs at once: it finds the open loans,
//   calculates the days overdue, calculates the fee, and prints the report.
// - DRY: the days calculation (Math.floor((Date.parse(today) - Date.parse(loan.dueDate)) / 86_400_000))
//   and the fee rule (50 cents a day, at most 1000) are written twice, once in
//   printOverdueReport and once in getMemberFee. Changing the daily fee means editing both.
// - Separation of concerns: printOverdueReport mixes calculation with output.
//   The fee logic sits between console.log calls, so it cannot be reused or tested
//   without printing, and the euro formatting ((fee / 100).toFixed(2)) is inline.

type Loan = {
    memberId: string;
    title: string;
    dueDate: string;
    returnedDate: string | null;
};

const loans: Loan[] = [
    { memberId: "42", title: "Dune", dueDate: "2024-11-15", returnedDate: null },
    {
        memberId: "7",
        title: "Piranesi",
        dueDate: "2024-11-18",
        returnedDate: "2024-11-17",
    },
    {
        memberId: "42",
        title: "Kindred",
        dueDate: "2024-10-20",
        returnedDate: null,
    },
    {
        memberId: "7",
        title: "Neuromancer",
        dueDate: "2024-11-25",
        returnedDate: null,
    },
    {
        memberId: "13",
        title: "The Left Hand of Darkness",
        dueDate: "2024-11-17",
        returnedDate: null,
    },
];

const DAILY_FEE_CENTS = 50;
const MAX_FEE_CENTS = 1000;

function calculateFee(daysOverdue: number): number {
    return Math.min(daysOverdue * DAILY_FEE_CENTS, MAX_FEE_CENTS);
}

function getDaysOverdue(loan: Loan, today: string): number {
    return Math.floor((Date.parse(today) - Date.parse(loan.dueDate)) / 86_400_000);
}

function formatEuro(cents: number): string {
    return `${(cents / 100).toFixed(2)} EUR`;
}

function getOverdueLoans(loans: Loan[], today: string): Loan[] {
    return loans.filter(
        (loan) => loan.returnedDate === null && getDaysOverdue(loan, today) > 0,
    );
}

function printOverdueReport(loans: Loan[], today: string): void {
    console.log("Overdue report");
    let total = 0;
    for (const loan of getOverdueLoans(loans, today)) {
        const days = getDaysOverdue(loan, today);
        const fee = calculateFee(days);
        total += fee;
        console.log(`${loan.title} (member #${loan.memberId}): ${days} days, ${formatEuro(fee)}`);
    }
    console.log(`Total: ${formatEuro(total)}`);
}

function getMemberFee(loans: Loan[], memberId: string, today: string): number {
    return getOverdueLoans(loans, today)
        .filter((loan) => loan.memberId === memberId)
        .reduce((total, loan) => total + calculateFee(getDaysOverdue(loan, today)), 0);
}

printOverdueReport(loans, "2024-11-20");
console.log(getMemberFee(loans, "42", "2024-11-20"));
