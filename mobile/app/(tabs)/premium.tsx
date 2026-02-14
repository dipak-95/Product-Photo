import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getPremiumProducts } from '../../services/api';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function Premium() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchPremiumContent(1);
    }, []);

    const fetchPremiumContent = async (pageNumber: number) => {
        try {
            const data = await getPremiumProducts(pageNumber);
            if (data.products.length === 0) {
                setHasMore(false);
            }
            if (pageNumber === 1) {
                setProducts(data.products);
            } else {
                setProducts(prev => [...prev, ...data.products]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPremiumContent(nextPage);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchPremiumContent(1);
    }, []);

    const renderProductItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/product-details', params: { id: item._id } })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.premiumBadge}>
                    <Ionicons name="star" size={10} color="#FFF" />
                    <Text style={styles.badgeText}>PRO</Text>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
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
            <View style={styles.header}>
                <Ionicons name="sparkles" size={24} color={COLORS.accent} />
                <Text style={styles.headerTitle}>Premium Collection</Text>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item: any) => item._id}
                renderItem={renderProductItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListFooterComponent={
                    loadingMore ? <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} /> : null
                }
                ListEmptyComponent={
                    !loading && <View style={styles.emptyContainer}><Text>No premium content available yet.</Text></View>
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 8,
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
        borderColor: COLORS.accent + '80', // Slightly more visible gold border
    },
    imageContainer: {
        height: 160,
        width: '100%',
        backgroundColor: '#E2E8F0',
        position: 'relative',
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
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    info: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});
