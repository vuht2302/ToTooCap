import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiUrl } from '@/config/api';

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

        // Gọi API callback với GET method và code parameter
        console.log('Calling Google callback API...');
        const callbackUrl = `http://54.169.159.141:3000/auth/google/callback?code=${encodeURIComponent(code)}`;
        
        const response = await fetch(callbackUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('API response status:', response.status);
        const data = await response.json();
        console.log('API response data:', data);

        if (response.ok) {
          // Xử lý response thành công
          const accessToken = data.accessToken || data.access_token || data.token;
          const refreshToken = data.refreshToken || data.refresh_token;
          const userData = data.user || data.data?.user || data.data;

          if (accessToken) {
            // Lưu tokens
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }

            // Nếu có thông tin user luôn
            if (userData && userData.role) {
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
              
              // Redirect theo role
              switch (userData.role) {
                case 'admin':
                  navigate('/admin');
                  break;
                case 'manager':
                  navigate('/manager');
                  break;
                default:
                  navigate('/');
              }
              return;
            }

            // Nếu chưa có user info, gọi API để lấy
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
              } else {
                throw new Error('Failed to get user info');
              }
            } catch (userError) {
              console.error('Error getting user info:', userError);
              alert('Không thể lấy thông tin người dùng!');
              navigate('/login');
            }
          } else if (userData && userData.role) {
            // Trường hợp backend trả về thông tin user mà không có token riêng
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            switch (userData.role) {
              case 'admin':
                navigate('/admin');
                break;
              case 'manager':
                navigate('/manager');
                break;
              default:
                navigate('/');
            }
          } else {
            alert('Không nhận được thông tin đăng nhập từ server!');
            navigate('/login');
          }
        } else {
          // API response không thành công
          console.error('API Error:', data);
          alert(data.message || 'Đăng nhập Google thất bại!');
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
