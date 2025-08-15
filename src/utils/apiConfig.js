// API Configuration với error handling cho HTTPS/Mixed Content
export const API_CONFIG = {
  BASE_URL: "https://54.169.159.141:3000",
  
  // Default fetch options để xử lý CORS và HTTPS
  getDefaultOptions: (method = 'GET', body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Xử lý CORS
      mode: 'cors',
      credentials: 'omit', // Không gửi cookies cross-origin
    };

    if (body && method !== 'GET') {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return options;
  },

  // Wrapper cho fetch với error handling
  async safeFetch(url, options = {}) {
    try {
      const mergedOptions = {
        ...this.getDefaultOptions(),
        ...options,
      };

      console.log('Making request to:', url);
      console.log('Request options:', mergedOptions);

      const response = await fetch(url, mergedOptions);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      
      return {
        ok: response.ok,
        status: response.status,
        data,
        response
      };
    } catch (error) {
      console.error('Network error:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối với server. Có thể do vấn đề CORS hoặc HTTPS.');
      }
      
      throw error;
    }
  }
};

export default API_CONFIG;
