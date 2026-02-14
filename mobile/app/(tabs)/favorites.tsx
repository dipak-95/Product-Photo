import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getFavorites } from '../../services/favoritesService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function Favorites() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    const fetchFavorites = async () => {
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data);
        setLoading(false);
        setRefreshing(false);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFavorites();
    }, []);

    const renderProductItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/product-details', params: { id: item._id } })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                {item.isPremium && (
                    <View style={styles.premiumBadge}>
                        <Ionicons name="star" size={10} color="#FFF" />
                    </View>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading && favorites.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Favorites</Text>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item: any) => item._id}
                renderItem={renderProductItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No favorites yet.</Text>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.push('/')}
                        >
                            <Text style={styles.exploreButtonText}>Explore Prompts</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: 16,
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    listContent: {
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
    },
    card: {
        width: (width - SIZES.padding * 2 - 12) / 2,
        backgroundColor: COLORS.card,
        marginBottom: 16,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    imageContainer: {
        height: 150,
        width: '100%',
        backgroundColor: '#E2E8F0',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    premiumBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.accent,
        padding: 4,
        borderRadius: 12,
    },
    info: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: COLORS.textSecondary,
        marginTop: 16,
    },
    exploreButton: {
        marginTop: 24,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: SIZES.radius,
    },
    exploreButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
