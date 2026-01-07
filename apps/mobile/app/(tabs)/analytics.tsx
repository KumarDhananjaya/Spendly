import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { Card, Typography } from '@splendly/ui';
import { formatCurrency } from '@splendly/utils';

export default function AnalyticsScreen() {
  const { expenses } = useFinanceStore();

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category placeholder logic
  const categorySummary = expenses.reduce((acc, exp) => {
    acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Typography variant="h2">Monthly Spending</Typography>
        <Typography variant="h1" style={styles.total}>{formatCurrency(totalSpent)}</Typography>
      </Card>

      <Typography variant="h2" style={styles.sectionTitle}>By Category</Typography>
      {Object.entries(categorySummary).map(([catId, amount]) => (
        <Card key={catId} style={styles.categoryCard}>
          <Typography variant="body">{catId === 'default-cat-id' ? 'General' : catId}</Typography>
          <Typography variant="h2">{formatCurrency(amount)}</Typography>
        </Card>
      ))}

      {expenses.length === 0 && (
        <View style={styles.empty}>
          <Typography>No data to analyze yet.</Typography>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  total: {
    marginTop: 8,
    color: '#6200EE',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  }
});
