import * as React from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie } from 'victory-native';
import { Button } from '../../src/components/Button'; // Assuming Button component is available
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AnalyticsScreen() {
    const { transactions, categories, currency, getExpenses, getEarnings, budgets, setBudget, getCategorySpent } = useFinanceStore();
    const [selectedBudgetCategorId, setSelectedBudgetCategorId] = React.useState<string | null>(null);
    const [budgetAmount, setBudgetAmount] = React.useState('');

    // Calculate category-wise breakdown for expenses
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Typography variant="h1">Analytics</Typography>
                </View>

                <View style={styles.summaryRow}>
                    <Card style={styles.summaryCard}>
                        <Typography variant="caption">Earnings</Typography>
                        <Typography variant="h3" color={theme.colors.secondary}>{currency}{totalEarning.toLocaleString()}</Typography>
                    </Card>
                    <Card style={styles.summaryCard}>
                        <Typography variant="caption">Expenses</Typography>
                        <Typography variant="h3" color={theme.colors.error}>{currency}{totalExpense.toLocaleString()}</Typography>
                    </Card>
                </View>

                <Card style={styles.savingsCard}>
                    <Typography variant="caption">Net Savings</Typography>
                    <Typography variant="h2" color={savings >= 0 ? theme.colors.primary : theme.colors.error}>
                        {currency}{savings.toLocaleString()}
                    </Typography>
                </Card>

                <View style={styles.chartSection}>
                    <Typography variant="h2" style={styles.sectionTitle}>Budgeting</Typography>
                    <Card style={styles.budgetCard}>
                        {categories.filter(c => c.type === 'expense').map(cat => {
                            const budget = budgets.find(b => b.categoryId === cat.id);
                            const spent = getCategorySpent(cat.id);
                            const limit = budget?.amount || 0;
                            const progress = limit > 0 ? Math.min(spent / limit, 1) : 0;
                            const isOver = limit > 0 && spent > limit;

                            return (
                                <View key={cat.id} style={styles.budgetItem}>
                                    <View style={styles.budgetInfo}>
                                        <Typography variant="body">{cat.name}</Typography>
                                        <TouchableOpacity onPress={() => {
                                            setSelectedBudgetCategorId(cat.id);
                                            setBudgetAmount(limit > 0 ? limit.toString() : '');
                                        }}>
                                            <Typography variant="caption" color={theme.colors.primary}>
                                                {limit > 0 ? `${currency}${limit.toLocaleString()}` : 'Set Limit'}
                                            </Typography>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.progressContainer}>
                                        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: isOver ? theme.colors.error : cat.color }]} />
                                    </View>
                                    <Typography variant="caption" style={styles.spentText}>
                                        {currency}{spent.toLocaleString()} spent {limit > 0 ? `of ${currency}${limit.toLocaleString()}` : ''}
                                    </Typography>
                                </View>
                            );
                        })}
                    </Card>
                </View>

                <View style={styles.chartSection}>
                    <Typography variant="h2" style={styles.sectionTitle}>Spending Breakdown</Typography>
                    {catBreakdown.length > 0 ? (
                        <View style={styles.chartContainer}>
                            <VictoryPie
                                data={catBreakdown}
                                width={SCREEN_WIDTH - 40}
                                height={300}
                                colorScale={catBreakdown.map(d => d.color)}
                                innerRadius={70}
                                labelRadius={({ innerRadius }) => (typeof innerRadius === 'number' ? innerRadius + 20 : 80)}
                                style={{
                                    labels: { fill: "#FFF", fontSize: 12, fontWeight: "bold" }
                                }}
                            />
                            <View style={styles.legendContainer}>
                                {catBreakdown.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                                        <Typography variant="caption" style={{ flex: 1 }}>{item.x}</Typography>
                                        <Typography variant="caption">{currency}{item.y.toLocaleString()}</Typography>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Typography variant="body">No expense data to analyze yet.</Typography>
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal
                visible={!!selectedBudgetCategorId}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedBudgetCategorId(null)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContent}>
                        <Typography variant="h2">Set Monthly Budget</Typography>
                        <Typography variant="caption" style={{ marginBottom: 16 }}>
                            for {categories.find(c => c.id === selectedBudgetCategorId)?.name}
                        </Typography>

                        <TextInput
                            style={styles.budgetInput}
                            placeholder="Amount"
                            placeholderTextColor="rgba(255, 255, 255, 0.3)"
                            keyboardType="numeric"
                            value={budgetAmount}
                            onChangeText={setBudgetAmount}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="glass"
                                onPress={() => setSelectedBudgetCategorId(null)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Save"
                                onPress={() => {
                                    if (selectedBudgetCategorId) {
                                        setBudget(selectedBudgetCategorId, parseFloat(budgetAmount) || 0);
                                        setSelectedBudgetCategorId(null);
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
        paddingBottom: 100,
    },
    header: {
        padding: theme.spacing.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    summaryCard: {
        flex: 1,
        padding: theme.spacing.md,
    },
    savingsCard: {
        marginHorizontal: theme.spacing.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    chartSection: {
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        marginBottom: theme.spacing.md,
    },
    budgetCard: {
        padding: theme.spacing.md,
    },
    budgetItem: {
        marginBottom: 20,
    },
    budgetInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressContainer: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    spentText: {
        marginTop: 4,
        textAlign: 'right',
        opacity: 0.6,
    },
    budgetInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#FFF',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: theme.spacing.md,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness,
        padding: 24,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    legendContainer: {
        width: '100%',
        marginTop: theme.spacing.md,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    colorBox: {
        width: 12,
        height: 12,
        borderRadius: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
});
