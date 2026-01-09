import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from './Typography';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'outline';
    gradient?: string[];
    disabled?: boolean;
}

export const Button = ({
    title,
    onPress,
    style,
    textStyle,
    variant = 'primary',
    gradient,
    disabled
}: ButtonProps) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    const Content = (
        <Typography
            variant="body"
            style={[
                styles.text,
                isPrimary && styles.primaryText,
                isOutline && styles.outlineText,
                textStyle,
                disabled && styles.disabledText
            ]}
        >
            {title}
        </Typography>
    );

    if (gradient && !disabled) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.container, style]}>
                <LinearGradient
                    colors={gradient}
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
                isPrimary && styles.primaryButton,
                isOutline && styles.outlineButton,
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
        borderRadius: 12,
        overflow: 'hidden',
    },
    button: {
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    primaryButton: {
        backgroundColor: '#A06AF9',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#A06AF9',
    },
    disabledButton: {
        backgroundColor: '#2D2D3D',
        borderColor: '#2D2D3D',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    primaryText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: '#A06AF9',
    },
    disabledText: {
        color: '#555565',
    },
});
