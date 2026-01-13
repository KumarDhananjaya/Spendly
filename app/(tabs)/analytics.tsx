import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie } from 'victory-native';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AnalyticsScreen() {
    const { transactions, categories, currency, getExpenses, getEarnings, getBalance } = useFinanceStore();

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
    },
    sectionTitle: {
        marginBottom: theme.spacing.md,
    },
    chartContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        padding: theme.spacing.md,
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
