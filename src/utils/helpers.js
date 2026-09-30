import { Alert, Platform } from 'react-native';

// Alert.alert nao aparece no navegador, entao usamos window.alert na web
export function notify(title, message) {
    if (Platform.OS === 'web') {
        window.alert(message ? `${title}\n\n${message}` : title);
    } else {
        Alert.alert(title, message);
    }
}

export function confirmAction(title, message, onConfirm) {
    if (Platform.OS === 'web') {
        if (window.confirm(`${title}\n\n${message}`)) onConfirm();
        return;
    }
    Alert.alert(title, message, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
    ]);
}

export function formatMoney(value) {
    const [int, dec] = Math.abs(value).toFixed(2).split('.');
    const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${value < 0 ? '-' : ''}R$ ${withDots},${dec}`;
}

export function formatDate(iso) {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
