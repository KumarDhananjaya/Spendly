import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'caption' | 'label';

interface TypographyProps {
    children?: React.ReactNode;
    variant?: TypographyVariant;
    style?: StyleProp<TextStyle>;
    color?: string;
    numberOfLines?: number;
    align?: 'left' | 'center' | 'right';
}

export const Typography = ({
    children,
    variant = 'body',
    style,
    color,
    numberOfLines,
    align = 'left',
}: TypographyProps) => {
    return (
        <Text
            numberOfLines={numberOfLines}
            style={[
                styles.base,
                styles[variant],
                color ? { color } : null,
                { textAlign: align },
                style
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        color: theme.colors.text,
    },
    h1: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.3,
        lineHeight: 32,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
    },
    body: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    bodyLarge: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        lineHeight: 28,
    },
    caption: {
        fontSize: 13,
        color: theme.colors.textMuted,
        letterSpacing: 0.2,
        lineHeight: 18,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textMuted,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});
