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

function printOverdueReport(loans: Loan[], today: string): void {
    console.log("Overdue report");
    let total = 0;
    for (const loan of loans) {
        if (loan.returnedDate === null) {
            const days = Math.floor(
                (Date.parse(today) - Date.parse(loan.dueDate)) / 86_400_000,
            );
            if (days > 0) {
                let fee = days * 50;
                if (fee > 1000) {
                    fee = 1000;
                }
                total += fee;
                console.log(
                    `${loan.title} (member #${loan.memberId}): ${days} days, ${(fee / 100).toFixed(2)} EUR`,
                );
            }
        }
    }
    console.log(`Total: ${(total / 100).toFixed(2)} EUR`);
}

function getMemberFee(loans: Loan[], memberId: string, today: string): number {
    let total = 0;
    for (const loan of loans) {
        if (loan.memberId === memberId && loan.returnedDate === null) {
            const days = Math.floor(
                (Date.parse(today) - Date.parse(loan.dueDate)) / 86_400_000,
            );
            if (days > 0) {
                total += Math.min(days * 50, 1000);
            }
        }
    }
    return total;
}

printOverdueReport(loans, "2024-11-20");
console.log(getMemberFee(loans, "42", "2024-11-20"));
