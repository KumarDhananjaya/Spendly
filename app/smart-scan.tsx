import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { parseBulkMessages } from '../../src/utils/parser';

export default function SmartScanScreen() {
    const router = useRouter();
    const [inputText, setInputText] = React.useState('');
    const { addTransaction, categories, accounts } = useFinanceStore();
    const [detectedTxs, setDetectedTxs] = React.useState<any[]>([]);

    const handleParse = () => {
        const results = parseBulkMessages(inputText);
        setDetectedTxs(results.map(r => ({
            ...r,
            selected: true,
            accountId: accounts[0]?.id || '',
            // Map parsed category to store category ID
            categoryId: categories.find(c => c.name.toLowerCase() === r.category.toLowerCase())?.id || categories[0]?.id
        })));
    };

    const handleImport = () => {
        detectedTxs.filter(t => t.selected).forEach(tx => {
            addTransaction({
                amount: tx.amount,
                type: tx.type,
                categoryId: tx.categoryId,
                accountId: tx.accountId,
                note: tx.raw.substring(0, 50) + '...',
            });
        });
        router.back();
    };

    const toggleSelection = (index: number) => {
        const newTxs = [...detectedTxs];
        newTxs[index].selected = !newTxs[index].selected;
        setDetectedTxs(newTxs);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h2">Smart Scan</Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Typography variant="caption" style={styles.instruction}>
                    Paste your transaction SMS messages here to bulk import them.
                </Typography>

                <Card style={styles.inputCard}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Paste SMS text here..."
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        multiline
                        value={inputText}
                        onChangeText={setInputText}
                    />
                </Card>

                <Button
                    title="Scan Messages"
                    onPress={handleParse}
                    variant="glass"
                    style={styles.scanButton}
                />

                {detectedTxs.length > 0 && (
                    <View style={styles.resultsSection}>
                        <Typography variant="h3" style={styles.resultsTitle}>
                            Detected Transactions ({detectedTxs.length})
                        </Typography>
                        {detectedTxs.map((tx, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.resultCard, !tx.selected && styles.dimmed]}
                                onPress={() => toggleSelection(index)}
                            >
                                <View style={styles.resultLeft}>
                                    <View style={[styles.checkCircle, tx.selected && styles.checked]}>
                                        {tx.selected && <Check size={12} color="#FFF" />}
                                    </View>
                                    <View>
                                        <Typography variant="body">{tx.category}</Typography>
                                        <Typography variant="caption" style={styles.rawText} numberOfLines={1}>
                                            {tx.raw}
                                        </Typography>
                                    </View>
                                </View>
                                <Typography
                                    variant="h3"
                                    color={tx.type === 'earning' ? theme.colors.secondary : theme.colors.error}
                                >
                                    {tx.type === 'earning' ? '+' : '-'}{tx.amount}
                                </Typography>
                            </TouchableOpacity>
                        ))}

                        <Button
                            title={`Import ${detectedTxs.filter(t => t.selected).length} Transactions`}
                            onPress={handleImport}
                            style={styles.importButton}
                        />
                    </View>
                )}
            </ScrollView>
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
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    instruction: {
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    inputCard: {
        padding: theme.spacing.md,
        height: 200,
        marginBottom: theme.spacing.md,
    },
    textInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
        textAlignVertical: 'top',
    },
    scanButton: {
        marginBottom: theme.spacing.xl,
    },
    resultsSection: {
        marginTop: theme.spacing.md,
    },
    resultsTitle: {
        marginBottom: theme.spacing.md,
    },
    resultCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    resultLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    dimmed: {
        opacity: 0.5,
    },
    rawText: {
        fontSize: 10,
        opacity: 0.5,
    },
    importButton: {
        marginTop: theme.spacing.xl,
    }
});
