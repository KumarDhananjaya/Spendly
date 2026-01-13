export const theme = {
    colors: {
        // Light theme with blue accents
        background: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceVariant: '#F1F5F9',
        primary: '#3B82F6',
        primaryLight: '#60A5FA',
        primaryDark: '#1D4ED8',
        secondary: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        text: '#1E293B',
        textSecondary: '#64748B',
        textMuted: '#94A3B8',
        glass: 'rgba(59, 130, 246, 0.08)',
        border: '#E2E8F0',
        cardShadow: 'rgba(15, 23, 42, 0.08)',
        gradient: {
            primary: ['#3B82F6', '#1D4ED8'],
            accent: ['#60A5FA', '#3B82F6'],
            success: ['#10B981', '#059669'],
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    roundness: 16,
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 5,
        },
    },
};
