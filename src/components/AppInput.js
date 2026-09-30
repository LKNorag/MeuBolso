import { Text, TextInput, View, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function AppInput({ label, error, ...props }) {
    return (
        <View style={styles.container}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <TextInput
                style={[styles.input, error && styles.errorInput]}
                placeholderTextColor={COLORS.muted}
                {...props}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: SPACING.md },
    label: {
        color: COLORS.muted,
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: SPACING.xs + 2,
    },
    input: {
        backgroundColor: COLORS.surfaceLight,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.text,
    },
    errorInput: { borderColor: COLORS.danger },
    error: { color: COLORS.danger, fontSize: 12, marginTop: 4 },
});
