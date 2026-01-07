import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TypographyProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'body' | 'caption';
    style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({ children, variant = 'body', style }) => {
    return <Text style={[styles[variant], style]}>{children}</Text>;
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#121212',
    },
    h2: {
        fontSize: 20,
        fontWeight: '600',
        color: '#121212',
    },
    body: {
        fontSize: 16,
        color: '#424242',
    },
    caption: {
        fontSize: 12,
        color: '#757575',
    },
});
