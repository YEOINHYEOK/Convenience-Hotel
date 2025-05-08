import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './assets/background.jpg'; // 배경 이미지 추가

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로그인 API 호출
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const data = await response.json();
      // 로그인 성공 시 이메일을 localStorage에 저장
      localStorage.setItem('userEmail', loginData.email);
      alert('로그인 성공');
      navigate('/'); // 로그인 성공 후 Home 페이지로 이동
    } else {
      alert('로그인 실패');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div> {/* 반투명 오버레이 */}
      <div style={styles.box}>
        <h1 style={styles.header}>Convenience Hotel</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>로그인</button>
        </form>

        <p style={styles.signupLink}>
          아직 회원이 아니신가요? <Link to="/signup" style={styles.link}>회원가입</Link>
        </p>

        <p style={styles.homeLink}>
          <Link to="/" style={styles.link}>홈으로 가기</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  box: {
    position: 'relative',
    zIndex: 2,
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  header: {
    fontSize: '36px',
    marginBottom: '30px',
    color: '#333',
    fontWeight: 'bold',
    fontFamily: `'Playfair Display', serif`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    transition: '0.3s',
    fontFamily: `'Roboto', sans-serif`,
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#007bff',
    boxShadow: '0 0 8px rgba(0, 123, 255, 0.5)',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: '0.3s',
    width: '100%',
    fontWeight: 'bold',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  signupLink: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555',
  },
  homeLink: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  linkHover: {
    textDecoration: 'underline',
  },
};

export default Login;
