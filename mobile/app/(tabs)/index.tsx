import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, TextInput, ScrollView, Platform, RefreshControl } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getStandardProducts, getTrendingProducts, getBanners } from '../../services/api';
import { getFavorites, toggleFavorite as toggleFavoriteService } from '../../services/favoritesService';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

// Top Carousel Component
const Carousel = ({ data, router }: { data: any[], router: any }) => {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.carouselContainer}>
            <FlatList
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.carouselItem}
                        activeOpacity={0.9} // Prevent accidental double clicks if needed
                    >
                        <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
                        {/* Optional: Add text if banner model supports it in future */}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default function Home() {
    const router = useRouter();
    const navigation = useNavigation();
    const [products, setProducts] = useState<any>([]);
    const [trending, setTrending] = useState<any>([]);
    const [banners, setBanners] = useState<any>([]); // Banner state
    const [favorites, setFavorites] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            syncFavorites();
        });
        fetchData();
        return unsubscribe;
    }, [navigation]);

    const syncFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
    };

    const fetchData = async () => {
        try {
            const [trendingData, productsData, bannersData] = await Promise.all([
                getTrendingProducts(),
                getStandardProducts(1),
                getBanners()
            ]);

            // Apply Daily Rotation Logic for Trending
            // dayNumber = floor((currentDate - launchDate) / 1 day)
            // startIndex = (dayNumber * 6) % totalProducts
            // Note: Since we only get a subset from API, we will just use the API return for now as it's cleaner, 
            // but if we had a full list locally we would apply that math. 
            // Assuming API returns what we need or we slice it.
            setTrending(trendingData); // Logic fixed in backend to not duplicate small lists

            setProducts(productsData.products);
            setBanners(bannersData.filter((b: any) => b.isActive));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const isFav = (id: string) => favorites && favorites.some((f: any) => f._id === id);

    const handleToggleFav = async (product: any) => {
        const status = await toggleFavoriteService(product);
        syncFavorites();
    };

    const filteredProducts = products.filter((p: any) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderTrendingItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.trendingCard}
            onPress={() => router.push({ pathname: '/product-details', params: { id: item._id } })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.trendingImage} />
            <View style={styles.trendingOverlay}>
                <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderProductItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push({ pathname: '/product-details', params: { id: item._id } })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
                {item.isPremium && (
                    <View style={styles.premiumBadgeItem}>
                        <Ionicons name="star" size={10} color="#FFF" />
                    </View>
                )}
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleToggleFav(item)}
                >
                    <Ionicons
                        name={isFav(item._id) ? "heart" : "heart-outline"}
                        size={20}
                        color={isFav(item._id) ? COLORS.error : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Top Header */}
            <View style={styles.header}>
                <Text style={styles.appName}>Ai Product Photo Prompt Pearl</Text>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="settings-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item: any) => item._id}
                renderItem={renderProductItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListHeaderComponent={() => (
                    <View>
                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by name, category..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor={COLORS.textSecondary}
                            />
                        </View>

                        {/* Carousel */}
                        {searchQuery === '' && <Carousel data={banners} router={router} />}

                        {/* Trending Section */}
                        {searchQuery === '' && trending.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Daily Trending</Text>
                                <FlatList
                                    data={trending}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item: any) => item._id}
                                    renderItem={renderTrendingItem}
                                    contentContainerStyle={styles.trendingList}
                                />
                            </View>
                        )}

                        <Text style={styles.sectionTitle}>
                            {searchQuery ? `Results for "${searchQuery}"` : "Explore Prompts"}
                        </Text>
                    </View>
                )}
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
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
    },
    appName: {
        color: COLORS.primary,
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        marginHorizontal: SIZES.padding,
        marginBottom: 16,
        paddingHorizontal: 12,
        borderRadius: SIZES.radius,
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        color: COLORS.text,
        fontSize: 15,
    },
    carouselContainer: {
        marginBottom: 24,
    },
    carouselItem: {
        width: width - (SIZES.padding * 2),
        height: 180,
        marginLeft: SIZES.padding,
        marginRight: 4,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    carouselOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 12,
    },
    carouselTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: SIZES.padding,
        marginBottom: 12,
    },
    trendingList: {
        paddingHorizontal: SIZES.padding,
        paddingRight: 4,
    },
    trendingCard: {
        width: 160,
        height: 220,
        marginRight: 16,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    trendingImage: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    trendingOverlay: {
        padding: 10,
        justifyContent: 'center',
    },
    trendingTitle: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
    },
    premiumBadgeItem: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.accent,
        padding: 4,
        borderRadius: 12,
    },
    productCard: {
        width: (width - SIZES.padding * 2 - 12) / 2, // 2 columns gap 12
        marginBottom: 16,
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    imageContainer: {
        height: 140,
        width: '100%',
        backgroundColor: '#E2E8F0',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    productTitle: {
        color: COLORS.text,
        fontSize: 13,
        flex: 1,
        fontWeight: '500',
        marginRight: 4,
    },
    iconButton: {
        padding: 2,
    },
});
