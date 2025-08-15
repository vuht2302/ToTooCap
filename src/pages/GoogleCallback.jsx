import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiUrl } from '@/config/api';
import API_CONFIG from '../utils/apiConfig';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Lấy authorization code từ URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        console.log('Google Callback - URL params:', { code: code?.substring(0, 20) + '...', error });

        if (error) {
          console.error('Google OAuth error:', error);
          alert(`Đăng nhập Google thất bại: ${error}`);
          navigate('/login');
          return;
        }

        if (!code) {
          alert('Không nhận được mã xác thực từ Google!');
          navigate('/login');
          return;
        }

        // Gọi API callback với GET method và code parameter
        console.log('Calling Google callback API...');
        const callbackUrl = `${API_CONFIG.BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}`;
        
        const result = await API_CONFIG.safeFetch(callbackUrl, {
          method: 'GET'
        });

        console.log('API result:', { ok: result.ok, status: result.status, data: result.data });

        if (result.ok && result.data.success) {
          // Response format: { "success": true, "message": "Logged in successful", "accessToken": "string" }
          const accessToken = result.data.accessToken;

          if (accessToken) {
            // Lưu access token
            localStorage.setItem('accessToken', accessToken);

            // Lấy thông tin user từ API riêng
            try {
              const userResponse = await fetch(apiUrl('/auth/user/get/loginUser'), {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              });

              const userInfo = await userResponse.json();
              
              if (userResponse.ok && userInfo.success && userInfo.data) {
                localStorage.setItem('user', JSON.stringify(userInfo.data));
                setUser(userInfo.data);

                // Redirect theo role
                switch (userInfo.data.role) {
                  case 'admin':
                    navigate('/admin');
                    break;
                  case 'manager':
                    navigate('/manager');
                    break;
                  default:
                    navigate('/');
                }
                
                console.log('Login successful, redirecting...');
              } else {
                throw new Error('Failed to get user info');
              }
            } catch (userError) {
              console.error('Error getting user info:', userError);
              alert('Không thể lấy thông tin người dùng!');
              navigate('/login');
            }
          } else {
            alert('Không nhận được access token từ server!');
            navigate('/login');
          }
        } else {
          // API response không thành công
          console.error('API Error:', result.data);
          alert(result.data.message || 'Đăng nhập Google thất bại!');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during Google callback:', error);
        
        // Xử lý các loại lỗi cụ thể cho Vercel deployment
        if (error.message.includes('CORS')) {
          alert('Lỗi CORS: Không thể kết nối với server từ domain này!');
        } else if (error.message.includes('HTTPS')) {
          alert('Lỗi Mixed Content: Server cần hỗ trợ HTTPS!');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          alert('Không thể kết nối với server. Vui lòng kiểm tra:\\n1. Server có chạy không\\n2. CORS được cấu hình đúng\\n3. HTTPS được hỗ trợ');
        } else {
          alert('Có lỗi xảy ra trong quá trình đăng nhập!');
        }
        navigate('/login');
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Đang xử lý đăng nhập Google...</h2>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
          margin: '20px auto'
        }}></div>
        <p>Vui lòng đợi trong giây lát...</p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GoogleCallback;
