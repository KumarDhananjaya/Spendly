import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'spendly_user_pin';
const IS_BIOMETRIC_ENABLED_KEY = 'spendly_biometric_enabled';

export const savePin = async (pin: string) => {
    try {
        await SecureStore.setItemAsync(PIN_KEY, pin);
        return true;
    } catch (error) {
        console.error('Error saving PIN', error);
        return false;
    }
};

export const getPin = async () => {
    try {
        return await SecureStore.getItemAsync(PIN_KEY);
    } catch (error) {
        console.error('Error getting PIN', error);
        return null;
    }
};

export const removePin = async () => {
    try {
        await SecureStore.deleteItemAsync(PIN_KEY);
        return true;
    } catch (error) {
        console.error('Error removing PIN', error);
        return false;
    }
};

export const setBiometricEnabled = async (enabled: boolean) => {
    try {
        await SecureStore.setItemAsync(IS_BIOMETRIC_ENABLED_KEY, JSON.stringify(enabled));
        return true;
    } catch (error) {
        console.error('Error setting biometric pref', error);
        return false;
    }
};

export const isBiometricEnabled = async () => {
    try {
        const val = await SecureStore.getItemAsync(IS_BIOMETRIC_ENABLED_KEY);
        return val === 'true';
    } catch (error) {
        return false;
    }
};

export const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return { hasHardware, isEnrolled };
};

export const authenticateBiometric = async () => {
    try {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Unlock Spendly',
            fallbackLabel: 'Use PIN',
            cancelLabel: 'Cancel',
            disableDeviceFallback: false,
        });
        return result.success;
    } catch (error) {
        console.error('Biometric auth error', error);
        return false;
    }
};
