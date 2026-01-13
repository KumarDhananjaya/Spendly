import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    fullWidth?: boolean;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    style,
    disabled = false,
    fullWidth = false,
}: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.base,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.8}
        >
            <Text style={[
                styles.text,
                styles[`${variant}Text`],
                styles[`${size}Text`],
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
        ...theme.shadows.md,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
    },
    ghost: {
        backgroundColor: theme.colors.glass,
    },

    // Sizes
    sm: {
        height: 36,
        paddingHorizontal: 16,
    },
    md: {
        height: 48,
        paddingHorizontal: 24,
    },
    lg: {
        height: 56,
        paddingHorizontal: 32,
    },

    // Text styles
    text: {
        fontWeight: '600',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: theme.colors.primary,
    },
    ghostText: {
        color: theme.colors.primary,
    },
    smText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 16,
    },
    lgText: {
        fontSize: 18,
    },
});
