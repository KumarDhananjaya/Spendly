import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, Download, FileJson, FileSpreadsheet, RefreshCw, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';
import { exportToCSV, exportToJSON, importFromJSON } from '../../src/utils/dataHandler';

export default function DataSettings() {
    const router = useRouter();
    const { restoreData } = useFinanceStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleBackup = async () => {
        setIsLoading(true);
        const success = await exportToJSON();
        setIsLoading(false);
        if (!success) Alert.alert('Error', 'Failed to create backup');
    };

    const handleExportCSV = async () => {
        setIsLoading(true);
        const success = await exportToCSV();
        setIsLoading(false);
        if (!success) Alert.alert('Error', 'Failed to export CSV');
    };

    const handleRestore = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            const content = await FileSystem.readAsStringAsync(file.uri);

            Alert.alert(
                'Confirm Restore',
                'This will replace ALL your current data with the backup. This action cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Restore',
                        style: 'destructive',
                        onPress: async () => {
                            setIsLoading(true);
                            const success = await importFromJSON(content);
                            setIsLoading(false);
                            if (success) {
                                Alert.alert('Success', 'Data restored successfully');
                            } else {
                                Alert.alert('Error', 'Failed to restore data. Invalid file format.');
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to read file');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h3">Data Management</Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Typography variant="label" style={styles.sectionTitle}>Backup & Export</Typography>

                <Card style={styles.card}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleBackup} disabled={isLoading}>
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '20' }]}>
                            <FileJson size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.actionText}>
                            <Typography variant="body" style={styles.actionTitle}>Backup Data (JSON)</Typography>
                            <Typography variant="caption">Save a full backup of your data</Typography>
                        </View>
                        <Download size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.actionItem} onPress={handleExportCSV} disabled={isLoading}>
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.secondary + '20' }]}>
                            <FileSpreadsheet size={24} color={theme.colors.secondary} />
                        </View>
                        <View style={styles.actionText}>
                            <Typography variant="body" style={styles.actionTitle}>Export Transactions (CSV)</Typography>
                            <Typography variant="caption">Open in Excel or Google Sheets</Typography>
                        </View>
                        <Download size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </Card>

                <Typography variant="label" style={styles.sectionTitle}>Restore</Typography>

                <Card style={styles.card}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleRestore} disabled={isLoading}>
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.warning + '20' }]}>
                            <RefreshCw size={24} color={theme.colors.warning} />
                        </View>
                        <View style={styles.actionText}>
                            <Typography variant="body" style={styles.actionTitle}>Restore from Backup</Typography>
                            <Typography variant="caption">Import a .json backup file</Typography>
                        </View>
                        <ChevronRight size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </Card>

                <Typography variant="label" style={styles.sectionTitle}>Danger Zone</Typography>

                <Card style={styles.card}>
                    <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => {
                            Alert.alert('Erase All Data', 'Are you sure? This cannot be undone.', [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Erase', style: 'destructive', onPress: () => {
                                        restoreData({ transactions: [], accounts: [], categories: [], budgets: [] });
                                        Alert.alert('Erased', 'All data has been cleared.');
                                    }
                                }
                            ]);
                        }}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.error + '20' }]}>
                            <Trash2 size={24} color={theme.colors.error} />
                        </View>
                        <View style={styles.actionText}>
                            <Typography variant="body" style={[styles.actionTitle, { color: theme.colors.error }]}>Erase All Data</Typography>
                            <Typography variant="caption">Permanently delete everything</Typography>
                        </View>
                    </TouchableOpacity>
                </Card>

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
    content: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        marginBottom: theme.spacing.sm,
        marginLeft: 4,
        marginTop: theme.spacing.md,
    },
    card: {
        padding: 0,
        overflow: 'hidden',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionText: {
        flex: 1,
    },
    actionTitle: {
        fontWeight: '600',
        marginBottom: 2,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginLeft: 76,
    },
});
