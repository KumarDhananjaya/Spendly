import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, disabled }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, style, disabled && styles.disabled]}
            disabled={disabled}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6200EE',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        backgroundColor: '#E0E0E0',
    },
});
