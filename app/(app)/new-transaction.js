import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AppInput from '../../src/components/AppInput';
import AppButton from '../../src/components/AppButton';
import { COLORS, RADIUS, SPACING } from '../../src/constants/theme';
import { addTransaction, getSession } from '../../src/services/storage';

const CATEGORIES = {
    income: ['Salário', 'Freela', 'Investimentos', 'Presente', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Estudos', 'Outros'],
};

export default function NewTransaction() {
    const [type, setType] = useState('expense');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function changeType(newType) {
        setType(newType);
        setCategory('');
    }

    async function handleSave() {
        // Aceita "12,50", "1.200,50" ou "12.50"
        const clean = amount.includes(',') ? amount.replace(/\./g, '').replace(',', '.') : amount;
        const value = parseFloat(clean);
        const newErrors = {};
        if (!description.trim()) newErrors.description = 'Informe uma descrição.';
        if (!amount || isNaN(value) || value <= 0) newErrors.amount = 'Informe um valor maior que zero.';
        if (!category) newErrors.category = 'Escolha uma categoria.';
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        try {
            setLoading(true);
            const session = await getSession();
            if (!session) {
                router.replace('/');
                return;
            }
            await addTransaction(session.email, {
                type,
                description: description.trim(),
                amount: value,
                category,
            });
            router.back();
        } finally {
            setLoading(false);
        }
    }

    const isIncome = type === 'income';

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <Text style={styles.title}>Novo lançamento</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.toggle}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, !isIncome && { backgroundColor: COLORS.danger }]}
                            onPress={() => changeType('expense')}
                        >
                            <Text style={[styles.toggleText, !isIncome && styles.toggleTextActive]}>↓ Despesa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, isIncome && { backgroundColor: COLORS.success }]}
                            onPress={() => changeType('income')}
                        >
                            <Text style={[styles.toggleText, isIncome && styles.toggleTextActive]}>↑ Receita</Text>
                        </TouchableOpacity>
                    </View>

                    <AppInput
                        label="Descrição"
                        placeholder={isIncome ? 'Ex.: Salário de setembro' : 'Ex.: Mercado'}
                        value={description}
                        onChangeText={setDescription}
                        error={errors.description}
                    />
                    <AppInput
                        label="Valor (R$)"
                        placeholder="0,00"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                        error={errors.amount}
                    />

                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.categories}>
                        {CATEGORIES[type].map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.chip, category === c && styles.chipActive]}
                                onPress={() => setCategory(c)}
                            >
                                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

                    <AppButton title="Salvar lançamento" loading={loading} onPress={handleSave} style={{ marginTop: SPACING.lg }} />
                    <AppButton title="Cancelar" variant="outline" onPress={() => router.back()} style={{ marginTop: SPACING.md }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: SPACING.lg, maxWidth: 520, width: '100%', alignSelf: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
    title: { color: COLORS.text, fontSize: 26, fontWeight: '900' },
    close: { color: COLORS.muted, fontSize: 22, padding: SPACING.xs },
    toggle: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.pill,
        padding: 4,
        marginBottom: SPACING.lg,
    },
    toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: RADIUS.pill, alignItems: 'center' },
    toggleText: { color: COLORS.muted, fontWeight: '800' },
    toggleTextActive: { color: COLORS.background },
    label: {
        color: COLORS.muted,
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
    },
    categories: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { color: COLORS.muted, fontWeight: '700' },
    chipTextActive: { color: '#fff' },
    error: { color: COLORS.danger, fontSize: 12, marginTop: SPACING.sm },
});
