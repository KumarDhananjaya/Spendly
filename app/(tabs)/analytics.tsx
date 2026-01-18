import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, TrendingUp, Wallet } from 'lucide-react-native';
import React from 'react';
import { Animated, Dimensions, Modal, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Animated progress bar component
const AnimatedProgressBar = ({ percentage, color }: { percentage: number; color: string }) => {
    const animatedWidth = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: percentage,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[
                    styles.progressBarFill,
                    {
                        width: animatedWidth.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: color,
                    },
                ]}
            />
        </View>
    );
};

export default function AnalyticsScreen() {
    const { transactions, categories, currency, getExpenses, getEarnings, budgets, setBudget, getCategorySpent } = useFinanceStore();
    const [selectedBudgetCategoryId, setSelectedBudgetCategoryId] = React.useState<string | null>(null);
    const [budgetAmount, setBudgetAmount] = React.useState('');

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpense = getExpenses();
    const totalEarning = getEarnings();
    const savings = totalEarning - totalExpense;
    const savingsRate = totalEarning > 0 ? (savings / totalEarning) * 100 : 0;

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
                        <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                            <TrendingUp size={20} color={theme.colors.secondary} />
                        </View>
                        <Typography variant="caption" style={styles.summaryLabel}>Income</Typography>
                        <Typography variant="h3" color={theme.colors.secondary}>
                            +{currency}{totalEarning.toLocaleString()}
                        </Typography>
                    </Card>
                    <Card style={styles.summaryCard}>
                        <View style={[styles.summaryIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                            <Wallet size={20} color={theme.colors.error} />
                        </View>
                        <Typography variant="caption" style={styles.summaryLabel}>Expenses</Typography>
                        <Typography variant="h3" color={theme.colors.error}>
                            -{currency}{totalExpense.toLocaleString()}
                        </Typography>
                    </Card>
                </View>

                {/* Spending Trends Chart */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <TrendingUp size={20} color={theme.colors.text} />
                        <Typography variant="h3" style={styles.sectionTitle}>Financial Trends</Typography>
                    </View>
                    <Card style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <View style={styles.chartLegend}>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
                                <Typography variant="caption">Income</Typography>
                                <View style={[styles.legendDot, { backgroundColor: theme.colors.error, marginLeft: 12 }]} />
                                <Typography variant="caption">Expense</Typography>
                            </View>
                            <Typography variant="caption" color={theme.colors.textSecondary}>Last 6 Months</Typography>
                        </View>
                        {/* Static stylized SVG Chart for premium look */}
                        <View style={styles.svgContainer}>
                            <View style={styles.yAxis}>
                                <Typography variant="caption" style={styles.axisText}>100%</Typography>
                                <Typography variant="caption" style={styles.axisText}>50%</Typography>
                                <Typography variant="caption" style={styles.axisText}>0%</Typography>
                            </View>
                            <View style={styles.chartMain}>
                                {/* Grid Lines */}
                                <View style={styles.gridLine} />
                                <View style={styles.gridLine} />
                                <View style={styles.gridLine} />

                                <View style={styles.barsRow}>
                                    {[0.8, 0.6, 0.9, 0.5, 0.7, 1.0].map((h, i) => (
                                        <View key={i} style={styles.barGroup}>
                                            <View style={[styles.bar, { height: `${h * 70}%`, backgroundColor: theme.colors.secondary + '40' }]} />
                                            <View style={[styles.bar, { height: `${(h * 0.6) * 70}%`, backgroundColor: theme.colors.error + '40' }]} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                        <View style={styles.xAxis}>
                            {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                <Typography key={m} variant="caption" style={styles.axisText}>{m}</Typography>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* Net Savings Card */}
                <LinearGradient
                    colors={savings >= 0 ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.savingsCard}
                >
                    <View style={styles.savingsHeader}>
                        <Typography variant="label" style={styles.savingsLabel}>Net Savings</Typography>
                        <View style={styles.savingsRateBadge}>
                            <Typography variant="caption" style={styles.savingsRateText}>
                                {savingsRate >= 0 ? '+' : ''}{savingsRate.toFixed(0)}%
                            </Typography>
                        </View>
                    </View>
                    <Typography variant="h1" style={styles.savingsAmount}>
                        {savings >= 0 ? '+' : '-'}{currency}{Math.abs(savings).toLocaleString()}
                    </Typography>
                </LinearGradient>

                {/* Spending Breakdown */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <PieChart size={20} color={theme.colors.text} />
                        <Typography variant="h3" style={styles.sectionTitle}>Spending Breakdown</Typography>
                    </View>
                    {catBreakdown.length > 0 ? (
                        <Card style={styles.breakdownCard}>
                            {catBreakdown.map((item, index) => {
                                const isLast = index === catBreakdown.length - 1;
                                return (
                                    <View key={item.id} style={[styles.breakdownItem, !isLast && styles.breakdownBorder]}>
                                        <View style={styles.breakdownHeader}>
                                            <View style={styles.breakdownLeft}>
                                                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                                <Typography variant="body" style={styles.breakdownName}>{item.name}</Typography>
                                            </View>
                                            <View style={styles.breakdownRight}>
                                                <Typography variant="h3">{currency}{item.total.toLocaleString()}</Typography>
                                                <View style={[styles.percentBadge, { backgroundColor: item.color + '20' }]}>
                                                    <Typography variant="caption" style={{ color: item.color, fontWeight: '600' }}>
                                                        {item.percentage.toFixed(1)}%
                                                    </Typography>
                                                </View>
                                            </View>
                                        </View>
                                        <AnimatedProgressBar percentage={item.percentage} color={item.color} />
                                    </View>
                                );
                            })}
                        </Card>
                    ) : (
                        <Card variant="flat" style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <PieChart size={40} color={theme.colors.textMuted} />
                            </View>
                            <Typography variant="h3" align="center" style={styles.emptyTitle}>
                                No expense data yet
                            </Typography>
                            <Typography variant="caption" align="center" style={styles.emptySubtitle}>
                                Add some transactions to see your spending breakdown
                            </Typography>
                        </Card>
                    )}
                </View>

                {/* Budgets */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Wallet size={20} color={theme.colors.text} />
                        <Typography variant="h3" style={styles.sectionTitle}>Monthly Budgets</Typography>
                    </View>
                    {categories.filter(c => c.type === 'expense').length > 0 ? (
                        <Card style={styles.budgetCard}>
                            {categories.filter(c => c.type === 'expense').map((cat, index, arr) => {
                                const budget = budgets.find(b => b.categoryId === cat.id);
                                const spent = getCategorySpent(cat.id);
                                const limit = budget?.amount || 0;
                                const progress = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                                const isOver = limit > 0 && spent > limit;
                                const isLast = index === arr.length - 1;

                                return (
                                    <View key={cat.id} style={[styles.budgetItem, !isLast && styles.budgetBorder]}>
                                        <View style={styles.budgetHeader}>
                                            <View style={styles.budgetLeft}>
                                                <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                                                <Typography variant="body" style={styles.budgetName}>{cat.name}</Typography>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.setBudgetButton}
                                                onPress={() => {
                                                    setSelectedBudgetCategoryId(cat.id);
                                                    setBudgetAmount(limit > 0 ? limit.toString() : '');
                                                }}
                                            >
                                                <Typography variant="caption" color={theme.colors.primary} style={{ fontWeight: '600' }}>
                                                    {limit > 0 ? `${currency}${limit.toLocaleString()}` : 'Set Budget'}
                                                </Typography>
                                            </TouchableOpacity>
                                        </View>
                                        <AnimatedProgressBar
                                            percentage={progress}
                                            color={isOver ? theme.colors.error : cat.color}
                                        />
                                        <View style={styles.budgetFooter}>
                                            <Typography variant="caption">
                                                {currency}{spent.toLocaleString()} spent
                                            </Typography>
                                            {limit > 0 && (
                                                <Typography variant="caption" color={isOver ? theme.colors.error : theme.colors.textMuted}>
                                                    {isOver ? 'Over budget!' : `${currency}${(limit - spent).toLocaleString()} left`}
                                                </Typography>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </Card>
                    ) : (
                        <Card variant="flat" style={styles.emptyState}>
                            <Typography variant="body" align="center" color={theme.colors.textMuted}>
                                Add expense categories to set budgets
                            </Typography>
                        </Card>
                    )}
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
                        <Typography variant="caption" align="center" style={styles.modalSubtitle}>
                            for {categories.find(c => c.id === selectedBudgetCategoryId)?.name}
                        </Typography>

                        <View style={styles.budgetInputContainer}>
                            <Typography variant="h2" color={theme.colors.textMuted}>{currency}</Typography>
                            <TextInput
                                style={styles.budgetInput}
                                placeholder="0"
                                placeholderTextColor={theme.colors.textMuted}
                                keyboardType="numeric"
                                value={budgetAmount}
                                onChangeText={setBudgetAmount}
                            />
                        </View>

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

    // Summary Cards
    summaryRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    summaryCard: {
        flex: 1,
        padding: theme.spacing.md,
        borderRadius: 20,
    },
    summaryIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
        marginBottom: 4,
    },

    // Chart
    chartCard: {
        padding: theme.spacing.lg,
        borderRadius: 24,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartLegend: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    svgContainer: {
        flexDirection: 'row',
        height: 150,
        gap: 12,
    },
    yAxis: {
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    gridLine: {
        height: 1,
        backgroundColor: theme.colors.border,
        width: '100%',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    chartMain: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
    },
    barsRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    barGroup: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
    },
    bar: {
        width: 10,
        borderRadius: 5,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 38,
        marginTop: 12,
    },
    axisText: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },

    // Savings Card
    savingsCard: {
        padding: theme.spacing.xl,
        borderRadius: 24,
        marginBottom: theme.spacing.xl,
        ...theme.shadows.lg,
    },
    savingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    savingsLabel: {
        color: 'rgba(255,255,255,0.8)',
    },
    savingsRateBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    savingsRateText: {
        color: '#FFF',
        fontWeight: '600',
    },
    savingsAmount: {
        color: '#FFF',
        fontSize: 40,
        fontWeight: '700',
    },

    // Section
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        flex: 1,
    },

    // Breakdown
    breakdownCard: {
        padding: 0,
        borderRadius: 20,
        overflow: 'hidden',
    },
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
        marginBottom: 10,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    breakdownRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    breakdownName: {
        fontWeight: '600',
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    percentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    progressBarContainer: {
        height: 10,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },

    // Budget
    budgetCard: {
        padding: 0,
        borderRadius: 20,
        overflow: 'hidden',
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
        marginBottom: 10,
    },
    budgetLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    budgetName: {
        fontWeight: '600',
    },
    setBudgetButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    budgetFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },

    // Empty state
    emptyState: {
        padding: theme.spacing.xxl,
        alignItems: 'center',
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
        marginBottom: theme.spacing.sm,
    },
    emptySubtitle: {
        color: theme.colors.textMuted,
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
        borderRadius: 24,
    },
    modalSubtitle: {
        marginTop: 4,
        marginBottom: theme.spacing.lg,
    },
    budgetInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 16,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    budgetInput: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
        minWidth: 100,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
});
