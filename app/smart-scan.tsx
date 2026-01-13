import { useRouter } from 'expo-router';
import { ArrowLeft, Check, FileText } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Typography } from '../src/components/Typography';
import { theme } from '../src/constants/theme';
import { Category, TransactionType, useFinanceStore } from '../src/store/useFinanceStore';
import { parseBulkMessages } from '../src/utils/parser';

interface DetectedTx {
    amount: number;
    type: TransactionType;
    category: string;
    raw: string;
    selected: boolean;
    categoryId: string;
    accountId: string;
}

export default function SmartScanScreen() {
    const router = useRouter();
    const [inputText, setInputText] = React.useState('');
    const { addTransaction, categories, accounts } = useFinanceStore();
    const [detectedTxs, setDetectedTxs] = React.useState<DetectedTx[]>([]);

    const handleParse = () => {
        const results = parseBulkMessages(inputText);
        setDetectedTxs(results.map((r: any) => ({
            ...r,
            selected: true,
            accountId: accounts[0]?.id || '',
            categoryId: categories.find((c: Category) => c.name.toLowerCase() === r.category.toLowerCase())?.id || categories[0]?.id
        })));
    };

    const handleImport = () => {
        detectedTxs.filter((t: DetectedTx) => t.selected).forEach((tx: DetectedTx) => {
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
        const newTxs: DetectedTx[] = [...detectedTxs];
        newTxs[index].selected = !newTxs[index].selected;
        setDetectedTxs(newTxs);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h3">Smart Scan</Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Card variant="flat" style={styles.infoCard}>
                    <FileText size={24} color={theme.colors.primary} />
                    <Typography variant="body" style={{ marginTop: 12, textAlign: 'center' }}>
                        Paste your bank SMS messages below to automatically detect and import transactions
                    </Typography>
                </Card>

                <Typography variant="label" style={styles.label}>SMS Messages</Typography>
                <Card style={styles.inputCard}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Paste SMS messages here...

Example:
HDFC Bank: Rs 500.00 debited from a/c x1234 for Amazon
SBI: Rs 1000.00 credited to your a/c x5678"
                        placeholderTextColor={theme.colors.textMuted}
                        multiline
                        value={inputText}
                        onChangeText={setInputText}
                        textAlignVertical="top"
                    />
                </Card>

                <Button
                    title="Scan Messages"
                    onPress={handleParse}
                    variant="outline"
                    fullWidth
                    style={{ marginBottom: theme.spacing.xl }}
                />

                {detectedTxs.length > 0 && (
                    <View style={styles.resultsSection}>
                        <Typography variant="h3" style={styles.resultsTitle}>
                            Found {detectedTxs.length} Transaction{detectedTxs.length > 1 ? 's' : ''}
                        </Typography>

                        <Card>
                            {detectedTxs.map((tx: DetectedTx, index: number) => {
                                const isLast = index === detectedTxs.length - 1;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.resultItem, !isLast && styles.resultBorder]}
                                        onPress={() => toggleSelection(index)}
                                    >
                                        <View style={[styles.checkbox, tx.selected && styles.checkboxActive]}>
                                            {tx.selected && <Check size={14} color="#FFF" />}
                                        </View>
                                        <View style={styles.resultInfo}>
                                            <Typography variant="body" style={{ fontWeight: '500' }}>{tx.category}</Typography>
                                            <Typography variant="caption" numberOfLines={1}>{tx.raw}</Typography>
                                        </View>
                                        <Typography
                                            variant="h3"
                                            color={tx.type === 'earning' ? theme.colors.secondary : theme.colors.error}
                                        >
                                            {tx.type === 'earning' ? '+' : '-'}{tx.amount}
                                        </Typography>
                                    </TouchableOpacity>
                                );
                            })}
                        </Card>

                        <Button
                            title={`Import ${detectedTxs.filter((t: DetectedTx) => t.selected).length} Transaction${detectedTxs.filter((t: DetectedTx) => t.selected).length !== 1 ? 's' : ''}`}
                            onPress={handleImport}
                            fullWidth
                            size="lg"
                            style={{ marginTop: theme.spacing.lg }}
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
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    infoCard: {
        alignItems: 'center',
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    label: {
        marginBottom: theme.spacing.sm,
    },
    inputCard: {
        height: 180,
        marginBottom: theme.spacing.md,
        padding: 0,
    },
    textInput: {
        flex: 1,
        padding: theme.spacing.md,
        fontSize: 15,
        color: theme.colors.text,
        lineHeight: 22,
    },
    resultsSection: {
        marginTop: theme.spacing.md,
    },
    resultsTitle: {
        marginBottom: theme.spacing.md,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        gap: 12,
    },
    resultBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    resultInfo: {
        flex: 1,
    },
});
