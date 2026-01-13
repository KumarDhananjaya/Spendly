import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Plus, Sparkles } from 'lucide-react-native';
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

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
                    <TouchableOpacity
                        style={styles.currencyButton}
                        onPress={() => setCurrencyModalVisible(true)}
                    >
                        <Typography variant="h3" color={theme.colors.primary}>{currency}</Typography>
                    </TouchableOpacity>
                </View>

                {/* Balance Card */}
                <Card style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Typography variant="label">Total Balance</Typography>
                    </View>
                    <Typography variant="h1" style={styles.balanceAmount}>
                        {currency}{getBalance().toLocaleString()}
                    </Typography>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, styles.incomeIcon]}>
                                <ArrowDownLeft size={16} color={theme.colors.secondary} />
                            </View>
                            <View>
                                <Typography variant="caption">Income</Typography>
                                <Typography variant="h3" color={theme.colors.secondary}>
                                    +{currency}{getEarnings().toLocaleString()}
                                </Typography>
                            </View>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, styles.expenseIcon]}>
                                <ArrowUpRight size={16} color={theme.colors.error} />
                            </View>
                            <View>
                                <Typography variant="caption">Expenses</Typography>
                                <Typography variant="h3" color={theme.colors.error}>
                                    -{currency}{getExpenses().toLocaleString()}
                                </Typography>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => router.push('/add-transaction')}
                    >
                        <View style={styles.quickActionIcon}>
                            <Plus size={20} color={theme.colors.primary} />
                        </View>
                        <Typography variant="caption">Add</Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => router.push('/smart-scan')}
                    >
                        <View style={styles.quickActionIcon}>
                            <Sparkles size={20} color={theme.colors.primary} />
                        </View>
                        <Typography variant="caption">Smart Scan</Typography>
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
                        <Typography variant="body" align="center">No transactions yet</Typography>
                        <Typography variant="caption" align="center" style={{ marginTop: 4 }}>
                            Tap the + button to add your first transaction
                        </Typography>
                    </Card>
                ) : (
                    <Card style={styles.transactionsList}>
                        {recentTransactions.map((tx, index) => {
                            const category = categories.find(c => c.id === tx.categoryId);
                            const isLast = index === recentTransactions.length - 1;

                            return (
                                <View key={tx.id} style={[styles.transactionItem, !isLast && styles.transactionBorder]}>
                                    <View style={[styles.categoryIcon, { backgroundColor: category?.color + '20' || theme.colors.glass }]}>
                                        <Typography variant="h3">{category?.name?.charAt(0) || '?'}</Typography>
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
                <Plus size={28} color="#FFF" />
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
    greeting: {
        marginTop: 4,
    },
    currencyButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.glass,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Balance Card
    balanceCard: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    balanceHeader: {
        marginBottom: theme.spacing.sm,
    },
    balanceAmount: {
        color: '#FFFFFF',
        fontSize: 40,
        marginBottom: theme.spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
    },
    expenseIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
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
        borderRadius: theme.roundness,
        ...theme.shadows.sm,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.glass,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
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
    transactionCategory: {
        color: theme.colors.text,
        fontWeight: '500',
    },
    emptyState: {
        padding: theme.spacing.xl,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: 90,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.lg,
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
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: theme.colors.surfaceVariant,
    },
    activeCurrencyItem: {
        backgroundColor: theme.colors.primary,
    },
});
