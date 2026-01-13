import { Search } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

export default function HistoryScreen() {
    const { transactions, categories, currency } = useFinanceStore();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredTransactions = transactions.filter(tx =>
        tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categories.find(c => c.id === tx.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h1">History</Typography>
                <View style={styles.searchBar}>
                    <Search size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by note or category..."
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredTransactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Typography variant="body">No transactions found.</Typography>
                    </View>
                ) : (
                    filteredTransactions.map((tx) => {
                        const category = categories.find(c => c.id === tx.categoryId);
                        return (
                            <Card key={tx.id} style={styles.transactionCard}>
                                <View style={styles.txLeft}>
                                    <Typography variant="h3">{category?.name || 'Other'}</Typography>
                                    <Typography variant="caption">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}</Typography>
                                </View>
                                <Typography
                                    variant="h3"
                                    color={tx.type === 'earning' ? theme.colors.secondary : theme.colors.error}
                                >
                                    {tx.type === 'earning' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                                </Typography>
                            </Card>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginTop: theme.spacing.md,
    },
    searchInput: {
        flex: 1,
        height: 44,
        color: '#FFF',
        marginLeft: 8,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100, // Extra space for tabs
    },
    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    txLeft: {
        gap: 2,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
});
