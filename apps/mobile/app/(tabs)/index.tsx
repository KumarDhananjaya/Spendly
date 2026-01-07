import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { syncService } from '@/services/syncService';
import { Card, Typography, Button } from '@splendly/ui';
import { formatCurrency, formatDate } from '@splendly/utils';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { expenses, lastSyncAt } = useFinanceStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await syncService.sync();
    setRefreshing(false);
  }, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Typography variant="caption">Total Spending</Typography>
        <Typography variant="h1">{formatCurrency(totalSpent)}</Typography>
        <Typography variant="caption" style={styles.syncText}>
          Last Synced: {lastSyncAt ? formatDate(lastSyncAt, 'MMMM D, h:mm A') : 'Never'}
        </Typography>
      </Card>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.clientId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <Typography variant="h2">{item.note || 'Untitled Expense'}</Typography>
              <Typography variant="h2" style={styles.amount}>
                {formatCurrency(item.amount)}
              </Typography>
            </View>
            <Typography variant="caption">
              {formatDate(item.spentAt)} • {item.source}
            </Typography>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Typography>No expenses yet. Tap "+" to add one.</Typography>
          </View>
        }
      />

      <Button
        title="+"
        onPress={() => router.push('/add-expense')}
        style={styles.fab}
        textStyle={styles.fabText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  summaryCard: {
    backgroundColor: '#6200EE',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  syncText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  expenseCard: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  amount: {
    color: '#D32F2F',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200EE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 24,
  },
});
