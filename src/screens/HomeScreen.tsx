import { useRouter } from 'expo-router';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { useFinanceStore } from '../store/useFinanceStore';

export default function HomeScreen() {
    const { transactions, getBalance, getExpenses, getEarnings } = useFinanceStore();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Typography variant="caption">Total Balance</Typography>
                    <Typography variant="h1" style={styles.balance}>
                        ${getBalance().toLocaleString()}
                    </Typography>
                </View>

                <View style={styles.statsRow}>
                    <Card style={styles.statsCard}>
                        <View style={styles.statsIconContainer}>
                            <ArrowDownLeft size={20} color={theme.colors.secondary} />
                        </View>
                        <Typography variant="caption">Earnings</Typography>
                        <Typography variant="h3">${getEarnings().toLocaleString()}</Typography>
                    </Card>

                    <Card style={styles.statsCard}>
                        <View style={styles.statsIconContainer}>
                            <ArrowUpRight size={20} color={theme.colors.error} />
                        </View>
                        <Typography variant="caption">Expenses</Typography>
                        <Typography variant="h3">${getExpenses().toLocaleString()}</Typography>
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
                    transactions.map((tx) => (
                        <Card key={tx.id} style={styles.transactionCard}>
                            <View style={styles.txLeft}>
                                <Typography variant="h3">{tx.category}</Typography>
                                <Typography variant="caption">{new Date(tx.date).toLocaleDateString()}</Typography>
                            </View>
                            <Typography
                                variant="h3"
                                color={tx.type === 'earning' ? theme.colors.secondary : theme.colors.error}
                            >
                                {tx.type === 'earning' ? '+' : '-'}${tx.amount.toLocaleString()}
                            </Typography>
                        </Card>
                    ))
                )}
            </ScrollView>

            <View style={styles.fabContainer}>
                <Button
                    title="+"
                    onPress={() => router.push('/add-transaction')}
                    style={styles.fab}
                />
            </View>
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
    }
});
