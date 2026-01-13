import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface CardProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card = ({ children, style, variant = 'elevated' }: CardProps) => {
    return (
        <View style={[
            styles.base,
            variant === 'elevated' && styles.elevated,
            variant === 'outlined' && styles.outlined,
            variant === 'flat' && styles.flat,
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.roundness,
        padding: theme.spacing.md,
    },
    elevated: {
        backgroundColor: theme.colors.surface,
        ...theme.shadows.md,
    },
    outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    flat: {
        backgroundColor: theme.colors.surfaceVariant,
    },
});
