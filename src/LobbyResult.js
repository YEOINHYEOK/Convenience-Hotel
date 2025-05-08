import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Button } from 'react-bootstrap';

const LobbyResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrData, actionType } = location.state || {};
  const [remainingTime, setRemainingTime] = useState(30);

  const extractDetails = (qrData) => {
    if (!qrData) return { email: '', roomNumber: '' };
    const [email, roomNumber] = qrData.split('-');
    return { email, roomNumber };
  };

  const { email, roomNumber } = extractDetails(qrData);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/lobby');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  if (!qrData || !actionType) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">잘못된 접근입니다. 다시 시도해주세요.</Alert>
      </Container>
    );
  }

  const resultMessage = actionType === 'CHECK_IN' ? '체크인 되었습니다.' : '체크아웃 되었습니다.';

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={styles.container} // 스타일 변경
    >
      <Card style={styles.card}>
        <Card.Header as="h4" style={styles.cardHeader}>
          {`${actionType === 'CHECK_IN' ? '체크인' : '체크아웃'} 결과`}
        </Card.Header>
        <Card.Body>
          <Card.Text style={styles.cardText}>
            <strong>고객명:</strong> {email}<br />
            <strong>방번호:</strong> {roomNumber}
          </Card.Text>
          <Alert variant={actionType === 'CHECK_IN' ? 'success' : 'info'} style={styles.alert}>
            {resultMessage}
          </Alert>
          <p className="mt-3" style={styles.timerText}>
            남은 시간: <strong>{remainingTime}</strong>초
          </p>
          <Button variant="primary" onClick={() => navigate('/lobby')} style={styles.button}>
            로비로 돌아가기
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

const styles = {
  container: {
    minHeight: '100vh', // 전체 화면 높이
    display: 'flex', // 플렉스 박스
    justifyContent: 'center', // 수평 중앙 정렬
    alignItems: 'center', // 수직 중앙 정렬
    backgroundColor: '#f8f9fa', // 배경색 추가 (선택 사항)
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    backgroundColor: '#1abc9c',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: '600',
    padding: '20px',
  },
  cardText: {
    fontSize: '1.1rem',
    fontWeight: '500',
    lineHeight: '1.6',
  },
  alert: {
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '20px',
  },
  timerText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#e74c3c',
  },
  button: {
    backgroundColor: '#3498db',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '5px',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
};

export default LobbyResult;
