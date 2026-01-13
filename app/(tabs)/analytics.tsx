import React from 'react';
import { Dimensions, Modal, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AnalyticsScreen() {
    const { transactions, categories, currency, getExpenses, getEarnings, budgets, setBudget, getCategorySpent } = useFinanceStore();
    const [selectedBudgetCategoryId, setSelectedBudgetCategoryId] = React.useState<string | null>(null);
    const [budgetAmount, setBudgetAmount] = React.useState('');

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpense = getExpenses();
    const totalEarning = getEarnings();
    const savings = totalEarning - totalExpense;

    const catBreakdown = categories
        .filter(c => c.type === 'expense')
        .map(cat => {
            const total = expenseTransactions
                .filter(t => t.categoryId === cat.id)
                .reduce((acc, t) => acc + t.amount, 0);
            const percentage = totalExpense > 0 ? (total / totalExpense) * 100 : 0;
            return { id: cat.id, name: cat.name, total, color: cat.color, percentage };
        })
        .filter(d => d.total > 0)
        .sort((a, b) => b.total - a.total);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Typography variant="h2" style={styles.pageTitle}>Analytics</Typography>

                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <Card style={styles.summaryCard}>
                        <Typography variant="label">Income</Typography>
                        <Typography variant="h3" color={theme.colors.secondary}>
                            +{currency}{totalEarning.toLocaleString()}
                        </Typography>
                    </Card>
                    <Card style={styles.summaryCard}>
                        <Typography variant="label">Expenses</Typography>
                        <Typography variant="h3" color={theme.colors.error}>
                            -{currency}{totalExpense.toLocaleString()}
                        </Typography>
                    </Card>
                </View>

                <Card style={[styles.savingsCard, { backgroundColor: savings >= 0 ? theme.colors.secondary : theme.colors.error }]}>
                    <Typography variant="label" color="rgba(255,255,255,0.8)">Net Savings</Typography>
                    <Typography variant="h1" color="#FFF">
                        {savings >= 0 ? '+' : '-'}{currency}{Math.abs(savings).toLocaleString()}
                    </Typography>
                </Card>

                {/* Spending Breakdown */}
                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Spending Breakdown</Typography>
                    {catBreakdown.length > 0 ? (
                        <Card>
                            {catBreakdown.map((item, index) => {
                                const isLast = index === catBreakdown.length - 1;
                                return (
                                    <View key={item.id} style={[styles.breakdownItem, !isLast && styles.breakdownBorder]}>
                                        <View style={styles.breakdownHeader}>
                                            <View style={styles.breakdownLeft}>
                                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                                <Typography variant="body" style={{ fontWeight: '500' }}>{item.name}</Typography>
                                            </View>
                                            <View style={styles.breakdownRight}>
                                                <Typography variant="h3">{currency}{item.total.toLocaleString()}</Typography>
                                                <Typography variant="caption">{item.percentage.toFixed(1)}%</Typography>
                                            </View>
                                        </View>
                                        <View style={styles.progressBarContainer}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    { width: `${item.percentage}%`, backgroundColor: item.color }
                                                ]}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </Card>
                    ) : (
                        <Card variant="flat" style={styles.emptyState}>
                            <Typography variant="body" align="center">No expense data yet</Typography>
                            <Typography variant="caption" align="center" style={{ marginTop: 4 }}>
                                Add some transactions to see your spending breakdown
                            </Typography>
                        </Card>
                    )}
                </View>

                {/* Budgets */}
                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Monthly Budgets</Typography>
                    <Card>
                        {categories.filter(c => c.type === 'expense').map((cat, index, arr) => {
                            const budget = budgets.find(b => b.categoryId === cat.id);
                            const spent = getCategorySpent(cat.id);
                            const limit = budget?.amount || 0;
                            const progress = limit > 0 ? Math.min(spent / limit, 1) : 0;
                            const isOver = limit > 0 && spent > limit;
                            const isLast = index === arr.length - 1;

                            return (
                                <View key={cat.id} style={[styles.budgetItem, !isLast && styles.budgetBorder]}>
                                    <View style={styles.budgetHeader}>
                                        <Typography variant="body" style={{ fontWeight: '500' }}>{cat.name}</Typography>
                                        <TouchableOpacity onPress={() => {
                                            setSelectedBudgetCategoryId(cat.id);
                                            setBudgetAmount(limit > 0 ? limit.toString() : '');
                                        }}>
                                            <Typography variant="caption" color={theme.colors.primary}>
                                                {limit > 0 ? `${currency}${limit.toLocaleString()}` : 'Set Budget'}
                                            </Typography>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[
                                            styles.progressBarFill,
                                            { width: `${progress * 100}%`, backgroundColor: isOver ? theme.colors.error : cat.color }
                                        ]} />
                                    </View>
                                    <Typography variant="caption">
                                        {currency}{spent.toLocaleString()} spent {limit > 0 ? `of ${currency}${limit.toLocaleString()}` : ''}
                                    </Typography>
                                </View>
                            );
                        })}
                    </Card>
                </View>
            </ScrollView>

            {/* Budget Modal */}
            <Modal
                visible={!!selectedBudgetCategoryId}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedBudgetCategoryId(null)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContent}>
                        <Typography variant="h3" align="center">Set Monthly Budget</Typography>
                        <Typography variant="caption" align="center" style={{ marginTop: 4, marginBottom: 20 }}>
                            for {categories.find(c => c.id === selectedBudgetCategoryId)?.name}
                        </Typography>

                        <TextInput
                            style={styles.budgetInput}
                            placeholder="Enter amount"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            value={budgetAmount}
                            onChangeText={setBudgetAmount}
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="ghost"
                                onPress={() => setSelectedBudgetCategoryId(null)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Save"
                                onPress={() => {
                                    if (selectedBudgetCategoryId) {
                                        setBudget(selectedBudgetCategoryId, parseFloat(budgetAmount) || 0);
                                        setSelectedBudgetCategoryId(null);
                                    }
                                }}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </Card>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },
    pageTitle: {
        marginBottom: theme.spacing.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    summaryCard: {
        flex: 1,
        padding: theme.spacing.md,
    },
    savingsCard: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        marginBottom: theme.spacing.md,
    },

    // Breakdown
    breakdownItem: {
        padding: theme.spacing.md,
    },
    breakdownBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    breakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    breakdownRight: {
        alignItems: 'flex-end',
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },

    // Budget
    budgetItem: {
        padding: theme.spacing.md,
    },
    budgetBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    // Empty state
    emptyState: {
        padding: theme.spacing.xl,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    modalContent: {
        width: '100%',
        padding: theme.spacing.xl,
    },
    budgetInput: {
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: theme.spacing.md,
        fontSize: 24,
        textAlign: 'center',
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
});
