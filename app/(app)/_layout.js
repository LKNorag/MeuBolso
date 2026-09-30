import { Stack } from 'expo-router';
import { COLORS } from '../../src/constants/theme';

export default function AppLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
            }}
        >
            <Stack.Screen name="home" />
            <Stack.Screen name="new-transaction" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
    );
}
