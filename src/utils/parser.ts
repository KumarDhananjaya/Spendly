import { TransactionType } from '../store/useFinanceStore';

interface ParsedTransaction {
    amount: number;
    type: TransactionType;
    category: string;
}

export const parseMessage = (text: string): ParsedTransaction | null => {
    // Regex to match "Spent 100 on Food" or "Received 500 for Salary"
    // Format 1: Spent [amount] on [category]
    // Format 2: Received [amount] for [category]

    const amountRegex = /(\d+(?:\.\d{1,2})?)/;
    const expenseRegex = /(?:spent|paid|buy|bought)\s+(\d+(?:\.\d{1,2})?)\s+(?:at|on|for)\s+(\w+)/i;
    const earningRegex = /(?:received|salary|got|earned)\s+(\d+(?:\.\d{1,2})?)\s+(?:from|for)\s+(\w+)/i;

    let match = text.match(expenseRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'expense',
            category: match[2].charAt(0).toUpperCase() + match[2].slice(1),
        };
    }

    match = text.match(earningRegex);
    if (match) {
        return {
            amount: parseFloat(match[1]),
            type: 'earning',
            category: match[2].charAt(0).toUpperCase() + match[2].slice(1),
        };
    }

    // Fallback: search for any number
    const simpleMatch = text.match(amountRegex);
    if (simpleMatch) {
        return {
            amount: parseFloat(simpleMatch[1]),
            type: 'expense',
            category: 'Others',
        };
    }

    return null;
};
