import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'body' | 'caption';
    style?: TextStyle;
}

export const Typography = ({ children, variant = 'body', style }: TypographyProps) => {
    return (
        <Text style={[styles.base, (styles as any)[variant], style]}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        color: '#FFFFFF',
    },
    h1: {
        fontSize: 32,
        fontWeight: '800',
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
    },
    body: {
        fontSize: 16,
        color: '#A0A0A0',
    },
    caption: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 1,
    },
});
