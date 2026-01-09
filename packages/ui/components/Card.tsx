import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, glass }) => {
    if (glass && Platform.OS !== 'web') {
        return (
            <BlurView intensity={20} tint="dark" style={[styles.card, styles.glass, style]}>
                {children}
            </BlurView>
        );
    }
    return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
});
