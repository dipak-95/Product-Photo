import api from './api';

const getSubCategories = async () => {
    const response = await api.get('/subcategories');
    return response.data;
};

const getSubCategoriesByMainId = async (mainId) => {
    const response = await api.get(`/subcategories/main/${mainId}`);
    return response.data;
};

const createSubCategory = async (subCategoryData) => {
    const response = await api.post('/subcategories', subCategoryData);
    return response.data;
};

const deleteSubCategory = async (id) => {
    const response = await api.delete(`/subcategories/${id}`);
    return response.data;
};

const updateSubCategory = async (id, subCategoryData) => {
    const response = await api.put(`/subcategories/${id}`, subCategoryData);
    return response.data;
};

const subCategoryService = {
    getSubCategories,
    getSubCategoriesByMainId,
    createSubCategory,
    deleteSubCategory,
    updateSubCategory,
};

export default subCategoryService;
