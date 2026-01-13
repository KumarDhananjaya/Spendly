import { Delete, Fingerprint } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../components/Typography';
import { theme } from '../constants/theme';
import { authenticateBiometric, checkBiometricSupport, getPin } from '../utils/security';

interface AuthScreenProps {
    onUnlock: () => void;
}

export default function AuthScreen({ onUnlock }: AuthScreenProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [biometricAvailable, setBiometricAvailable] = useState(false);

    useEffect(() => {
        checkBiometrics();
    }, []);

    const checkBiometrics = async () => {
        const { hasHardware, isEnrolled } = await checkBiometricSupport();
        if (hasHardware && isEnrolled) {
            setBiometricAvailable(true);
            handleBiometricAuth();
        }
    };

    const handleBiometricAuth = async () => {
        const success = await authenticateBiometric();
        if (success) {
            onUnlock();
        }
    };

    const handleNumberPress = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                validatePin(newPin);
            }
        }
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
        setError('');
    };

    const validatePin = async (inputPin: string) => {
        const storedPin = await getPin();
        if (storedPin === inputPin) {
            onUnlock();
        } else {
            setError('Incorrect PIN');
            setPin('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Typography variant="h1" style={styles.title}>Enter PIN</Typography>
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2, 3].map((i) => (
                            <View
                                key={i}
                                style={[
                                    styles.pinDot,
                                    i < pin.length && styles.pinDotFilled,
                                    !!error && styles.pinDotError
                                ]}
                            />
                        ))}
                    </View>
                    {!!error && (
                        <Typography variant="caption" color={theme.colors.error} style={styles.error}>
                            {error}
                        </Typography>
                    )}
                </View>

                <View style={styles.numpad}>
                    {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']].map((row, i) => (
                        <View key={i} style={styles.row}>
                            {row.map((num) => (
                                <TouchableOpacity
                                    key={num}
                                    style={styles.key}
                                    onPress={() => handleNumberPress(num)}
                                >
                                    <Typography variant="h2">{num}</Typography>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.key}
                            onPress={biometricAvailable ? handleBiometricAuth : undefined}
                        >
                            {biometricAvailable && <Fingerprint size={28} color={theme.colors.primary} />}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.key}
                            onPress={() => handleNumberPress('0')}
                        >
                            <Typography variant="h2">0</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.key}
                            onPress={handleBackspace}
                        >
                            <Delete size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>
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
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 64,
    },
    title: {
        marginBottom: 32,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    pinDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.textSecondary,
    },
    pinDotFilled: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    pinDotError: {
        borderColor: theme.colors.error,
        backgroundColor: theme.colors.error,
    },
    error: {
        marginTop: 16,
    },
    numpad: {
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    key: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.sm,
    },
});
