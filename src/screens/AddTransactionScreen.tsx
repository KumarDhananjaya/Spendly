import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Sparkles } from 'lucide-react-native';
import React from 'react';
import {
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
import { Category, TransactionType, useFinanceStore } from '../store/useFinanceStore';
import { parseMessage } from '../utils/parser';

export default function AddTransactionScreen() {
    const { addTransaction, currency, accounts, categories } = useFinanceStore();
    const [amount, setAmount] = React.useState('0');
    const [type, setType] = React.useState<TransactionType>('expense');
    const [selectedCategoryId, setSelectedCategoryId] = React.useState(categories[0]?.id || '');
    const [selectedAccountId, setSelectedAccountId] = React.useState(accounts[0]?.id || '');
    const [note, setNote] = React.useState('');
    const router = useRouter();

    const filteredCategories = categories.filter(c => c.type === type);

    // Update selected category when type changes
    React.useEffect(() => {
        const firstCat = categories.find(c => c.type === type);
        if (firstCat) {
            setSelectedCategoryId(firstCat.id);
        }
    }, [type, categories]);

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

    const handleMagicPaste = async () => {
        const text = await Clipboard.getStringAsync();
        if (text) {
            const result = parseMessage(text);
            if (result) {
                setAmount(result.amount.toString());
                setType(result.type);
                const matchedCat = categories.find(
                    (c: Category) => c.name.toLowerCase() === result.category.toLowerCase()
                );
                if (matchedCat) {
                    setSelectedCategoryId(matchedCat.id);
                }
                setNote(text.substring(0, 50));
            }
        }
    };

    const handleSave = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        addTransaction({
            amount: numAmount,
            type,
            categoryId: selectedCategoryId,
            accountId: selectedAccountId,
            note,
        });
        router.back();
    };

    const numpadKeys = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['.', '0', '⌫']
    ];

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
                    <Typography variant="h3">Add Transaction</Typography>
                    <TouchableOpacity onPress={handleMagicPaste} style={styles.magicButton}>
                        <Sparkles size={20} color="#A855F7" />
                    </TouchableOpacity>
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
                    </View>

                    {/* Category Selection */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>Category</Typography>
                        {filteredCategories.length === 0 ? (
                            <Card variant="flat" style={styles.emptyCategories}>
                                <Typography variant="body" align="center" color={theme.colors.textMuted}>
                                    No categories available
                                </Typography>
                                <Typography variant="caption" align="center" style={{ marginTop: 4 }}>
                                    Add categories in Settings → Data
                                </Typography>
                            </Card>
                        ) : (
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
                        )}
                    </View>

                    {/* Account Selection */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>Account</Typography>
                        {accounts.length === 0 ? (
                            <Card variant="flat" style={styles.emptyCategories}>
                                <Typography variant="body" align="center" color={theme.colors.textMuted}>
                                    No accounts available
                                </Typography>
                            </Card>
                        ) : (
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
                        )}
                    </View>

                    {/* Note */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>Note (Optional)</Typography>
                        <TextInput
                            style={styles.noteInput}
                            placeholder="Add a note..."
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
                            colors={type === 'expense' ? ['#EF4444', '#DC2626'] : ['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButtonGradient}
                        >
                            <Typography variant="body" style={styles.saveButtonText}>
                                Save {type === 'expense' ? 'Expense' : 'Income'}
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
    magicButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 100,
    },

    // Amount
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

    // Type Toggle
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

    // Sections
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
    emptyCategories: {
        padding: theme.spacing.lg,
    },

    // Note
    noteInput: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },

    // Numpad
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

    // Footer
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
