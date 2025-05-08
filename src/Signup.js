import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './assets/signup-background.jpg'; // 배경 이미지

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'customer',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const response = await fetch('http://localhost:8080/api/auth/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('회원가입 성공');
      navigate('/');
    } else {
      alert('회원가입 실패');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div> {/* 배경 오버레이 */}
      <div style={styles.box}>
        <h1 style={styles.header}>회원가입</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
            style={styles.input}
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            style={styles.input}
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호를 확인하세요"
            style={styles.input}
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="전화번호를 입력하세요"
            style={styles.input}
          />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="customer">고객</option>
            <option value="admin">관리자</option>
          </select>
          <button type="submit" style={styles.button}>회원가입</button>
        </form>
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
  select: {
    marginBottom: '15px',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    fontFamily: `'Roboto', sans-serif`,
    backgroundColor: '#fff',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default Signup;
