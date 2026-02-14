import api from './api';

const bannerService = {
    getBanners: async () => {
        try {
            const response = await api.get('/banners');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createBanner: async (data, token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.post('/banners', data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteBanner: async (id, token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.delete(`/banners/${id}`, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleBannerStatus: async (id, token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await api.put(`/banners/${id}/status`, {}, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bannerService;
