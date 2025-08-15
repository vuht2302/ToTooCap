import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { apiUrl } from '@/config/api';
import GoogleAuthService from '../services/googleAuth.service';

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

        if (error) {
          console.error('Google OAuth error:', error);
          alert('Đăng nhập Google thất bại!');
          navigate('/login');
          return;
        }

        if (!code) {
          alert('Không nhận được mã xác thực từ Google!');
          navigate('/login');
          return;
        }

        // Gửi code đến backend để xử lý
        const result = await GoogleAuthService.handleGoogleCallback(code);

        if (result.success) {
          const data = result.data;
          // Lưu token vào localStorage
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          // Gọi API để lấy thông tin user
          const infoRes = await fetch(apiUrl('/auth/user/get/loginUser'), {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${data.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          const infoData = await infoRes.json();

          if (infoRes.ok && infoData.success && infoData.data) {
            const role = infoData.data.role;
            localStorage.setItem('user', JSON.stringify(infoData.data));
            setUser(infoData.data);

            // Chuyển hướng dựa trên role
            if (role === 'customer') {
              navigate('/');
            } else if (role === 'manager') {
              navigate('/manager');
            } else if (role === 'admin') {
              navigate('/admin');
            }
          } else {
            alert(infoData.message || 'Không lấy được thông tin người dùng!');
            navigate('/login');
          }
        } else {
          alert(result.error || 'Đăng nhập Google thất bại!');
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
