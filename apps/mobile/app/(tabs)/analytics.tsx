import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { Card, Typography } from '@splendly/ui';
import { formatCurrency } from '@splendly/utils';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { LineChart, PieChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { expenses } = useFinanceStore();

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const lineData = [
    { value: 15, label: 'Jan' },
    { value: 30, label: 'Feb' },
    { value: 26, label: 'Mar' },
    { value: 40, label: 'Apr' },
    { value: 25, label: 'May' },
    { value: 60, label: 'Jun' },
  ];

  const categorySummary = expenses.reduce((acc, exp) => {
    acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categorySummary).map(([id, value], index) => ({
    value,
    color: index === 0 ? Colors.dark.tint : index === 1 ? Colors.dark.neon : '#FF5733',
    text: id === 'default-cat-id' ? 'General' : id,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="h2" style={styles.title}>Spending Trend</Typography>

      <Card glass style={styles.chartCard}>
        <LineChart
          data={lineData}
          height={180}
          width={screenWidth - 80}
          initialSpacing={0}
          color={Colors.dark.neon}
          thickness={4}
          startFillColor={Colors.dark.neon}
          endFillColor="rgba(0, 245, 255, 0.01)"
          startOpacity={0.4}
          endOpacity={0.1}
          noOfSections={3}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisTextStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}
          hideDataPoints
          curved
          animateOnDataChange
          animationDuration={1000}
        />
      </Card>

      <Typography variant="h2" style={styles.sectionTitle}>Category Breakdown</Typography>

      <View style={styles.pieRow}>
        <Card glass style={styles.pieCard}>
          <PieChart
            data={pieData.length > 0 ? pieData : [{ value: 1, color: '#333' }]}
            donut
            showText
            textColor="#FFF"
            radius={70}
            innerRadius={50}
            textSize={12}
            focusOnPress
          />
        </Card>

        <View style={styles.legendContainer}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Typography variant="caption" style={styles.legendText}>{item.text}</Typography>
            </View>
          ))}
        </View>
      </View>

      <Typography variant="h2" style={styles.sectionTitle}>Monthly Stats</Typography>
      <Card glass style={styles.statsCard}>
        <View style={styles.statRow}>
          <Typography variant="body">Total Spent</Typography>
          <Typography variant="h2" style={{ color: Colors.dark.neon }}>{formatCurrency(totalSpent)}</Typography>
        </View>
        <View style={styles.statRow}>
          <Typography variant="body">Average Daily</Typography>
          <Typography variant="h2" style={{ color: Colors.dark.tint }}>{formatCurrency(totalSpent / 30)}</Typography>
        </View>
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 20,
  },
  title: {
    marginTop: 20,
    marginBottom: 15,
  },
  chartCard: {
    padding: 15,
    paddingTop: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 20,
  },
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    marginRight: 15,
  },
  legendContainer: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    color: 'rgba(255,255,255,0.7)',
  },
  statsCard: {
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  }
});
