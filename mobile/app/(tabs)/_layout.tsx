import { Tabs } from 'expo-router';
import { View, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const TabIcon = ({ name, color, focused }: any) => {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            top: Platform.OS === 'ios' ? 10 : 0
        }}>
            {/* Removed hacky icon */}
            <Ionicons name={name} size={24} color={color} />
            {focused && (
                <View style={{
                    height: 4,
                    width: 4,
                    borderRadius: 2,
                    backgroundColor: color,
                    marginTop: 4
                }} />
            )}
        </View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.secondary,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="category"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "grid" : "grid-outline"} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="premium"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "star" : "star-outline"} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "heart" : "heart-outline"} color={color} focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.card,
        elevation: 0,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        height: 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    }
});
