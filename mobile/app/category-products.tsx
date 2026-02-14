import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getProductsByCategory, getProductsBySubCategory } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function CategoryProducts() {
    const router = useRouter();
    const { id, name, subId } = useLocalSearchParams();
    const categoryId = Array.isArray(id) ? id[0] : id;
    const subCategoryId = Array.isArray(subId) ? subId[0] : subId;
    const categoryName = Array.isArray(name) ? name[0] : name;

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (categoryId || subCategoryId) {
            fetchProducts(1);
        }
    }, [categoryId, subCategoryId]);

    const fetchProducts = async (pageNumber: number) => {
        try {
            if (!categoryId && !subCategoryId) return;

            let data;
            if (subCategoryId) {
                data = await getProductsBySubCategory(subCategoryId, pageNumber);
            } else {
                data = await getProductsByCategory(categoryId, pageNumber);
            }

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
            fetchProducts(nextPage);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        fetchProducts(1);
    }, [categoryId]);

    const renderProductItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/product-details', params: { id: item._id } })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
            </View>
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        // ... loading view
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Headers, etc */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{categoryName || 'Products'}</Text>
                <View style={{ width: 40 }} />
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
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No products found in this category.</Text>
                        </View>
                    )
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    backButton: {
        padding: 8,
    },
    listContent: {
        paddingBottom: 40,
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
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});
