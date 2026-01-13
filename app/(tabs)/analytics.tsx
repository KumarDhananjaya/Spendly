import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../src/components/Typography';
import { theme } from '../../src/constants/theme';

export default function AnalyticsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h1">Analytics</Typography>
            </View>
            <View style={styles.content}>
                <Typography variant="body">Charts and insights coming soon!</Typography>
            </View>
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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
