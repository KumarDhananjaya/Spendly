import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Sparkles, X } from 'lucide-react-native';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { TransactionType, useFinanceStore } from '../store/useFinanceStore';
import { parseMessage } from '../utils/parser';

// Removed hardcoded CATEGORIES

export default function AddTransactionScreen() {
    const { addTransaction, currency, accounts, categories } = useFinanceStore();
    const [amount, setAmount] = React.useState('0');
    const [type, setType] = React.useState<TransactionType>('expense');
    const [selectedCategoryId, setSelectedCategoryId] = React.useState(categories[0]?.id || '');
    const [selectedAccountId, setSelectedAccountId] = React.useState(accounts[0]?.id || '');
    const [note, setNote] = React.useState('');
    const router = useRouter();

    const handleNumberPress = (num: string) => {
        if (amount === '0' && num !== '.') {
            setAmount(num);
        } else {
            if (num === '.' && amount.includes('.')) return;
            setAmount(amount + num);
        }
    };

    const handleDelete = () => {
        if (amount.length > 1) {
            setAmount(amount.slice(0, -1));
        } else {
            setAmount('0');
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

    const handleMagicPaste = async () => {
        const text = await Clipboard.getStringAsync();
        if (!text) return;

        const result = parseMessage(text);
        if (result) {
            setAmount(result.amount.toString());
            setType(result.type);

            // Try to find matching category by name
            const matchedCat = categories.find(c =>
                c.name.toLowerCase() === result.category.toLowerCase()
            );
            if (matchedCat) {
                setSelectedCategoryId(matchedCat.id);
            }
            setNote(text); // Keep original text in notes
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <X size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Typography variant="h2">Add Transaction</Typography>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.amountContainer}>
                        <TouchableOpacity style={styles.magicButton} onPress={handleMagicPaste}>
                            <Sparkles size={16} color={theme.colors.primary} />
                            <Typography variant="caption" color={theme.colors.primary}>Magic Paste</Typography>
                        </TouchableOpacity>
                        <Typography variant="caption" style={{ marginTop: 8 }}>Amount</Typography>
                        <Typography variant="h1" style={styles.amountText}>
                            {currency}{amount}
                        </Typography>
                    </View>

                    <View style={styles.typeSwitcher}>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'expense' && styles.activeExpense]}
                            onPress={() => setType('expense')}
                        >
                            <Typography variant="body" color={type === 'expense' ? '#FFF' : theme.colors.textSecondary}>
                                Expense
                            </Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, type === 'earning' && styles.activeEarning]}
                            onPress={() => setType('earning')}
                        >
                            <Typography variant="body" color={type === 'earning' ? '#FFF' : theme.colors.textSecondary}>
                                Earning
                            </Typography>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Typography variant="caption" style={styles.sectionTitle}>Account</Typography>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                            {accounts.map((acc) => (
                                <TouchableOpacity
                                    key={acc.id}
                                    style={[
                                        styles.pill,
                                        selectedAccountId === acc.id && { backgroundColor: acc.color }
                                    ]}
                                    onPress={() => setSelectedAccountId(acc.id)}
                                >
                                    <Typography variant="body" color={selectedAccountId === acc.id ? '#FFF' : theme.colors.textSecondary}>
                                        {acc.name}
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.section}>
                        <Typography variant="caption" style={styles.sectionTitle}>Category</Typography>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                            {categories.filter(c => c.type === type).map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.pill,
                                        selectedCategoryId === cat.id && { backgroundColor: cat.color }
                                    ]}
                                    onPress={() => setSelectedCategoryId(cat.id)}
                                >
                                    <Typography variant="body" color={selectedCategoryId === cat.id ? '#FFF' : theme.colors.textSecondary}>
                                        {cat.name}
                                    </Typography>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.section}>
                        <Typography variant="caption" style={styles.sectionTitle}>Notes</Typography>
                        <Card style={styles.noteCard}>
                            <TextInput
                                style={styles.noteInput}
                                placeholder="What for?"
                                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                value={note}
                                onChangeText={setNote}
                            />
                        </Card>
                    </View>

                    <View style={styles.numpad}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map((val) => (
                            <TouchableOpacity
                                key={val}
                                style={styles.numpadButton}
                                onPress={() => val === 'DEL' ? handleDelete() : handleNumberPress(val.toString())}
                            >
                                <Typography variant="h2">{val}</Typography>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button
                        title="Save Transaction"
                        onPress={handleSave}
                        style={styles.saveButton}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
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
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    amountContainer: {
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
    },
    magicButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(187, 134, 252, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(187, 134, 252, 0.2)',
    },
    amountText: {
        fontSize: 48,
        marginTop: 4,
    },
    typeSwitcher: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness,
        padding: 4,
        marginBottom: theme.spacing.xl,
    },
    typeButton: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.roundness - 4,
    },
    activeExpense: {
        backgroundColor: theme.colors.error,
    },
    activeEarning: {
        backgroundColor: theme.colors.secondary,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        marginBottom: theme.spacing.sm,
    },
    horizontalScroll: {
        flexDirection: 'row',
        marginHorizontal: -theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
    },
    pill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        marginRight: theme.spacing.sm,
    },
    noteCard: {
        padding: theme.spacing.sm,
    },
    noteInput: {
        color: '#FFF',
        fontSize: 16,
        padding: 8,
    },
    numpad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    numpadButton: {
        width: '30%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    saveButton: {
        marginBottom: 40,
    }
});
