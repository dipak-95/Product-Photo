import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
    });

    if (response.data) {
        localStorage.setItem('admin', JSON.stringify(response.data));
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('admin');
};

const getCurrentAdmin = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('admin'));
    }
    return null;
};

const authService = {
    login,
    logout,
    getCurrentAdmin,
    getToken: () => {
        const admin = getCurrentAdmin();
        return admin ? admin.token : null;
    }
};

export default authService;
