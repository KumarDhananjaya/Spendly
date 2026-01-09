import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFinanceStore } from '@/store/memoryStore';
import { Card, Typography, Button } from '@splendly/ui';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SettingsScreen() {
    const { clearAuth, userId, lastSyncAt } = useFinanceStore();

    const SettingsOption = ({ icon, label, sublabel, onPress, color }: any) => (
        <TouchableOpacity style={styles.optionRow} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: color || 'rgba(255,255,255,0.05)' }]}>
                <IconSymbol name={icon} size={20} color={color ? '#FFF' : Colors.dark.text} />
            </View>
            <View style={styles.optionDetails}>
                <Typography variant="body">{label}</Typography>
                {sublabel && <Typography variant="caption" style={styles.sublabel}>{sublabel}</Typography>}
            </View>
            <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Card glass style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Typography variant="h1" style={styles.avatarText}>
                        {userId?.charAt(0).toUpperCase() || 'G'}
                    </Typography>
                </View>
                <Typography variant="h2" style={styles.userName}>
                    {userId?.split('@')[0] || 'Guest'}
                </Typography>
                <Typography variant="caption" style={styles.userEmail}>{userId || 'guest@splendly.app'}</Typography>
            </Card>

            <Typography variant="h2" style={styles.sectionTitle}>Sync Settings</Typography>
            <Card glass>
                <SettingsOption
                    icon="arrow.triangle.2.circlepath"
                    label="Last Sync"
                    sublabel={lastSyncAt ? new Date(lastSyncAt).toLocaleString() : 'Never'}
                    color={Colors.dark.neon}
                />
                <SettingsOption icon="cloud.fill" label="Cloud Storage" sublabel="Standardized (10MB used)" />
            </Card>

            <Typography variant="h2" style={styles.sectionTitle}>General</Typography>
            <Card glass>
                <SettingsOption icon="bell.fill" label="Notifications" />
                <SettingsOption icon="lock.fill" label="Privacy & Security" />
                <SettingsOption icon="info.circle.fill" label="About Splendly" sublabel="Version 1.0.0" />
            </Card>

            <Button
                title="LOGOUT"
                onPress={() => clearAuth()}
                style={styles.logoutBtn}
            />

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: 20,
    },
    profileCard: {
        alignItems: 'center',
        padding: 30,
        marginTop: 20,
        marginBottom: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.dark.tint,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 32,
    },
    userName: {
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.5)',
    },
    sectionTitle: {
        marginBottom: 15,
        fontSize: 18,
        opacity: 0.8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    optionDetails: {
        flex: 1,
    },
    sublabel: {
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    logoutBtn: {
        marginTop: 20,
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(211, 47, 47, 0.3)',
    },
});
