import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight, Globe } from 'lucide-react-native';
import React from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.currencyTrigger}
                        onPress={() => setCurrencyModalVisible(true)}
                    >
                        <Globe size={14} color={theme.colors.textSecondary} />
                        <Typography variant="caption">{currency}</Typography>
                    </TouchableOpacity>
                    <Typography variant="caption">Total Balance</Typography>
                    <Typography variant="h1" style={styles.balance}>
                        {currency}{getBalance().toLocaleString()}
                    </Typography>
                </View>

                <View style={styles.statsRow}>
                    <Card style={styles.statsCard}>
                        <View style={styles.statsIconContainer}>
                            <ArrowDownLeft size={20} color={theme.colors.secondary} />
                        </View>
                        <Typography variant="caption">Earnings</Typography>
                        <Typography variant="h3">{currency}{getEarnings().toLocaleString()}</Typography>
                    </Card>

                    <Card style={styles.statsCard}>
                        <View style={styles.statsIconContainer}>
                            <ArrowUpRight size={20} color={theme.colors.error} />
                        </View>
                        <Typography variant="caption">Expenses</Typography>
                        <Typography variant="h3">{currency}{getExpenses().toLocaleString()}</Typography>
                    </Card>
                </View>

                <View style={styles.sectionHeader}>
                    <Typography variant="h2">Recent Transactions</Typography>
                    <Button
                        title="Add"
                        variant="glass"
                        style={styles.addButton}
                        onPress={() => router.push('/add-transaction')}
                    />
                </View>

                {transactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Typography variant="body">No transactions yet.</Typography>
                    </View>
                ) : (
                    transactions.map((tx) => {
                        const category = categories.find(c => c.id === tx.categoryId);
                        return (
                            <Card key={tx.id} style={styles.transactionCard}>
                                <View style={styles.txLeft}>
                                    <Typography variant="h3">{category?.name || 'Other'}</Typography>
                                    <Typography variant="caption">{new Date(tx.date).toLocaleDateString()}</Typography>
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

            <View style={styles.fabContainer}>
                <Button
                    title="+"
                    onPress={() => router.push('/add-transaction')}
                    style={styles.fab}
                />
            </View>

            <Modal
                visible={isCurrencyModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCurrencyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Typography variant="h2" style={styles.modalTitle}>Select Currency</Typography>
                        <View style={styles.currencyGrid}>
                            {commonCurrencies.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[styles.currencyItem, currency === c && styles.activeCurrencyItem]}
                                    onPress={() => {
                                        setCurrency(c);
                                        setCurrencyModalVisible(false);
                                    }}
                                >
                                    <Typography variant="h2">{c}</Typography>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Button
                            title="Close"
                            variant="glass"
                            onPress={() => setCurrencyModalVisible(false)}
                        />
                    </View>
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
    },
    header: {
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
        position: 'relative',
    },
    currencyTrigger: {
        position: 'absolute',
        right: 0,
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    balance: {
        marginTop: theme.spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    statsCard: {
        flex: 1,
        padding: theme.spacing.md,
    },
    statsIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    addButton: {
        width: 80,
        height: 36,
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
    fabContainer: {
        position: 'absolute',
        bottom: 32,
        right: 32,
        width: 64,
    },
    fab: {
        width: 64,
        height: 64,
        borderRadius: 32,
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
    modalTitle: {
        marginBottom: 24,
        textAlign: 'center',
    },
    currencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    currencyItem: {
        width: '30%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    activeCurrencyItem: {
        backgroundColor: theme.colors.primary,
    },
});
