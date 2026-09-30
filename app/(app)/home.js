import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { COLORS, RADIUS, SPACING } from '../../src/constants/theme';
import { getSession, getTransactions, removeTransaction, logout } from '../../src/services/storage';
import { confirmAction, formatDate, formatMoney } from '../../src/utils/helpers';

const FILTERS = [
    { key: 'all', label: 'Todos' },
    { key: 'income', label: 'Receitas' },
    { key: 'expense', label: 'Despesas' },
];

export default function Home() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    // Recarrega sempre que a tela volta a ficar visivel (ex.: depois de cadastrar)
    useFocusEffect(
        useCallback(() => {
            let active = true;
            (async () => {
                const session = await getSession();
                if (!session) {
                    router.replace('/');
                    return;
                }
                const list = await getTransactions(session.email);
                if (active) {
                    setUser(session);
                    setTransactions(list);
                    setLoading(false);
                }
            })();
            return () => {
                active = false;
            };
        }, [])
    );

    const totals = useMemo(() => {
        const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expense, balance: income - expense };
    }, [transactions]);

    const visible = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

    function handleDelete(item) {
        confirmAction('Excluir lançamento', `Deseja excluir "${item.description}"?`, async () => {
            await removeTransaction(user.email, item.id);
            setTransactions((prev) => prev.filter((t) => t.id !== item.id));
        });
    }

    function handleLogout() {
        confirmAction('Sair', 'Deseja sair da sua conta?', async () => {
            await logout();
            router.replace('/');
        });
    }

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
        );
    }

    const firstName = user?.name?.split(' ')[0] || '';

    const header = (
        <View>
            <View style={styles.topBar}>
                <View>
                    <Text style={styles.hello}>Olá,</Text>
                    <Text style={styles.name}>{firstName} 👋</Text>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Saldo atual</Text>
                <Text style={[styles.balanceValue, totals.balance < 0 && { color: COLORS.danger }]}>
                    {formatMoney(totals.balance)}
                </Text>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>▲ Receitas</Text>
                        <Text style={[styles.summaryValue, { color: COLORS.success }]}>{formatMoney(totals.income)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryLabel}>▼ Despesas</Text>
                        <Text style={[styles.summaryValue, { color: COLORS.danger }]}>{formatMoney(totals.expense)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.filters}>
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.chip, filter === f.key && styles.chipActive]}
                        onPress={() => setFilter(f.key)}
                    >
                        <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Lançamentos</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <FlatList
                data={visible}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={header}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>🪙</Text>
                        <Text style={styles.emptyText}>Nenhum lançamento por aqui.</Text>
                        <Text style={styles.emptyHint}>Toque em “+” para cadastrar o primeiro.</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const isIncome = item.type === 'income';
                    return (
                        <View style={styles.item}>
                            <View style={[styles.itemIcon, { backgroundColor: isIncome ? 'rgba(52,211,153,0.15)' : 'rgba(251,113,133,0.15)' }]}>
                                <Text style={{ color: isIncome ? COLORS.success : COLORS.danger, fontWeight: '900', fontSize: 18 }}>
                                    {isIncome ? '↑' : '↓'}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemTitle} numberOfLines={1}>{item.description}</Text>
                                <Text style={styles.itemMeta}>{item.category} • {formatDate(item.date)}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={[styles.itemValue, { color: isIncome ? COLORS.success : COLORS.danger }]}>
                                    {isIncome ? '+ ' : '- '}{formatMoney(item.amount)}
                                </Text>
                                <TouchableOpacity onPress={() => handleDelete(item)}>
                                    <Text style={styles.deleteText}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            />

            <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => router.push('/new-transaction')}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    list: { padding: SPACING.lg, paddingBottom: 120, maxWidth: 640, width: '100%', alignSelf: 'center' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
    hello: { color: COLORS.muted, fontSize: 15 },
    name: { color: COLORS.text, fontSize: 26, fontWeight: '900' },
    logoutBtn: {
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
    },
    logoutText: { color: COLORS.muted, fontWeight: '700' },
    balanceCard: {
        backgroundColor: COLORS.primaryDark,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    balanceLabel: { color: '#ddd6fe', fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    balanceValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4, marginBottom: SPACING.md },
    summaryRow: { flexDirection: 'row', backgroundColor: 'rgba(15,13,36,0.35)', borderRadius: RADIUS.md, padding: SPACING.md },
    summaryBox: { flex: 1 },
    divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: SPACING.md },
    summaryLabel: { color: '#ddd6fe', fontSize: 12, fontWeight: '700' },
    summaryValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },
    filters: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
    chip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
    chipText: { color: COLORS.muted, fontWeight: '700' },
    chipTextActive: { color: COLORS.background },
    sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800', marginBottom: SPACING.md },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm + 2,
        gap: SPACING.md,
    },
    itemIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    itemTitle: { color: COLORS.text, fontWeight: '700', fontSize: 15 },
    itemMeta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
    itemValue: { fontWeight: '800', fontSize: 15 },
    deleteText: { color: COLORS.muted, fontSize: 12, marginTop: 4, textDecorationLine: 'underline' },
    empty: { alignItems: 'center', paddingVertical: SPACING.xl },
    emptyIcon: { fontSize: 42, marginBottom: SPACING.sm },
    emptyText: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
    emptyHint: { color: COLORS.muted, marginTop: 4 },
    fab: {
        position: 'absolute',
        right: SPACING.lg,
        bottom: SPACING.xl,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.accent,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.accent,
        shadowOpacity: 0.5,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
    fabText: { color: COLORS.background, fontSize: 34, fontWeight: '900', marginTop: -2 },
});
