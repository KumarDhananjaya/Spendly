import { TransactionType } from '../store/useFinanceStore';

interface ParsedTransaction {
    amount: number;
    type: TransactionType;
    category: string;
}

export const parseMessage = (text: string): ParsedTransaction | null => {
    const cleanText = text.replace(/,/g, ''); // Remove commas from numbers

    // Pattern 1: Debit/Spent Format (Common for Indian Banks)
    // Example: "HDFC Bank: Rs 500.00 debited from a/c x1234 for Amazon on 20-Oct-23. Bal: Rs 1000"
    // Example: "SBI: Your a/c x1234 has been debited by Rs 100.00 on 20/10/23 ref 12345. Bal: Rs 500"
    const debitRegex = /(?:rs|inr)\.?\s*(\d+(?:\.\d{1,2})?)\s*(?:debited|spent|paid|withdrawn|used)\s*(?:from|at)?\s*(?:a\/c|acc|account)?\s*(?:[xX\d]+)?\s*(?:for|at)?\s*([\w\s]+)?/i;

    // Pattern 2: Credit/Received Format
    // Example: "A/c x1234 credited with Rs 1000.00 on 20-Oct-23 by Salary. Bal: Rs 2000"
    const creditRegex = /(?:rs|inr)\.?\s*(\d+(?:\.\d{1,2})?)\s*(?:credited|received|added|deposited)\s*(?:in|to)?\s*(?:a\/c|acc|account)?/i;

    // Pattern 3: UPI Transaction
    // Example: "Money Transferred: Rs 200.00 via UPI from SBI a/c x1234 to Zomato on 20-Oct-23."
    const upiRegex = /UPI\s+(?:transfer|payment)?\s*(?:of)?\s*(?:rs|inr)\.?\s*(\d+(?:\.\d{1,2})?)\s*(?:from|to)?\s*([\w\s]+)?/i;

    let match = cleanText.match(debitRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'expense',
            category: match[2]?.trim() || 'Shopping',
        };
    }

    match = cleanText.match(upiRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'expense',
            category: match[2]?.trim() || 'Others',
        };
    }

    match = cleanText.match(creditRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'earning',
            category: 'Income',
        };
    }

    // Fallback to simpler patterns
    const expenseRegex = /(?:spent|paid|buy|bought)\s+(\d+(?:\.\d{1,2})?)\s+(?:at|on|for)\s+(\w+)/i;
    const earningRegex = /(?:received|salary|got|earned)\s+(\d+(?:\.\d{1,2})?)\s+(?:from|for)\s+(\w+)/i;

    match = cleanText.match(expenseRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'expense',
            category: match[2].charAt(0).toUpperCase() + match[2].slice(1),
        };
    }

    match = cleanText.match(earningRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'earning',
            category: match[2].charAt(0).toUpperCase() + match[2].slice(1),
        };
    }

    return null;
};
