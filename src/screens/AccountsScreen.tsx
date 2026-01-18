import { useRouter } from 'expo-router';
import { ArrowLeft, Banknote, CreditCard, Landmark, Plus, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { Account, useFinanceStore } from '../store/useFinanceStore';

const ACCOUNT_TYPES = [
    { type: 'bank', icon: Landmark, label: 'Bank' },
    { type: 'cash', icon: Banknote, label: 'Cash' },
    { type: 'card', icon: CreditCard, label: 'Card' },
    { type: 'upi', icon: Wallet, label: 'UPI' },
] as const;

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AccountsScreen() {
    const router = useRouter();
    const { accounts, addAccount, currency } = useFinanceStore();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    // New Account State
    const [name, setName] = useState('');
    const [type, setType] = useState<Account['type']>('bank');
    const [balance, setBalance] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const handleAddAccount = () => {
        if (!name || !balance) return;
        addAccount({
            name,
            type,
            balance: parseFloat(balance) || 0,
            color,
        });
        setIsAddModalVisible(false);
        setName('');
        setBalance('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h3">My Accounts</Typography>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Plus size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {accounts.map((acc) => {
                    const TypeIcon = ACCOUNT_TYPES.find(t => t.type === acc.type)?.icon || Wallet;
                    return (
                        <Card key={acc.id} style={styles.accountCard}>
                            <View style={[styles.iconBox, { backgroundColor: acc.color + '20' }]}>
                                <TypeIcon size={24} color={acc.color} />
                            </View>
                            <View style={styles.accountInfo}>
                                <Typography variant="h3">{acc.name}</Typography>
                                <Typography variant="caption" color={theme.colors.textSecondary}>
                                    {acc.type.toUpperCase()}
                                </Typography>
                            </View>
                            <View style={styles.balanceInfo}>
                                <Typography variant="h2">
                                    {currency}{acc.balance.toLocaleString()}
                                </Typography>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>

            {/* Add Account Modal */}
            <Modal
                visible={isAddModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsAddModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Card style={styles.modalContent}>
                        <Typography variant="h2" align="center" style={{ marginBottom: 20 }}>
                            New Account
                        </Typography>

                        <Typography variant="label">Account Name</Typography>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. HDFC Bank, Pocket Cash"
                            placeholderTextColor={theme.colors.textMuted}
                            value={name}
                            onChangeText={setName}
                        />

                        <Typography variant="label">Initial Balance</Typography>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="numeric"
                            value={balance}
                            onChangeText={setBalance}
                        />

                        <Typography variant="label">Account Type</Typography>
                        <View style={styles.typeRow}>
                            {ACCOUNT_TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t.type}
                                    style={[
                                        styles.typeChip,
                                        type === t.type && { backgroundColor: theme.colors.primary }
                                    ]}
                                    onPress={() => setType(t.type)}
                                >
                                    <t.icon size={18} color={type === t.type ? '#FFF' : theme.colors.textSecondary} />
                                    <Typography
                                        variant="caption"
                                        color={type === t.type ? '#FFF' : theme.colors.textSecondary}
                                        style={{ marginLeft: 4 }}
                                    >
                                        {t.label}
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Typography variant="label">Theme Color</Typography>
                        <View style={styles.colorRow}>
                            {COLORS.map((c) => (
                                <TouchableOpacity
                                    key={c}
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: c },
                                        color === c && styles.selectedColor
                                    ]}
                                    onPress={() => setColor(c)}
                                />
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                variant="ghost"
                                onPress={() => setIsAddModalVisible(false)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Create Account"
                                onPress={handleAddAccount}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
    },
    addButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    scrollContent: {
        padding: theme.spacing.lg,
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    accountInfo: {
        flex: 1,
    },
    balanceInfo: {
        alignItems: 'flex-end',
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: theme.spacing.xl,
    },
    input: {
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.colors.text,
        marginTop: 8,
        marginBottom: 16,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        marginBottom: 16,
    },
    typeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceVariant,
    },
    colorRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        marginBottom: 24,
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    selectedColor: {
        borderWidth: 3,
        borderColor: '#FFF',
        ...theme.shadows.sm,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
});
