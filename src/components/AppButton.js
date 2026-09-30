import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function AppButton({ title, onPress, loading = false, disabled = false, variant = 'primary', style }) {
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, isOutline && styles.outline, (disabled || loading) && styles.disabled, style]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? COLORS.primary : '#fff'} />
            ) : (
                <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.pill,
        alignItems: 'center',
        marginTop: SPACING.sm,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.45,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabled: { opacity: 0.6 },
    text: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
    outlineText: { color: COLORS.primary },
});
