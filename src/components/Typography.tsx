import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

interface TypographyProps {
    children: React.ReactNode;
    variant?: TypographyVariant;
    style?: StyleProp<TextStyle>;
    color?: string;
}

export const Typography = ({
    children,
    variant = 'body',
    style,
    color
}: TypographyProps) => {
    return (
        <Text style={[
            styles.base,
            styles[variant],
            color ? { color } : null,
            style
        ]}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        color: theme.colors.text,
        fontFamily: 'System',
    },
    h1: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    caption: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});
