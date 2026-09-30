import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import AppInput from '../src/components/AppInput';
import AppButton from '../src/components/AppButton';
import { COLORS, RADIUS, SPACING } from '../src/constants/theme';
import { login } from '../src/services/auth';
import { isValidEmail, notify } from '../src/utils/helpers';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Informe seu e-mail.';
        else if (!isValidEmail(email)) newErrors.email = 'E-mail inválido.';
        if (!password) newErrors.password = 'Informe sua senha.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        try {
            setLoading(true);
            const user = await login(email, password);
            notify('Login realizado!', `Bem-vindo(a), ${user.name}!`);
            setEmail('');
            setPassword('');
        } catch (e) {
            setErrors({ general: e.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.logo}>
                    <Text style={styles.logoText}>$</Text>
                </View>

                <Text style={styles.title}>Meu Bolso</Text>
                <Text style={styles.subtitle}>Suas finanças na palma da mão</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Entrar</Text>

                    {errors.general ? <Text style={styles.generalError}>{errors.general}</Text> : null}

                    <AppInput
                        label="E-mail"
                        placeholder="seu@email.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        error={errors.email}
                    />
                    <AppInput
                        label="Senha"
                        secureTextEntry
                        placeholder="••••••"
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                    />
                    <AppButton title="Entrar" loading={loading} onPress={handleLogin} />
                </View>

                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.link}>
                        Ainda não tem conta? <Text style={styles.linkStrong}>Cadastre-se</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg, maxWidth: 480, width: '100%', alignSelf: 'center' },
    logo: {
        width: 72,
        height: 72,
        borderRadius: RADIUS.lg,
        backgroundColor: COLORS.primary,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        transform: [{ rotate: '-8deg' }],
    },
    logoText: { color: COLORS.accent, fontSize: 38, fontWeight: '900' },
    title: { fontSize: 34, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
    subtitle: { color: COLORS.muted, textAlign: 'center', marginTop: 4, marginBottom: SPACING.xl },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTitle: { color: COLORS.text, fontSize: 20, fontWeight: '800', marginBottom: SPACING.md },
    generalError: {
        color: COLORS.danger,
        backgroundColor: 'rgba(251,113,133,0.12)',
        padding: SPACING.sm + 2,
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.md,
        textAlign: 'center',
        fontWeight: '600',
    },
    link: { color: COLORS.muted, textAlign: 'center', marginTop: SPACING.lg },
    linkStrong: { color: COLORS.accent, fontWeight: '800' },
});
