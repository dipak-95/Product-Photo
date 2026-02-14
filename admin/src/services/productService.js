import api from './api';

const getProducts = async (pageNumber = 1, keyword = '', type = 'standard') => {
    const response = await api.get(`/products?pageNumber=${pageNumber}&keyword=${keyword}&type=${type}`);
    return response.data;
};

const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

const productService = {
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
};

export default productService;
