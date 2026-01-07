export interface Expense {
    id?: string;
    clientId: string;
    userId: string;
    amount: number;
    categoryId: string;
    note?: string;
    source: "MANUAL" | "UPI" | "SMS";
    spentAt: number; // Timestamp
    updatedAt: number; // Timestamp
}
