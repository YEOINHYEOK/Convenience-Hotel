import React, { useState, useRef } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { QrReader } from 'react-qr-reader';


const LobbyApp = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);
  const processingRef = useRef(false);
  const lastScannedRef = useRef(null);
  const navigate = useNavigate();

  function Navigation() {
    return (
      <header className="navbar">
        <ul className="nav-links">
          {/* 수정된 링크 */}
          <li>
            <Link to="/" onClick={() => navigate('/')}>메인</Link>
          </li>
        </ul>
      </header>
    );
  }

  
  const handleScan = async (result) => {
    if (!result || processingRef.current) return;

    const scannedText = result.text;

    if (scannedText === lastScannedRef.current) {
      if (!isScanning) {
        console.log('이미 처리된 QR 코드입니다:', scannedText);
        return;
      }
      setIsScanning(false);
      return;
    }

    processingRef.current = true;
    setStatusMessage('QR 코드가 인식되었습니다. 서버에 요청 중입니다...');
    lastScannedRef.current = scannedText;

    try {
      setLoading(true);

      const response = await axios.post('http://localhost:8080/api/lobby/checkin-checkout', {
        qrCodeData: scannedText,
        actionType: actionType,
      });
      const data = response.data;

      const resultMessage = data.result
        ? `체크 ${actionType === 'CHECK_IN' ? '인' : '아웃'} 성공: ${data.message}`
        : `체크 ${actionType === 'CHECK_IN' ? '인' : '아웃'} 실패: ${data.message}`;

      setStatusMessage(resultMessage);
      navigate('/result', {
        state: { qrData: scannedText, actionType, resultMessage },
      });
    } catch (error) {
      const errorMessage = `체크 ${actionType === 'CHECK_IN' ? '인' : '아웃'} 실패: ${error.message}`;
      setStatusMessage(errorMessage);
      navigate('/result', {
        state: { qrData: scannedText, actionType, resultMessage: errorMessage },
      });
    } finally {
      setLoading(false);
      processingRef.current = false;
      setIsScanning(false);
    }
  };

  const handleError = (error) => {
    console.error('QR Reader 오류:', error);
    setStatusMessage('QR 코드를 카메라 화면에 제시해 주세요.');
  };

  const handleAction = (type) => {
    setActionType(type);
    setStatusMessage(`${type === 'CHECK_IN' ? '체크인' : '체크아웃'}용 QR 코드 스캔 중...`);
    setIsScanning(true);
    lastScannedRef.current = null;
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center text-center"
      style={styles.container}
    >
      <div style={styles.cardWrapper}>
        <h2 style={styles.heading}>로비 QR 체크인/체크아웃</h2>

        {/* 상태 메시지 */}
        <div className="my-3">
          {statusMessage && (
            <Alert variant="info" style={styles.alert}>
              {statusMessage}
            </Alert>
          )}
        </div>

        {/* 카드 형태로 버튼 영역 */}
        <Card style={styles.card}>
          <Card.Body>
            <div
              className="d-flex justify-content-center align-items-center"
              style={styles.buttonContainer}
            >
              <Button
                variant="primary"
                onClick={() => handleAction('CHECK_IN')}
                disabled={loading}
                style={styles.button}
              >
                체크인
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleAction('CHECK_OUT')}
                disabled={loading}
                style={styles.button}
              >
                체크아웃
              </Button>
              <Button
                variant="secondary"
                Link to="/" onClick={() => navigate('/')}
                style={styles.button}
              >
                예약화면 돌아가기
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* QR 코드 리더 */}
        <div className="mt-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
          {!!actionType && isScanning && !loading && (
            <QrReader
              delay={300}
              facingMode="environment"
              onResult={(result, error) => {
                if (result) handleScan(result);
                if (error) handleError(error);
              }}
              style={styles.qrReader}
            />
          )}

          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" role="status" />
              <p>QR 코드 처리 중...</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

const styles = {
  container: {
    minHeight: '100vh',  // 전체 화면 크기
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(https://www.example.com/your-lobby-background.jpg)', // 로비 배경 이미지
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: 0, // 여백 제거
  },
  cardWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 카드 배경을 살짝 투명하게 하여 로비 이미지가 살짝 보이도록
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '600px',
    textAlign: 'center',
  },
  heading: {
    fontFamily: 'Roboto, sans-serif',
    color: '#2c3e50',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  alert: {
    minWidth: '300px',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  button: {
    background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
    border: 'none',
    color: 'white',
    width: '200px',
    fontSize: '16px',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  },
  qrReader: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    border: '2px solid #dfe6e9',
  },
};

export default LobbyApp;
