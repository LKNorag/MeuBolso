import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import AppInput from '../src/components/AppInput';
import AppButton from '../src/components/AppButton';
import { COLORS, RADIUS, SPACING } from '../src/constants/theme';
import { registerUser } from '../src/services/auth';
import { isValidEmail, notify } from '../src/utils/helpers';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Informe seu nome.';
        if (!email.trim()) newErrors.email = 'Informe seu e-mail.';
        else if (!isValidEmail(email)) newErrors.email = 'E-mail inválido.';
        if (password.length < 6) newErrors.password = 'A senha precisa ter pelo menos 6 caracteres.';
        if (confirmPassword !== password) newErrors.confirmPassword = 'As senhas não coincidem.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        try {
            setLoading(true);
            const { needsConfirmation } = await registerUser({ name, email, password });
            if (needsConfirmation) {
                notify('Conta criada!', 'Enviamos um link de confirmação para o seu e-mail. Confirme e depois faça o login.');
            } else {
                notify('Conta criada!', 'Agora é só entrar com seu e-mail e senha.');
            }
            router.replace('/');
        } catch (e) {
            setErrors({ email: e.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Text style={styles.backText}>←  Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Criar conta</Text>
                <Text style={styles.subtitle}>Leva menos de um minuto ✨</Text>

                <View style={styles.card}>
                    <AppInput label="Nome" placeholder="Seu nome" value={name} onChangeText={setName} error={errors.name} />
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
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChangeText={setPassword}
                        error={errors.password}
                    />
                    <AppInput
                        label="Confirmar senha"
                        secureTextEntry
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        error={errors.confirmPassword}
                    />
                    <AppButton title="Cadastrar" loading={loading} onPress={handleRegister} />
                </View>

                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text style={styles.link}>
                        Já possui uma conta? <Text style={styles.linkStrong}>Entrar</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg, maxWidth: 480, width: '100%', alignSelf: 'center' },
    back: { alignSelf: 'flex-start', marginBottom: SPACING.lg },
    backText: { color: COLORS.muted, fontWeight: '700' },
    title: { fontSize: 32, fontWeight: '900', color: COLORS.text },
    subtitle: { color: COLORS.muted, marginTop: 4, marginBottom: SPACING.lg },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    link: { color: COLORS.muted, textAlign: 'center', marginTop: SPACING.lg },
    linkStrong: { color: COLORS.accent, fontWeight: '800' },
});
