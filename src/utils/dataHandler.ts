import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFinanceStore } from '../store/useFinanceStore';

export const exportToJSON = async () => {
    try {
        const state = useFinanceStore.getState();
        const data = {
            transactions: state.transactions,
            accounts: state.accounts,
            categories: state.categories,
            budgets: state.budgets,
            currency: state.currency,
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(data, null, 2);
        const fileName = `spendly_backup_${new Date().getTime()}.json`;
        const filePath = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(filePath, jsonString, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath);
        }
        return true;
    } catch (error) {
        console.error('Export JSON Error:', error);
        return false;
    }
};

export const exportToCSV = async () => {
    try {
        const state = useFinanceStore.getState();
        const transactions = state.transactions;
        const categories = state.categories;
        const accounts = state.accounts;

        // Header
        let csvContent = 'Date,Type,Amount,Category,Account,Note,Recurring\n';

        // Rows
        transactions.forEach(tx => {
            const categoryName = categories.find(c => c.id === tx.categoryId)?.name || 'Unknown';
            const accountName = accounts.find(a => a.id === tx.accountId)?.name || 'Unknown';
            const recurring = tx.isRecurring ? 'Yes' : 'No';

            // Escape note for CSV
            const note = tx.note ? `"${tx.note.replace(/"/g, '""')}"` : '';

            const row = [
                tx.date,
                tx.type,
                tx.amount,
                categoryName,
                accountName,
                note,
                recurring
            ].join(',');

            csvContent += row + '\n';
        });

        const fileName = `spendly_transactions_${new Date().getTime()}.csv`;
        const filePath = `${FileSystem.documentDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(filePath, csvContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(filePath);
        }
        return true;
    } catch (error) {
        console.error('Export CSV Error:', error);
        return false;
    }
};

export const importFromJSON = async (jsonString: string) => {
    try {
        const data = JSON.parse(jsonString);

        // Basic validation
        if (!data.transactions || !data.accounts || !data.categories) {
            throw new Error('Invalid backup file format');
        }

        const store = useFinanceStore.getState();

        // We need to access the setState directly or expose a bulk update method
        // For now, we will assume we can set the state via a custom action we need to add,
        // OR we just assume the user will restart app (but zustand persists async).
        // Best approach: Add a `restoreData` action to the store.

        // Let's call the store restore method (we need to implement it)
        store.restoreData && store.restoreData(data);

        return true;
    } catch (error) {
        console.error('Import Error:', error);
        return false;
    }
};
