import React from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { Button, Typography, Card } from '@splendly/ui';
import { useRouter, Stack } from 'expo-router';

export default function AddExpenseScreen() {
    const [amount, setAmount] = React.useState('');
    const [note, setNote] = React.useState('');
    const [categoryId, setCategoryId] = React.useState('default-cat-id'); // Placeholder
    const { addExpense } = useFinanceStore();
    const router = useRouter();

    const handleSave = () => {
        if (!amount || isNaN(Number(amount))) return;

        addExpense({
            amount: Number(amount),
            note,
            categoryId,
            source: 'MANUAL',
            spentAt: Date.now(),
        });

        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ title: 'Add Expense' }} />
            <Card>
                <Typography variant="caption">Amount</Typography>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    autoFocus
                />

                <Typography variant="caption" style={styles.label}>Note</Typography>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="What was this for?"
                    value={note}
                    onChangeText={setNote}
                    multiline
                />

                <Button title="Save Expense" onPress={handleSave} style={styles.saveBtn} />
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    label: {
        marginTop: 16,
    },
    input: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingVertical: 8,
        marginBottom: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveBtn: {
        marginTop: 24,
    },
});
