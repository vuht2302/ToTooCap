import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiUrl } from '@/config/api';
import GOOGLE_OAUTH_CONFIG from '../config/googleOAuth';

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

        console.log('URL params - code:', code, 'error:', error);

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

        // Thêm timeout cho API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GOOGLE_OAUTH_CONFIG.API_TIMEOUT);

        // Thử gọi trực tiếp API backend thay vì qua service
        try {
          if (GOOGLE_OAUTH_CONFIG.DEBUG) {
            console.log('Calling backend directly...');
          }
          
          const response = await fetch(GOOGLE_OAUTH_CONFIG.CALLBACK_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (GOOGLE_OAUTH_CONFIG.DEBUG) {
            console.log('Direct API response status:', response.status);
          }
          
          const data = await response.json();
          
          if (GOOGLE_OAUTH_CONFIG.DEBUG) {
            console.log('Direct API response data:', data);
          }

          if (response.ok) {
            // Xử lý các format response khác nhau
            let accessToken = data.accessToken || data.access_token || data.token;
            let refreshToken = data.refreshToken || data.refresh_token;
            let userData = data.user || data.data?.user || data.data;

            if (accessToken) {
              // Có token - lưu và lấy thông tin user
              localStorage.setItem('accessToken', accessToken);
              if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
              }

              // Nếu có user data luôn thì dùng luôn
              if (userData && userData.role) {
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                const role = userData.role;
                const redirectPath = GOOGLE_OAUTH_CONFIG.ROLE_REDIRECTS[role] || '/';
                navigate(redirectPath);
                return;
              }

              // Nếu không có user data, gọi API để lấy
              try {
                const infoRes = await fetch(apiUrl('/auth/user/get/loginUser'), {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                });

                const infoData = await infoRes.json();

                if (infoRes.ok && infoData.success && infoData.data) {
                  const role = infoData.data.role;
                  localStorage.setItem('user', JSON.stringify(infoData.data));
                  setUser(infoData.data);

                  const redirectPath = GOOGLE_OAUTH_CONFIG.ROLE_REDIRECTS[role] || '/';
                  navigate(redirectPath);
                } else {
                  alert('Không lấy được thông tin người dùng!');
                  navigate('/login');
                }
              } catch (userInfoError) {
                console.error('Error getting user info:', userInfoError);
                alert('Lỗi khi lấy thông tin người dùng!');
                navigate('/login');
              }
            } else {
              // Không có token - có thể backend trả về luôn user info
              if (userData && userData.role) {
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                const role = userData.role;
                const redirectPath = GOOGLE_OAUTH_CONFIG.ROLE_REDIRECTS[role] || '/';
                navigate(redirectPath);
              } else {
                alert('Không nhận được thông tin đăng nhập từ server!');
                navigate('/login');
              }
            }
          } else {
            alert(data.message || 'Đăng nhập Google thất bại!');
            navigate('/login');
          }
        } catch (apiError) {
          console.error('Direct API call failed:', apiError);
          
          if (apiError.name === 'AbortError') {
            alert('Kết nối quá chậm. Vui lòng thử lại!');
          } else {
            alert(`Không thể kết nối với server: ${apiError.message}`);
          }
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during Google callback:', error);
        alert('Có lỗi xảy ra trong quá trình đăng nhập!');
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
