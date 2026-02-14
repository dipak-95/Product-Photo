import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'v1_favorite_prompts';

export const getFavorites = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error fetching favorites', e);
        return [];
    }
};

export const toggleFavorite = async (product) => {
    try {
        const favorites = await getFavorites();
        const isExist = favorites.find(item => item._id === product._id);

        let newFavorites;
        if (isExist) {
            newFavorites = favorites.filter(item => item._id !== product._id);
        } else {
            newFavorites = [...favorites, product];
        }

        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        return !isExist; // Returns true if added, false if removed
    } catch (e) {
        console.error('Error toggling favorite', e);
        return false;
    }
};

export const isProductFavorite = async (productId) => {
    try {
        const favorites = await getFavorites();
        return favorites.some(item => item._id === productId);
    } catch (e) {
        return false;
    }
};
