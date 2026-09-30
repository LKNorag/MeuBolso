// Cadastro e login de usuarios usando o Supabase Auth
import { supabase } from '../lib/supabase';

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
    const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name: name.trim() } },
    });

    if (error) throw new Error(translateError(error));

    // Com "Confirm email" ligado, o Supabase nao avisa que o e-mail ja existe:
    // ele devolve um usuario sem identidades.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error('Este e-mail já está cadastrado.');
    }

    const needsConfirmation = !data.session;

    // Sai da conta para o usuario fazer o login na tela de login
    if (data.session) await supabase.auth.signOut();

    return { needsConfirmation };
}

export async function login(email, password) {
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
