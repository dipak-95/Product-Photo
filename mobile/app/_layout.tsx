import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="sub-categories" options={{ headerShown: false }} />
            <Stack.Screen name="category-products" options={{ headerShown: false }} />
            <Stack.Screen name="product-details" options={{ headerShown: false }} />
        </Stack>
    );
}
