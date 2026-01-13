import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Typography } from '../src/components/Typography';
import { theme } from '../src/constants/theme';
import { useFinanceStore } from '../src/store/useFinanceStore';
import { savePin } from '../src/utils/security';

export default function SecuritySettings() {
    const router = useRouter();
    const { isAppLockEnabled, setAppLockEnabled } = useFinanceStore();
    const [isSettingPin, setIsSettingPin] = useState(false);
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handleToggleLock = (value: boolean) => {
        if (value) {
            setIsSettingPin(true);
        } else {
            setAppLockEnabled(false);
        }
    };

    const handleSavePin = async () => {
        if (newPin.length !== 4) {
            Alert.alert('Error', 'PIN must be 4 digits');
            return;
        }
        if (newPin !== confirmPin) {
            Alert.alert('Error', 'PINs do not match');
            return;
        }

        const success = await savePin(newPin);
        if (success) {
            setAppLockEnabled(true);
            setIsSettingPin(false);
            Alert.alert('Success', 'App Lock Enabled');
        } else {
            Alert.alert('Error', 'Failed to save PIN');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h3">Security</Typography>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Card style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View style={styles.iconContainer}>
                                <Lock size={20} color={theme.colors.primary} />
                            </View>
                            <View>
                                <Typography variant="body" style={styles.label}>App Lock</Typography>
                                <Typography variant="caption">Require PIN/FaceID to open app</Typography>
                            </View>
                        </View>
                        <Switch
                            value={isAppLockEnabled}
                            onValueChange={handleToggleLock}
                            trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                            thumbColor="#FFF"
                        />
                    </View>
                </Card>

                {isSettingPin && (
                    <Card style={styles.pinCard}>
                        <Typography variant="h3" style={styles.pinTitle}>Set 4-Digit PIN</Typography>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter PIN"
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                            value={newPin}
                            onChangeText={setNewPin}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Confirm PIN"
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                            value={confirmPin}
                            onChangeText={setConfirmPin}
                        />

                        <View style={styles.buttons}>
                            <Button
                                title="Cancel"
                                variant="ghost"
                                onPress={() => setIsSettingPin(false)}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Save"
                                onPress={handleSavePin}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </Card>
                )}

                <View style={styles.info}>
                    <Shield size={16} color={theme.colors.textMuted} />
                    <Typography variant="caption" style={{ flex: 1 }}>
                        Your PIN is stored securely on your device using hardware-backed encryption.
                    </Typography>
                </View>
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
    card: {
        marginBottom: theme.spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.surfaceVariant,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontWeight: '500',
    },
    pinCard: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.lg,
    },
    pinTitle: {
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    input: {
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 12,
        padding: theme.spacing.md,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: theme.spacing.sm,
    },
    info: {
        flexDirection: 'row',
        gap: 8,
        marginTop: theme.spacing.xl,
        paddingHorizontal: theme.spacing.sm,
        opacity: 0.7,
    },
});
