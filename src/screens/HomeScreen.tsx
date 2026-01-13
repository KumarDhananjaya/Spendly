import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Plus, Settings, Sparkles, Wallet } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { useFinanceStore } from '../store/useFinanceStore';

export default function HomeScreen() {
    const { transactions, getBalance, getExpenses, getEarnings, currency, setCurrency, categories } = useFinanceStore();
    const router = useRouter();
    const [isCurrencyModalVisible, setCurrencyModalVisible] = React.useState(false);

    const commonCurrencies = ['₹', '$', '€', '£', '¥', '₿'];
    const recentTransactions = transactions.slice(0, 5);
    const balance = getBalance();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Typography variant="caption">Welcome back 👋</Typography>
                        <Typography variant="h2" style={styles.greeting}>Your Finances</Typography>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/settings')}
                        >
                            <Settings size={20} color={theme.colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => setCurrencyModalVisible(true)}
                        >
                            <Typography variant="h3" color={theme.colors.primary}>{currency}</Typography>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Balance Card with Gradient */}
                <LinearGradient
                    colors={['#4F46E5', '#7C3AED', '#9333EA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.balanceCard}
                >
                    <View style={styles.balanceHeader}>
                        <View style={styles.balanceIconContainer}>
                            <Wallet size={20} color="rgba(255,255,255,0.9)" />
                        </View>
                        <Typography variant="label" style={styles.balanceLabel}>Total Balance</Typography>
                    </View>
                    <Typography variant="h1" style={styles.balanceAmount}>
                        {currency}{balance.toLocaleString()}
                    </Typography>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, styles.incomeIcon]}>
                                <ArrowDownLeft size={16} color="#10B981" />
                            </View>
                            <View>
                                <Typography variant="caption" style={styles.statLabel}>Income</Typography>
                                <Typography variant="h3" style={styles.incomeText}>
                                    +{currency}{getEarnings().toLocaleString()}
                                </Typography>
                            </View>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, styles.expenseIcon]}>
                                <ArrowUpRight size={16} color="#EF4444" />
                            </View>
                            <View>
                                <Typography variant="caption" style={styles.statLabel}>Expenses</Typography>
                                <Typography variant="h3" style={styles.expenseText}>
                                    -{currency}{getExpenses().toLocaleString()}
                                </Typography>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => router.push('/add-transaction')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                            <Plus size={22} color={theme.colors.primary} />
                        </View>
                        <Typography variant="body" style={styles.quickActionLabel}>Add</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => router.push('/smart-scan')}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                            <Sparkles size={22} color="#A855F7" />
                        </View>
                        <Typography variant="body" style={styles.quickActionLabel}>Smart Scan</Typography>
                    </TouchableOpacity>
                </View>

                {/* Recent Transactions */}
                <View style={styles.sectionHeader}>
                    <Typography variant="h3">Recent Transactions</Typography>
                    <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() => router.push('/history')}
                    >
                        <Typography variant="caption" color={theme.colors.primary}>See All</Typography>
                        <ChevronRight size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                {transactions.length === 0 ? (
                    <Card variant="flat" style={styles.emptyState}>
                        <View style={styles.emptyIconContainer}>
                            <Wallet size={40} color={theme.colors.textMuted} />
                        </View>
                        <Typography variant="h3" align="center" style={styles.emptyTitle}>
                            No transactions yet
                        </Typography>
                        <Typography variant="caption" align="center" style={styles.emptySubtitle}>
                            Start tracking your finances by adding your first transaction
                        </Typography>
                        <Button
                            title="Add Transaction"
                            onPress={() => router.push('/add-transaction')}
                            style={styles.emptyButton}
                        />
                    </Card>
                ) : (
                    <Card style={styles.transactionsList}>
                        {recentTransactions.map((tx, index) => {
                            const category = categories.find(c => c.id === tx.categoryId);
                            const isLast = index === recentTransactions.length - 1;

                            return (
                                <View key={tx.id} style={[styles.transactionItem, !isLast && styles.transactionBorder]}>
                                    <View style={[styles.categoryIcon, { backgroundColor: (category?.color || theme.colors.primary) + '20' }]}>
                                        <Typography variant="body" style={{ fontWeight: '700', color: category?.color || theme.colors.primary }}>
                                            {category?.name?.charAt(0).toUpperCase() || '?'}
                                        </Typography>
                                    </View>
                                    <View style={styles.transactionInfo}>
                                        <Typography variant="body" style={styles.transactionCategory}>
                                            {category?.name || 'Other'}
                                        </Typography>
                                        <Typography variant="caption">
                                            {new Date(tx.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Typography>
                                    </View>
                                    <Typography
                                        variant="h3"
                                        color={tx.type === 'earning' ? theme.colors.secondary : theme.colors.error}
                                    >
                                        {tx.type === 'earning' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                                    </Typography>
                                </View>
                            );
                        })}
                    </Card>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/add-transaction')}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={['#4F46E5', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <Plus size={28} color="#FFF" />
                </LinearGradient>
            </TouchableOpacity>

            {/* Currency Modal */}
            <Modal
                visible={isCurrencyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCurrencyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContent}>
                        <Typography variant="h2" align="center" style={styles.modalTitle}>
                            Select Currency
                        </Typography>
                        <View style={styles.currencyGrid}>
                            {commonCurrencies.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.currencyItem,
                                        currency === c && styles.activeCurrencyItem
                                    ]}
                                    onPress={() => {
                                        setCurrency(c);
                                        setCurrencyModalVisible(false);
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        color={currency === c ? '#FFF' : theme.colors.text}
                                    >
                                        {c}
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button
                            title="Cancel"
                            variant="ghost"
                            onPress={() => setCurrencyModalVisible(false)}
                            fullWidth
                        />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    greeting: {
        marginTop: 4,
    },
    headerButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.sm,
    },

    // Balance Card
    balanceCard: {
        borderRadius: 24,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: theme.spacing.sm,
    },
    balanceIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 44,
        fontWeight: '700',
        marginBottom: theme.spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: theme.spacing.md,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    incomeIcon: {
        backgroundColor: 'rgba(16, 185, 129, 0.25)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.7)',
    },
    incomeText: {
        color: '#6EE7B7',
        fontWeight: '600',
    },
    expenseText: {
        color: '#FCA5A5',
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: theme.spacing.md,
    },

    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    quickAction: {
        flex: 1,
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        ...theme.shadows.md,
    },
    quickActionIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    quickActionLabel: {
        fontWeight: '600',
        color: theme.colors.text,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    // Transactions
    transactionsList: {
        padding: 0,
        borderRadius: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: 14,
    },
    transactionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionCategory: {
        color: theme.colors.text,
        fontWeight: '600',
        marginBottom: 2,
    },

    // Empty State
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
        marginBottom: theme.spacing.lg,
        color: theme.colors.textMuted,
    },
    emptyButton: {
        marginTop: theme.spacing.sm,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 90,
        right: 24,
        ...theme.shadows.lg,
    },
    fabGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
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
    modalTitle: {
        marginBottom: theme.spacing.lg,
    },
    currencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: theme.spacing.lg,
    },
    currencyItem: {
        width: '30%',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: theme.colors.surfaceVariant,
    },
    activeCurrencyItem: {
        backgroundColor: theme.colors.primary,
    },
});
