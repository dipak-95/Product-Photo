import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';

const SettingItem = ({ icon, title, onPress }: { icon: any, title: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={styles.settingLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingTitle}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
    </TouchableOpacity>
);

export default function Settings() {
    const router = useRouter();

    const sections = [
        {
            id: 'how-to-use',
            title: 'How to use app',
            icon: 'help-circle-outline' as any,
            content: "Welcome to Ai Product Photo Prompt Pearl!\n\n1. Browse Categories: Find inspiration for your product photos by exploring various categories.\n2. Pick a Prompt: Select any product to view its detailed AI generation prompt.\n3. Copy & Use: Simply copy the prompt and use it in your favorite AI image generator like Midjourney or DALL-E.\n4. Save Favorites: Heart your favorite prompts to find them easily later in your Favorites tab."
        },
        {
            id: 'privacy',
            title: 'Privacy Policy',
            icon: 'shield-checkmark-outline' as any,
            content: "Privacy Policy\n\n- Data Collection: We do not collect personal information. Your favorites are stored locally on your device.\n- Image Usage: The images shown in the app are for demonstration purposes of what the prompts can achieve.\n- Third Party: We do not share any data with third parties."
        },
        {
            id: 'version',
            title: 'About the version',
            icon: 'information-circle-outline' as any,
            content: "Version: 1.0.0\n\nBuild: 1.0.0.1\n\nAi Product Photo Prompt Pearl is designed to provide high-quality prompts for professional-grade product photography."
        }
    ];

    const [activeSection, setActiveSection] = useState<any>(null);

    const renderContent = () => {
        if (!activeSection) return (
            <View style={styles.listContainer}>
                {sections.map((section) => (
                    <SettingItem
                        key={section.id}
                        title={section.title}
                        icon={section.icon}
                        onPress={() => setActiveSection(section as any)}
                    />
                ))}
            </View>
        );

        return (
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => setActiveSection(null)}>
                    <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                    <Text style={styles.backText}>Back to Settings</Text>
                </TouchableOpacity>
                <Text style={styles.contentTitle}>{activeSection.title}</Text>
                <Text style={styles.contentText}>{activeSection.content}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerBack: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    scrollContent: {
        padding: SIZES.padding,
    },
    listContainer: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingTitle: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: '500',
    },
    contentContainer: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        marginLeft: 8,
        color: COLORS.primary,
        fontWeight: '600',
    },
    contentTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    contentText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
});
