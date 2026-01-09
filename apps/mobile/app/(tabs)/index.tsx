import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { syncService } from '@/services/syncService';
import { Card, Typography, Button } from '@splendly/ui';
import { formatCurrency, formatDate } from '@splendly/utils';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { expenses, lastSyncAt, userId } = useFinanceStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const router = useRouter();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await syncService.sync();
    setRefreshing(false);
  }, []);

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const ActionButton = ({ icon, label, onPress }: { icon: any, label: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.actionBtnContainer} onPress={onPress}>
      <View style={styles.actionBtnIcon}>
        <IconSymbol name={icon} size={24} color={Colors.dark.neon} />
      </View>
      <Typography variant="caption" style={styles.actionBtnLabel}>{label}</Typography>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.dark.neon} />}
    >
      <View style={styles.header}>
        <View>
          <Typography variant="body" style={styles.greeting}>Good Morning,</Typography>
          <Typography variant="h2" style={styles.userName}>{userId?.split('@')[0] || 'Guest'}</Typography>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <IconSymbol name="bell.fill" size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <Card glass style={styles.balanceCard}>
        <LinearGradient
          colors={['rgba(160, 106, 249, 0.2)', 'rgba(0, 245, 255, 0.1)']}
          style={styles.balanceGradient}
        >
          <Typography variant="caption" style={styles.balanceLabel}>TOTAL BALANCE</Typography>
          <Typography variant="h1" style={styles.balanceAmount}>{formatCurrency(totalSpent)}</Typography>
          <View style={styles.balanceFooter}>
            <IconSymbol name="arrow.up.right" size={14} color={Colors.dark.neon} />
            <Typography variant="caption" style={styles.dailyChange}>Daily Change +$120.50</Typography>
          </View>
        </LinearGradient>
      </Card>

      <View style={styles.actionsRow}>
        <ActionButton icon="paperplane.fill" label="Send" onPress={() => { }} />
        <ActionButton icon="arrow.down.left" label="Request" onPress={() => { }} />
        <ActionButton icon="ellipsis" label="More" onPress={() => { }} />
      </View>

      <View style={styles.sectionHeader}>
        <Typography variant="h2">Recent Transactions</Typography>
        <TouchableOpacity onPress={() => { }}>
          <Typography variant="caption" style={styles.seeAll}>See All</Typography>
        </TouchableOpacity>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.empty}>
          <Typography>No expenses yet. Tap "+" to add one.</Typography>
        </View>
      ) : (
        expenses.slice(0, 5).map((item) => (
          <Card key={item.clientId} style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <View style={styles.iconContainer}>
                <IconSymbol name="cart.fill" size={20} color={Colors.dark.tint} />
              </View>
              <View style={styles.expenseDetails}>
                <Typography variant="h2">{item.note || 'Untitled'}</Typography>
                <Typography variant="caption">{formatDate(item.spentAt)}</Typography>
              </View>
              <Typography variant="h2" style={styles.amount}>
                -{formatCurrency(item.amount)}
              </Typography>
            </View>
          </Card>
        ))
      )}

      <View style={{ height: 100 }} />

      <Button
        title="+"
        onPress={() => router.push('/add-expense')}
        style={styles.fab}
        textStyle={styles.fabText}
        gradient={Colors.dark.gradient}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  greeting: {
    color: 'rgba(255,255,255,0.6)',
  },
  userName: {
    fontSize: 24,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    padding: 0,
    marginBottom: 30,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: 24,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  dailyChange: {
    color: Colors.dark.neon,
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 35,
  },
  actionBtnContainer: {
    alignItems: 'center',
  },
  actionBtnIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionBtnLabel: {
    color: 'rgba(255,255,255,0.8)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAll: {
    color: Colors.dark.tint,
  },
  expenseCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(160, 106, 249, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expenseDetails: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    color: '#FFF',
  },
  empty: {
    alignItems: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: Colors.dark.neon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
  },
});
