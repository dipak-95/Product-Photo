import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { getSubCategoriesByMainId } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function SubCategories() {
    const router = useRouter();
    const navigation = useNavigation();
    const { id, name } = useLocalSearchParams();
    const mainCategoryId = Array.isArray(id) ? id[0] : id;
    const mainCategoryName = Array.isArray(name) ? name[0] : name;

    const [subCategories, setSubCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (mainCategoryId) {
            fetchSubCategories();
        }
    }, [mainCategoryId]);

    const fetchSubCategories = async () => {
        try {
            if (!mainCategoryId) return;
            const data = await getSubCategoriesByMainId(mainCategoryId);
            setSubCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSubCategories();
    }, [mainCategoryId]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: '/category-products',
                params: {
                    subId: item._id,
                    name: item.name
                }
            })}
        >
            <View style={styles.imageContainer}>
                {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.placeholder]}>
                        <Ionicons name="grid-outline" size={32} color={COLORS.textSecondary} />
                    </View>
                )}
                <View style={styles.overlay} />
                <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{mainCategoryName}</Text>
                <View style={{ width: 40 }} />
            </View >

            <FlatList
                data={subCategories}
                keyExtractor={(item: any) => item._id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No sub-categories found.</Text>
                    </View>
                }
            />
        </SafeAreaView >
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
        paddingTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.padding,
    },
    card: {
        width: (width - SIZES.padding * 2 - 12) / 2,
        height: 120, // Taller cards
        backgroundColor: COLORS.card,
        marginBottom: 16,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholder: {
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    categoryName: {
        position: 'absolute',
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        paddingHorizontal: 8,
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
