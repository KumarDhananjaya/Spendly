import React from 'react';
import { Dimensions, Modal, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie } from 'victory-native';
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
    const catBreakdown = categories
        .filter(c => c.type === 'expense')
        .map(cat => {
            const total = expenseTransactions
                .filter(t => t.categoryId === cat.id)
                .reduce((acc, t) => acc + t.amount, 0);
            return { x: cat.name, y: total, color: cat.color };
        })
        .filter(d => d.y > 0);

    const totalExpense = getExpenses();
    const totalEarning = getEarnings();
    const savings = totalEarning - totalExpense;

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
                        {currency}{Math.abs(savings).toLocaleString()}
                    </Typography>
                </Card>

                {/* Spending Chart */}
                <View style={styles.section}>
                    <Typography variant="h3" style={styles.sectionTitle}>Spending Breakdown</Typography>
                    {catBreakdown.length > 0 ? (
                        <Card style={styles.chartCard}>
                            <VictoryPie
                                data={catBreakdown}
                                width={SCREEN_WIDTH - 80}
                                height={220}
                                colorScale={catBreakdown.map(d => d.color)}
                                innerRadius={60}
                                padAngle={2}
                                style={{
                                    labels: { fill: theme.colors.text, fontSize: 11, fontWeight: '500' }
                                }}
                            />
                            <View style={styles.legendContainer}>
                                {catBreakdown.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Typography variant="caption" style={{ flex: 1 }}>{item.x}</Typography>
                                        <Typography variant="body" style={{ fontWeight: '600' }}>
                                            {currency}{item.y.toLocaleString()}
                                        </Typography>
                                    </View>
                                ))}
                            </View>
                        </Card>
                    ) : (
                        <Card variant="flat" style={styles.emptyState}>
                            <Typography variant="body" align="center">No expense data yet</Typography>
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
                                    <View style={styles.progressBar}>
                                        <View style={[
                                            styles.progressFill,
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
    chartCard: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    legendContainer: {
        width: '100%',
        marginTop: theme.spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 12,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    emptyState: {
        padding: theme.spacing.xl,
    },
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
    progressBar: {
        height: 6,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 3,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
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
