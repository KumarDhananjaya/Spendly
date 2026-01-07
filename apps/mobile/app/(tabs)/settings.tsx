import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { Card, Typography, Button } from '@splendly/ui';

export default function SettingsScreen() {
    const { clearAuth, userId } = useFinanceStore();

    return (
        <View style={styles.container}>
            <Card>
                <Typography variant="h2">Account</Typography>
                <Typography variant="body" style={styles.email}>
                    Logged in as: {userId || 'Guest'}
                </Typography>
                <Button title="Logout" onPress={() => clearAuth()} style={styles.logoutBtn} />
            </Card>

            <Card style={styles.aboutCard}>
                <Typography variant="h2">About Splendly</Typography>
                <Typography variant="body" style={styles.description}>
                    Splendly is an offline-first personal finance app designed for speed and security.
                </Typography>
                <Typography variant="caption" style={styles.version}>
                    Version 1.0.0
                </Typography>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    email: {
        marginTop: 8,
        color: '#666',
    },
    logoutBtn: {
        marginTop: 16,
        backgroundColor: '#D32F2F',
    },
    aboutCard: {
        marginTop: 16,
    },
    description: {
        marginTop: 8,
        lineHeight: 22,
    },
    version: {
        marginTop: 16,
    }
});
