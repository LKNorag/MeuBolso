
import { supabase, supabaseConfigured } from '../lib/supabase';

function checkConfig() {
    if (!supabaseConfigured) {
        throw new Error('Supabase não configurado. Verifique o arquivo .env na raiz do projeto.');
    }
}

function translateError(error) {
    const msg = (error?.message || '').toLowerCase();
    if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (msg.includes('already registered') || msg.includes('already been registered')) return 'Este e-mail já está cadastrado.';
    if (msg.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (verifique sua caixa de entrada).';
    if (msg.includes('password')) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (msg.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    if (msg.includes('network') || msg.includes('fetch')) return 'Sem conexão com o servidor. Verifique sua internet.';
    return error?.message || 'Ocorreu um erro. Tente novamente.';
}

export async function registerUser({ name, email, password }) {
    checkConfig();
    const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name: name.trim() } },
    });

    if (error) throw new Error(translateError(error));

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('Este e-mail já está cadastrado.');
    }

    const needsConfirmation = !data.session;
    if (data.session) await supabase.auth.signOut();

    return { needsConfirmation };
}

export async function login(email, password) {
    checkConfig();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
    });

    if (error) throw new Error(translateError(error));

    return {
        name: data.user.user_metadata?.name || data.user.email,
        email: data.user.email,
    };
}

export async function logout() {
    await supabase.auth.signOut();
}
