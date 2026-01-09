import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { Card, Typography, Button } from '@splendly/ui';
import { useRouter, Stack } from 'expo-router';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddExpenseScreen() {
    const [amount, setAmount] = React.useState('');
    const [note, setNote] = React.useState('');
    const { addExpense } = useFinanceStore();
    const router = useRouter();

    const handleNumberPress = (num: string) => {
        if (num === '.' && amount.includes('.')) return;
        setAmount(prev => prev + num);
    };

    const handleDelete = () => {
        setAmount(prev => prev.slice(0, -1));
    };

    const handleSave = () => {
        if (!amount || isNaN(Number(amount))) return;

        addExpense({
            amount: Number(amount),
            note,
            categoryId: 'default-cat-id',
            source: 'MANUAL',
            spentAt: Date.now(),
        });

        router.back();
    };

    const NumpadButton = ({ value, icon }: { value?: string, icon?: string }) => (
        <TouchableOpacity
            style={styles.numpadBtn}
            onPress={() => value ? handleNumberPress(value) : handleDelete()}
        >
            {icon ? (
                <IconSymbol name={icon} size={24} color="#FFF" />
            ) : (
                <Typography variant="h2" style={styles.numpadText}>{value}</Typography>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: 'Add Expense',
                headerStyle: { backgroundColor: Colors.dark.background },
                headerTintColor: '#FFF',
                headerTransparent: true,
            }} />

            <View style={styles.amountContainer}>
                <Typography variant="caption" style={styles.label}>AMOUNT</Typography>
                <View style={styles.amountRow}>
                    <Typography variant="h1" style={styles.currency}>$</Typography>
                    <Typography variant="h1" style={styles.amountText}>{amount || '0.00'}</Typography>
                </View>

                <TextInput
                    style={styles.noteInput}
                    placeholder="What was this for?"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={note}
                    onChangeText={setNote}
                />
            </View>

            <Card glass style={styles.numpadCard}>
                <View style={styles.numpadGrid}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((num) => (
                        <NumpadButton key={num} value={num} />
                    ))}
                    <NumpadButton icon="delete.left.fill" />
                </View>

                <Button
                    title="CONFIRM"
                    onPress={handleSave}
                    style={styles.confirmBtn}
                    gradient={Colors.dark.gradient}
                    disabled={!amount}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: 100,
    },
    amountContainer: {
        padding: 30,
        alignItems: 'center',
        flex: 1,
    },
    label: {
        color: Colors.dark.neon,
        letterSpacing: 2,
        marginBottom: 20,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    currency: {
        fontSize: 32,
        marginTop: 10,
        marginRight: 5,
        color: 'rgba(255,255,255,0.5)',
    },
    amountText: {
        fontSize: 64,
        fontWeight: '800',
        color: '#FFF',
    },
    noteInput: {
        width: '100%',
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    numpadCard: {
        margin: 20,
        padding: 20,
        borderRadius: Radius.xl,
        paddingBottom: 30,
    },
    numpadGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    numpadBtn: {
        width: '30%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    numpadText: {
        fontSize: 28,
        color: '#FFF',
    },
    confirmBtn: {
        marginTop: 10,
        height: 60,
    },
});
