import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Share, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getProductDetails } from '../services/api';
import { toggleFavorite as toggleFavoriteService, isProductFavorite } from '../services/favoritesService';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        if (id) {
            init();
        }
    }, [id]);

    const init = async () => {
        try {
            const productId = Array.isArray(id) ? id[0] : id;
            if (!productId) return;

            const [data, favStatus] = await Promise.all([
                getProductDetails(productId),
                isProductFavorite(productId)
            ]);
            setProduct(data);
            setIsFav(favStatus);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFav = async () => {
        if (!product) return;
        const status = await toggleFavoriteService(product);
        setIsFav(status);
    };

    const handleCopy = async () => {
        if (product?.prompt) {
            await Clipboard.setStringAsync(product.prompt);
            // Could add a toast here
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this prompt: ${product.title}\n\n${product.prompt}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.fullScreenImageContainer}>
                <Image source={{ uri: product.imageUrl }} style={styles.fullScreenImage} />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradientOverlay}
                />
            </View>

            {/* Top Actions */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleFav} style={styles.iconButton}>
                    <Ionicons
                        name={isFav ? "heart" : "heart-outline"}
                        size={28}
                        color={isFav ? COLORS.error : "#FFF"}
                    />
                </TouchableOpacity>
            </View>

            {/* Bottom Content */}
            <View style={styles.bottomContent}>
                <ScrollView style={styles.promptScroll} showsVerticalScrollIndicator={false}>
                    <Text style={styles.productTitle}>{product.title}</Text>
                    <View style={styles.promptBox}>
                        <Text style={styles.promptLabel}>PROMPT</Text>
                        <Text style={styles.promptText}>{product.prompt}</Text>
                    </View>
                </ScrollView>

                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                        <Ionicons name="copy-outline" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    fullScreenImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    fullScreenImage: {
        width: width,
        height: height,
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    topHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: height * 0.45,
    },
    promptScroll: {
        marginBottom: 20,
    },
    productTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    promptBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    promptLabel: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    promptText: {
        color: '#E2E8F0',
        fontSize: 15,
        lineHeight: 22,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    copyButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    shareButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
});
