import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface CardProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'glass';
}

export const Card = ({ children, style, variant = 'glass' }: CardProps) => {
    if (variant === 'glass') {
        return (
            <View style={[styles.container, style]}>
                <BlurView intensity={20} tint="dark" style={styles.blur}>
                    <View style={styles.content}>
                        {children}
                    </View>
                </BlurView>
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.elevated, style]}>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.roundness,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
    },
    blur: {
        padding: theme.spacing.md,
    },
    content: {
        flex: 1,
    },
    elevated: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
    },
});
