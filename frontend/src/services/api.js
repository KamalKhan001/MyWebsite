import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json'
  }
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

export default apiClient;
