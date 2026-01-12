import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { theme } from '../constants/theme';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'glass';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled
}: ButtonProps) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isGlass = variant === 'glass';

    const Content = (
        <Typography
            variant="body"
            style={[
                styles.text,
                isPrimary && styles.primaryText,
                textStyle,
                disabled && styles.disabledText
            ]}
        >
            {title}
        </Typography>
    );

    if (isPrimary && !disabled) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.container, style]}
            >
                <LinearGradient
                    colors={theme.colors.gradient.primary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    {Content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[
                styles.container,
                styles.button,
                isOutline && styles.outlineButton,
                isGlass && styles.glassButton,
                disabled && styles.disabledButton,
                style
            ]}
        >
            {Content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.roundness,
        overflow: 'hidden',
        width: '100%',
    },
    button: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'transparent',
    },
    glassButton: {
        backgroundColor: theme.colors.glass,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    disabledButton: {
        opacity: 0.5,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
    primaryText: {
        color: '#FFFFFF',
    },
    disabledText: {
        opacity: 0.7,
    },
});
