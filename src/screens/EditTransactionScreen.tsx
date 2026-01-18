import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, CopyPlus, Trash2 } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { TransactionType, useFinanceStore } from '../store/useFinanceStore';

export default function EditTransactionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { transactions, updateTransaction, deleteTransaction, currency, accounts, categories } = useFinanceStore();
    const router = useRouter();

    const transaction = transactions.find(t => t.id === id);

    const [amount, setAmount] = React.useState(transaction?.amount.toString() || '0');
    const [type, setType] = React.useState<TransactionType>(transaction?.type || 'expense');
    const [selectedCategoryId, setSelectedCategoryId] = React.useState(transaction?.categoryId || '');
    const [selectedAccountId, setSelectedAccountId] = React.useState(transaction?.accountId || '');
    const [selectedToAccountId, setSelectedToAccountId] = React.useState(transaction?.toAccountId || accounts[1]?.id || accounts[0]?.id || '');
    const [note, setNote] = React.useState(transaction?.note || '');

    React.useEffect(() => {
        if (!transaction) {
            router.back();
        }
    }, [transaction]);

    const filteredCategories = categories.filter(c => c.type === type);

    const handleNumberPress = (num: string) => {
        if (amount === '0' && num !== '.') {
            setAmount(num);
        } else if (num === '.' && amount.includes('.')) {
            return;
        } else {
            setAmount(amount + num);
        }
    };

    const handleBackspace = () => {
        if (amount.length === 1) {
            setAmount('0');
        } else {
            setAmount(amount.slice(0, -1));
        }
    };

    const handleSave = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;
        if (!id) return;

        if (type === 'transfer' && selectedAccountId === selectedToAccountId) {
            Alert.alert('Error', 'Source and destination accounts must be different');
            return;
        }

        updateTransaction(id, {
            amount: numAmount,
            type,
            categoryId: type === 'transfer' ? 'transfer' : selectedCategoryId,
            accountId: selectedAccountId,
            toAccountId: type === 'transfer' ? selectedToAccountId : undefined,
            note,
        });
        router.back();
    };

    const handleDuplicate = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        const { addTransaction } = useFinanceStore.getState();
        addTransaction({
            amount: numAmount,
            type,
            categoryId: type === 'transfer' ? 'transfer' : selectedCategoryId,
            accountId: selectedAccountId,
            toAccountId: type === 'transfer' ? selectedToAccountId : undefined,
            note: `${note} (Copy)`,
        });
        Alert.alert('Success', 'Transaction duplicated');
        router.back();
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (id) {
                            deleteTransaction(id);
                            router.back();
                        }
                    }
                }
            ]
        );
    };

    const numpadKeys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['.', '0', '⌫']
    ];

    if (!transaction) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Typography variant="h3">Edit Transaction</Typography>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={handleDuplicate} style={styles.duplicateButton}>
                            <CopyPlus size={22} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                            <Trash2 size={22} color={theme.colors.error} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Amount Display */}
                    <View style={styles.amountContainer}>
                        <Typography variant="label" style={styles.amountLabel}>Amount</Typography>
                        <View style={styles.amountRow}>
                            <Typography variant="h1" style={styles.currencySymbol}>{currency}</Typography>
                            <Typography variant="h1" style={styles.amountText}>{amount}</Typography>
                        </View>
                    </View>

                    {/* Type Toggle */}
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'expense' && styles.expenseActive]}
                            onPress={() => setType('expense')}
                            activeOpacity={0.8}
                        >
                            <Typography
                                variant="body"
                                color={type === 'expense' ? '#FFF' : theme.colors.textSecondary}
                                style={styles.typeButtonText}
                            >
                                Expense
                            </Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'earning' && styles.incomeActive]}
                            onPress={() => setType('earning')}
                            activeOpacity={0.8}
                        >
                            <Typography
                                variant="body"
                                color={type === 'earning' ? '#FFF' : theme.colors.textSecondary}
                                style={styles.typeButtonText}
                            >
                                Income
                            </Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'transfer' && styles.transferActive]}
                            onPress={() => setType('transfer')}
                            activeOpacity={0.8}
                        >
                            <Typography
                                variant="body"
                                color={type === 'transfer' ? '#FFF' : theme.colors.textSecondary}
                                style={styles.typeButtonText}
                            >
                                Transfer
                            </Typography>
                        </TouchableOpacity>
                    </View>

                    {/* Category Selection (Hidden for transfers) */}
                    {type !== 'transfer' && (
                        <View style={styles.section}>
                            <Typography variant="label" style={styles.sectionLabel}>Category</Typography>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.pillsRow}>
                                    {filteredCategories.map((cat) => {
                                        const isSelected = selectedCategoryId === cat.id;
                                        return (
                                            <TouchableOpacity
                                                key={cat.id}
                                                style={[
                                                    styles.categoryPill,
                                                    isSelected && { backgroundColor: cat.color, borderColor: cat.color }
                                                ]}
                                                onPress={() => setSelectedCategoryId(cat.id)}
                                                activeOpacity={0.7}
                                            >
                                                {isSelected && (
                                                    <Check size={16} color="#FFF" style={{ marginRight: 6 }} />
                                                )}
                                                <Typography
                                                    variant="body"
                                                    color={isSelected ? '#FFF' : theme.colors.text}
                                                    style={styles.pillText}
                                                >
                                                    {cat.name}
                                                </Typography>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Account Selection */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>
                            {type === 'transfer' ? 'From Account' : 'Account'}
                        </Typography>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.pillsRow}>
                                {accounts.map((acc) => {
                                    const isSelected = selectedAccountId === acc.id;
                                    return (
                                        <TouchableOpacity
                                            key={acc.id}
                                            style={[
                                                styles.accountPill,
                                                isSelected && styles.accountPillActive
                                            ]}
                                            onPress={() => setSelectedAccountId(acc.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.accountDot, { backgroundColor: acc.color }]} />
                                            <Typography
                                                variant="body"
                                                color={isSelected ? theme.colors.primary : theme.colors.text}
                                                style={styles.pillText}
                                            >
                                                {acc.name}
                                            </Typography>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    {/* To Account Selection (Only for transfers) */}
                    {type === 'transfer' && (
                        <View style={styles.section}>
                            <Typography variant="label" style={styles.sectionLabel}>To Account</Typography>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.pillsRow}>
                                    {accounts.map((acc) => {
                                        const isSelected = selectedToAccountId === acc.id;
                                        return (
                                            <TouchableOpacity
                                                key={acc.id}
                                                style={[
                                                    styles.accountPill,
                                                    isSelected && styles.accountPillActive
                                                ]}
                                                onPress={() => setSelectedToAccountId(acc.id)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={[styles.accountDot, { backgroundColor: acc.color }]} />
                                                <Typography
                                                    variant="body"
                                                    color={isSelected ? theme.colors.primary : theme.colors.text}
                                                    style={styles.pillText}
                                                >
                                                    {acc.name}
                                                </Typography>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Note */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>Note (Optional)</Typography>
                        <TextInput
                            style={styles.noteInput}
                            placeholder="Update note..."
                            placeholderTextColor={theme.colors.textMuted}
                            value={note}
                            onChangeText={setNote}
                        />
                    </View>

                    {/* Number Pad */}
                    <Card variant="flat" style={styles.numpad}>
                        {numpadKeys.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.numpadRow}>
                                {row.map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={styles.numpadButton}
                                        onPress={() => num === '⌫' ? handleBackspace() : handleNumberPress(num)}
                                        activeOpacity={0.6}
                                    >
                                        <View style={styles.numpadButtonInner}>
                                            <Typography variant="h2" style={styles.numpadText}>{num}</Typography>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </Card>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={
                                type === 'expense' ? ['#EF4444', '#DC2626'] :
                                    type === 'earning' ? ['#10B981', '#059669'] :
                                        ['#3B82F6', '#2563EB']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButtonGradient}
                        >
                            <Typography variant="body" style={styles.saveButtonText}>
                                {type === 'transfer' ? 'Save Transfer' : 'Save Changes'}
                            </Typography>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
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
    duplicateButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
    },
    amountLabel: {
        marginBottom: theme.spacing.sm,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    currencySymbol: {
        fontSize: 32,
        color: theme.colors.textMuted,
        marginBottom: 8,
    },
    amountText: {
        fontSize: 64,
        lineHeight: 72,
        fontWeight: '700',
    },
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 16,
        padding: 6,
        marginBottom: theme.spacing.xl,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    typeButtonText: {
        fontWeight: '600',
    },
    expenseActive: {
        backgroundColor: theme.colors.error,
    },
    incomeActive: {
        backgroundColor: theme.colors.secondary,
    },
    transferActive: {
        backgroundColor: theme.colors.primary,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionLabel: {
        marginBottom: theme.spacing.sm,
    },
    pillsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    pillText: {
        fontWeight: '500',
    },
    accountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    accountPillActive: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
    },
    accountDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    noteInput: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    numpad: {
        padding: theme.spacing.sm,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceVariant,
    },
    numpadRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    numpadButton: {
        width: 80,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numpadButtonInner: {
        width: 64,
        height: 52,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.sm,
    },
    numpadText: {
        fontWeight: '600',
    },
    footer: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    saveButton: {
        borderRadius: 16,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    saveButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 17,
    },
});
