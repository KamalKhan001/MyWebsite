import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = 'kk_admin_token';

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to every request if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsAPI = {
  getAll: async (category = null) => {
    const params = category && category !== 'All' ? { category } : {};
    const response = await apiClient.get('/products', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  }
};

export const testimonialsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/testimonials');
    return response.data;
  }
};

export const contactAPI = {
  submit: async (formData) => {
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      country: formData.country,
      product_interest: formData.productInterest,
      message: formData.message
    };
    const response = await apiClient.post('/contact-inquiries', payload);
    return response.data;
  }
};

export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY)
};

export const adminAPI = {
  listInquiries: async () => {
    const response = await apiClient.get('/contact-inquiries');
    return response.data;
  },
  updateInquiryStatus: async (id, status) => {
    const response = await apiClient.patch(`/contact-inquiries/${id}`, { status });
    return response.data;
  },
  deleteInquiry: async (id) => {
    const response = await apiClient.delete(`/contact-inquiries/${id}`);
    return response.data;
  }
};

export default apiClient;
