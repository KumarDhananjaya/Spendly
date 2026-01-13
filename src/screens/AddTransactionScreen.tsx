import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
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
import { Button } from '../components/Button';
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
                        <Sparkles size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Amount Display */}
                    <View style={styles.amountContainer}>
                        <Typography variant="label">Amount</Typography>
                        <View style={styles.amountRow}>
                            <Typography variant="h1" color={theme.colors.textMuted}>{currency}</Typography>
                            <Typography variant="h1" style={styles.amountText}>{amount}</Typography>
                        </View>
                    </View>

                    {/* Type Toggle */}
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'expense' && styles.expenseActive]}
                            onPress={() => setType('expense')}
                        >
                            <Typography
                                variant="body"
                                color={type === 'expense' ? '#FFF' : theme.colors.textSecondary}
                                style={{ fontWeight: '600' }}
                            >
                                Expense
                            </Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'earning' && styles.incomeActive]}
                            onPress={() => setType('earning')}
                        >
                            <Typography
                                variant="body"
                                color={type === 'earning' ? '#FFF' : theme.colors.textSecondary}
                                style={{ fontWeight: '600' }}
                            >
                                Income
                            </Typography>
                        </TouchableOpacity>
                    </View>

                    {/* Category Selection */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>Category</Typography>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.pillsRow}>
                                {filteredCategories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryPill,
                                            selectedCategoryId === cat.id && { backgroundColor: cat.color }
                                        ]}
                                        onPress={() => setSelectedCategoryId(cat.id)}
                                    >
                                        <Typography
                                            variant="body"
                                            color={selectedCategoryId === cat.id ? '#FFF' : theme.colors.text}
                                            style={{ fontWeight: '500' }}
                                        >
                                            {cat.name}
                                        </Typography>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Account Selection */}
                    <View style={styles.section}>
                        <Typography variant="label" style={styles.sectionLabel}>Account</Typography>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.pillsRow}>
                                {accounts.map((acc) => (
                                    <TouchableOpacity
                                        key={acc.id}
                                        style={[
                                            styles.accountPill,
                                            selectedAccountId === acc.id && styles.accountPillActive
                                        ]}
                                        onPress={() => setSelectedAccountId(acc.id)}
                                    >
                                        <View style={[styles.accountDot, { backgroundColor: acc.color }]} />
                                        <Typography
                                            variant="body"
                                            color={selectedAccountId === acc.id ? theme.colors.primary : theme.colors.text}
                                            style={{ fontWeight: '500' }}
                                        >
                                            {acc.name}
                                        </Typography>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
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
                        {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['.', '0', '⌫']].map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.numpadRow}>
                                {row.map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={styles.numpadButton}
                                        onPress={() => num === '⌫' ? handleBackspace() : handleNumberPress(num)}
                                    >
                                        <Typography variant="h2" color={theme.colors.text}>{num}</Typography>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </Card>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <Button
                        title="Save Transaction"
                        onPress={handleSave}
                        fullWidth
                        size="lg"
                    />
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
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    magicButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.glass,
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
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginTop: theme.spacing.sm,
    },
    amountText: {
        fontSize: 56,
        lineHeight: 64,
    },

    // Type Toggle
    typeContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: 4,
        marginBottom: theme.spacing.xl,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
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
        gap: 8,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    accountPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    accountPillActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.glass,
    },
    accountDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    // Note
    noteInput: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: theme.spacing.md,
        fontSize: 16,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    // Numpad
    numpad: {
        padding: theme.spacing.sm,
    },
    numpadRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    numpadButton: {
        width: 72,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Footer
    footer: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
});
