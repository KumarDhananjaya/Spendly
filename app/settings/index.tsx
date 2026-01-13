import { useRouter } from 'expo-router';
import { ChevronRight, Database, Lock } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/Card';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';
import { useFinanceStore } from '../../src/store/useFinanceStore';

export default function SettingsScreen() {
    const router = useRouter();
    const { currency, setCurrency } = useFinanceStore();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h2">Settings</Typography>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Typography variant="label" style={styles.sectionTitle}>Security</Typography>
                <Card style={styles.card}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/security-settings')}
                    >
                        <View style={styles.menuIconInfo}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Lock size={20} color={theme.colors.primary} />
                            </View>
                            <Typography variant="body">App Lock & Privacy</Typography>
                        </View>
                        <ChevronRight size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </Card>

                <Typography variant="label" style={styles.sectionTitle}>Data Management</Typography>
                <Card style={styles.card}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => router.push('/settings/data')}
                    >
                        <View style={styles.menuIconInfo}>
                            <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary + '20' }]}>
                                <Database size={20} color={theme.colors.secondary} />
                            </View>
                            <View>
                                <Typography variant="body">Backup & Restore</Typography>
                                <Typography variant="caption">Export CSV, JSON Backup</Typography>
                            </View>
                        </View>
                        <ChevronRight size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </Card>

                <View style={styles.footer}>
                    <Typography variant="caption" align="center" color={theme.colors.textMuted}>
                        Spendly v1.0.0
                    </Typography>
                </View>

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
        padding: theme.spacing.lg,
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
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
    },
    menuIconInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        marginTop: 40,
    },
});
