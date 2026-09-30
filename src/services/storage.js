// Armazenamento local do app (usuarios, sessao e lancamentos)
// Os dados ficam salvos no proprio aparelho/navegador com AsyncStorage.
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@meubolso:usuarios';
const SESSION_KEY = '@meubolso:sessao';
const txKey = (email) => `@meubolso:lancamentos:${email}`;

async function readJSON(key, fallback) {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}

// ---------- Usuarios ----------
export async function registerUser({ name, email, password }) {
    const users = await readJSON(USERS_KEY, []);
    const normalized = email.trim().toLowerCase();

    if (users.some((u) => u.email === normalized)) {
        throw new Error('Este e-mail já está cadastrado.');
    }

    const user = { name: name.trim(), email: normalized, password };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    return user;
}

export async function login(email, password) {
    const users = await readJSON(USERS_KEY, []);
    const normalized = email.trim().toLowerCase();
    const user = users.find((u) => u.email === normalized && u.password === password);

    if (!user) {
        throw new Error('E-mail ou senha incorretos.');
    }

    const session = { name: user.name, email: user.email };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

export async function getSession() {
    return readJSON(SESSION_KEY, null);
}

export async function logout() {
    await AsyncStorage.removeItem(SESSION_KEY);
}

// ---------- Lancamentos (receitas e despesas) ----------
export async function getTransactions(email) {
    return readJSON(txKey(email), []);
}

export async function addTransaction(email, transaction) {
    const list = await getTransactions(email);
    const item = {
        id: String(Date.now()),
        date: new Date().toISOString(),
        ...transaction,
    };
    await AsyncStorage.setItem(txKey(email), JSON.stringify([item, ...list]));
    return item;
}

export async function removeTransaction(email, id) {
    const list = await getTransactions(email);
    await AsyncStorage.setItem(txKey(email), JSON.stringify(list.filter((t) => t.id !== id)));
}
