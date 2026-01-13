import { Search } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

export default function HistoryScreen() {
    const { transactions, categories, currency } = useFinanceStore();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedType, setSelectedType] = React.useState<'all' | 'expense' | 'earning'>('all');
    const [dateFilter, setDateFilter] = React.useState<'all' | 'today' | 'week' | 'month'>('all');

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
            categories.find(c => c.id === tx.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'all' || tx.type === selectedType;

        const txDate = new Date(tx.date);
        const now = new Date();
        let matchesDate = true;

        if (dateFilter === 'today') {
            matchesDate = txDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7); // Corrected weekAgo calculation
            matchesDate = txDate >= weekAgo;
        } else if (dateFilter === 'month') {
            matchesDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        }

        return matchesSearch && matchesType && matchesDate;
    });

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
                <View style={styles.filters}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                        {(['all', 'expense', 'earning'] as const).map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.filterPill, selectedType === t && styles.activeFilter]}
                                onPress={() => setSelectedType(t)}
                            >
                                <Typography variant="caption" color={selectedType === t ? '#FFF' : theme.colors.textSecondary}>
                                    {t.toUpperCase()}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.filterDivider} />
                        {(['all', 'today', 'week', 'month'] as const).map(d => (
                            <TouchableOpacity
                                key={d}
                                style={[styles.filterPill, dateFilter === d && styles.activeFilter]}
                                onPress={() => setDateFilter(d)}
                            >
                                <Typography variant="caption" color={dateFilter === d ? '#FFF' : theme.colors.textSecondary}>
                                    {d.toUpperCase()}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
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
        marginBottom: theme.spacing.md,
    },
    filters: {
        marginTop: theme.spacing.xs,
    },
    filterScroll: {
        flexDirection: 'row',
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginRight: 8,
    },
    activeFilter: {
        backgroundColor: theme.colors.primary,
    },
    filterDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: 8,
        alignSelf: 'center',
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
