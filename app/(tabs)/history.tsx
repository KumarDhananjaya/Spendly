import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

export default function HistoryScreen() {
    const router = useRouter();
    const { transactions, categories, currency, accounts } = useFinanceStore();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedType, setSelectedType] = React.useState<'all' | 'expense' | 'earning' | 'transfer'>('all');
    const [dateFilter, setDateFilter] = React.useState<'all' | 'today' | 'week' | 'month'>('all');

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
            categories.find(c => c.id === tx.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            accounts.find(a => a.id === tx.accountId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            accounts.find(a => a.id === tx.toAccountId)?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedType === 'all' || tx.type === selectedType;

        const txDate = new Date(tx.date);
        const now = new Date();
        let matchesDate = true;

        if (dateFilter === 'today') {
            matchesDate = txDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            matchesDate = txDate >= weekAgo;
        } else if (dateFilter === 'month') {
            matchesDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        }

        return matchesSearch && matchesType && matchesDate;
    });

    const typeFilters = ['all', 'expense', 'earning', 'transfer'] as const;
    const dateFilters = ['all', 'today', 'week', 'month'] as const;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <Typography variant="h2">Transaction History</Typography>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Search size={18} color={theme.colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search transactions..."
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filtersRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {typeFilters.map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.filterChip, selectedType === t && styles.filterChipActive]}
                                onPress={() => setSelectedType(t)}
                            >
                                <Typography
                                    variant="caption"
                                    color={selectedType === t ? '#FFF' : theme.colors.textSecondary}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                        <View style={styles.filterDivider} />
                        {dateFilters.map(d => (
                            <TouchableOpacity
                                key={d}
                                style={[styles.filterChip, dateFilter === d && styles.filterChipActive]}
                                onPress={() => setDateFilter(d)}
                            >
                                <Typography
                                    variant="caption"
                                    color={dateFilter === d ? '#FFF' : theme.colors.textSecondary}
                                >
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredTransactions.length === 0 ? (
                    <Card variant="flat" style={styles.emptyState}>
                        <Typography variant="body" align="center">No transactions found</Typography>
                    </Card>
                ) : (
                    <Card>
                        {filteredTransactions.map((tx, index) => {
                            const category = categories.find(c => c.id === tx.categoryId);
                            const isLast = index === filteredTransactions.length - 1;

                            return (
                                <TouchableOpacity
                                    key={tx.id}
                                    style={[styles.transactionItem, !isLast && styles.transactionBorder]}
                                    onPress={() => router.push({
                                        pathname: '/edit-transaction',
                                        params: { id: tx.id }
                                    })}
                                    activeOpacity={0.6}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: tx.type === 'transfer' ? theme.colors.primary + '20' : (category?.color || theme.colors.primary) + '20' }]}>
                                        {tx.type === 'transfer' ? (
                                            <Typography variant="body" style={{ fontWeight: '700', color: theme.colors.primary }}>T</Typography>
                                        ) : (
                                            <Typography variant="h3">{category?.name?.charAt(0) || '?'}</Typography>
                                        )}
                                    </View>
                                    <View style={styles.transactionInfo}>
                                        <Typography variant="body" style={{ fontWeight: '500', color: theme.colors.text }}>
                                            {tx.type === 'transfer' ? (
                                                `Transfer: ${accounts.find(a => a.id === tx.accountId)?.name || 'Source'} → ${accounts.find(a => a.id === tx.toAccountId)?.name || 'Dest'}`
                                            ) : (
                                                category?.name || 'Other'
                                            )}
                                        </Typography>
                                        <Typography variant="caption">
                                            {new Date(tx.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Typography>
                                        {tx.note && (
                                            <Typography variant="caption" numberOfLines={1} style={{ marginTop: 2 }}>
                                                {tx.note}
                                            </Typography>
                                        )}
                                    </View>
                                    <Typography
                                        variant="h3"
                                        color={tx.type === 'earning' ? theme.colors.secondary : tx.type === 'transfer' ? theme.colors.primary : theme.colors.error}
                                    >
                                        {tx.type === 'earning' ? '+' : tx.type === 'transfer' ? '' : '-'}{currency}{tx.amount.toLocaleString()}
                                    </Typography>
                                </TouchableOpacity>
                            );
                        })}
                    </Card>
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
        paddingBottom: theme.spacing.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginTop: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchInput: {
        flex: 1,
        height: 48,
        marginLeft: 12,
        fontSize: 16,
        color: theme.colors.text,
    },
    filtersRow: {
        marginTop: theme.spacing.md,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterDivider: {
        width: 1,
        height: 24,
        backgroundColor: theme.colors.border,
        marginHorizontal: 8,
        alignSelf: 'center',
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingTop: 0,
        paddingBottom: 100,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: 12,
    },
    transactionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionInfo: {
        flex: 1,
    },
    emptyState: {
        padding: theme.spacing.xl,
    },
});
