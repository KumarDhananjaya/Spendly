import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Banknote, ChevronRight, CreditCard, Landmark, Plus, Settings, Sparkles, Wallet } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { useFinanceStore } from '../store/useFinanceStore';

export default function HomeScreen() {
    const { transactions, accounts, getBalance, getExpenses, getEarnings, currency, setCurrency, categories } = useFinanceStore();
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

                {/* Net Worth View */}
                <View style={styles.netWorthContainer}>
                    <Typography variant="caption" color={theme.colors.textSecondary}>Net Worth</Typography>
                    <Typography variant="h1" style={styles.netWorthAmount}>
                        {currency}{balance.toLocaleString()}
                    </Typography>
                </View>

                {/* Account Cards Scroll */}
                <View style={styles.accountsSection}>
                    <View style={styles.sectionHeader}>
                        <Typography variant="h3">My Accounts</Typography>
                        <TouchableOpacity onPress={() => router.push('/accounts')}>
                            <Typography variant="caption" color={theme.colors.primary}>Manage</Typography>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.accountsScroll}
                    >
                        {accounts.map((acc) => {
                            const icons = { bank: Landmark, cash: Banknote, card: CreditCard, upi: Wallet };
                            const Icon = icons[acc.type] || Wallet;
                            return (
                                <TouchableOpacity
                                    key={acc.id}
                                    onPress={() => router.push('/accounts')}
                                    activeOpacity={0.9}
                                >
                                    <LinearGradient
                                        colors={[acc.color, acc.color + 'CC']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.accountCard}
                                    >
                                        <View style={styles.accountCardHeader}>
                                            <View style={styles.accountIconBox}>
                                                <Icon size={18} color="#FFF" />
                                            </View>
                                            <Typography variant="caption" style={styles.accountCardType}>
                                                {acc.type.toUpperCase()}
                                            </Typography>
                                        </View>
                                        <Typography variant="body" style={styles.accountCardName} numberOfLines={1}>
                                            {acc.name}
                                        </Typography>
                                        <Typography variant="h2" style={styles.accountCardBalance}>
                                            {currency}{acc.balance.toLocaleString()}
                                        </Typography>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })}
                        <TouchableOpacity
                            style={styles.addAccountCard}
                            onPress={() => router.push('/accounts')}
                        >
                            <Plus size={24} color={theme.colors.textMuted} />
                            <Typography variant="caption" color={theme.colors.textMuted} style={{ marginTop: 4 }}>
                                Add
                            </Typography>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Summary Row (Moved below accounts) */}
                <View style={styles.homeStatsRow}>
                    <View style={styles.statItem}>
                        <View style={[styles.statIcon, styles.incomeIcon]}>
                            <ArrowDownLeft size={16} color="#10B981" />
                        </View>
                        <View>
                            <Typography variant="caption" style={styles.statLabelHome}>Income</Typography>
                            <Typography variant="h3" color={theme.colors.secondary}>
                                +{currency}{getEarnings().toLocaleString()}
                            </Typography>
                        </View>
                    </View>

                    <View style={styles.statDividerHome} />

                    <View style={styles.statItem}>
                        <View style={[styles.statIcon, styles.expenseIcon]}>
                            <ArrowUpRight size={16} color="#EF4444" />
                        </View>
                        <View>
                            <Typography variant="caption" style={styles.statLabelHome}>Expenses</Typography>
                            <Typography variant="h3" color={theme.colors.error}>
                                -{currency}{getExpenses().toLocaleString()}
                            </Typography>
                        </View>
                    </View>
                </View>

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
                        onPress={() => router.push({ pathname: '/add-transaction', params: { type: 'transfer' } })}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                            <ArrowLeftRight size={22} color={theme.colors.primary} />
                        </View>
                        <Typography variant="body" style={styles.quickActionLabel}>Transfer</Typography>
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

    // Net Worth
    netWorthContainer: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    netWorthAmount: {
        fontSize: 48,
        fontWeight: '800',
        marginTop: 4,
    },

    // Accounts Section
    accountsSection: {
        marginBottom: theme.spacing.xl,
    },
    accountsScroll: {
        paddingRight: theme.spacing.lg,
        gap: 16,
    },
    accountCard: {
        width: 160,
        height: 120,
        borderRadius: 20,
        padding: 16,
        justifyContent: 'space-between',
        ...theme.shadows.md,
    },
    accountCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountCardType: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '700',
    },
    accountCardName: {
        color: '#FFF',
        fontWeight: '600',
        marginTop: 8,
    },
    accountCardBalance: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
    },
    addAccountCard: {
        width: 100,
        height: 120,
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
    },

    // Home Stats
    homeStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.xl,
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
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    statLabelHome: {
        color: theme.colors.textSecondary,
    },
    statDividerHome: {
        width: 1,
        height: 40,
        backgroundColor: theme.colors.border,
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
