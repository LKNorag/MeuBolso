import { Alert, Platform } from 'react-native';

// Alert.alert nao aparece no navegador, entao usamos window.alert na web
export function notify(title, message) {
    if (Platform.OS === 'web') {
        window.alert(message ? `${title}\n\n${message}` : title);
    } else {
        Alert.alert(title, message);
    }
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
