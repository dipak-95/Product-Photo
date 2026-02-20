import axios from 'axios';

// Update this to your local IP address
const BASE_URL = 'https://api.productphotoadmin.online/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export const getStandardProducts = async (page = 1) => {
    const response = await api.get(`/products?pageNumber=${page}`);
    return response.data;
};

export const getTrendingProducts = async () => {
    const response = await api.get('/products/trending');
    return response.data;
};

export const getPremiumProducts = async (page = 1) => {
    const response = await api.get(`/products?type=premium&pageNumber=${page}`);
    return response.data;
};

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const getProductsByCategory = async (categoryId, page = 1) => {
    const response = await api.get(`/products?categoryId=${categoryId}&pageNumber=${page}`);
    return response.data;
};

export const getProductsBySubCategory = async (subCategoryId, page = 1) => {
    const response = await api.get(`/products?subCategoryId=${subCategoryId}&pageNumber=${page}`);
    return response.data;
};

export const getProductDetails = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

export const getSubCategoriesByMainId = async (mainId) => {
    const response = await api.get(`/subcategories/main/${mainId}`);
    return response.data;
};

export const getBanners = async () => {
    const response = await api.get('/banners');
    return response.data;
};

export default api;
