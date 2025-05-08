import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Navbar, Spinner, Alert } from 'react-bootstrap';
import { QrReader } from 'react-qr-reader';

const LobbyApp = () => {
  const [isScanning, setIsScanning] = useState(false);  // 스캔 여부
  const [statusMessage, setStatusMessage] = useState('');  // 상태 메시지
  const [qrData, setQrData] = useState(null);  // QR 코드 데이터
  const [actionType, setActionType] = useState(null);  // 액션 타입 (체크인, 체크아웃)
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const navigate = useNavigate();  // 페이지 이동

  // QR 코드 인식 완료 처리
  const handleScan = async (result) => {
    if (result && !isScanning) {  // 스캔 중이 아닐 때만
      setIsScanning(true);
      setQrData(result.text);  // QR 코드 데이터 저장
      setStatusMessage("QR 코드가 인식되었습니다. 서버에 요청 중입니다...");

      try {
        setLoading(true);  // 로딩 시작
        const response = await axios.post(`http://localhost:8080/api/lobby/checkin-checkout`, {
          qrCodeData: result.text,  // QR 코드 데이터
          actionType: actionType,  // 체크인/체크아웃 구분
        });

        const data = response.data;
        if (data.result) {
          setStatusMessage(`체크 ${actionType === 'CHECK_IN' ? '인' : '아웃'} 성공: ${data.status}`);
        } else {
          setStatusMessage(data.message || '오류가 발생했습니다.');
        }
      } catch (error) {
        setStatusMessage('서버와의 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);  // 로딩 종료
        setIsScanning(false);  // 스캔 비활성화
      }
    }
  };

  // QR 코드 인식 오류 처리
  const handleError = (error) => {
    console.error('QR Reader 오류:', error);
    setStatusMessage('QR 코드 인식 중 오류가 발생했습니다.');
  };

  // 체크인 버튼 클릭 시
  const handleCheckIn = () => {
    setActionType('CHECK_IN');  // 체크인 액션 설정
    setStatusMessage('체크인용 QR 코드 스캔 중...');
    setIsScanning(false);  // 스캔 비활성화
    setQrData(null);  // QR 데이터 리셋
  };

  // 체크아웃 버튼 클릭 시
  const handleCheckOut = () => {
    setActionType('CHECK_OUT');  // 체크아웃 액션 설정
    setStatusMessage('체크아웃용 QR 코드 스캔 중...');
    setIsScanning(false);  // 스캔 비활성화
    setQrData(null);  // QR 데이터 리셋
  };

  return (
    <div>
      {/* 네비게이션 바 */}
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Navbar.Brand href="/">Convenience Hotel</Navbar.Brand>        
      </Navbar>

      <Container className="text-center">
        <h2>로비 QR 체크인/체크아웃</h2>
        <div className="d-flex justify-content-center my-3">
          <Button variant="primary" className="mx-2" onClick={handleCheckIn} disabled={loading}>
            Check In
          </Button>
          <Button variant="secondary" className="mx-2" onClick={handleCheckOut} disabled={loading}>
            Check Out
          </Button>
        </div>

        {/* 상태 메시지 표시 */}
        {statusMessage && (
          <Alert variant="info" className="mt-3">{statusMessage}</Alert>
        )}

        {/* QR Reader 컴포넌트 */}
        <div className="mt-4" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
          {actionType && !loading && (
            <QrReader
              delay={300}
              onResult={(result, error) => {
                if (!!result) handleScan(result);  // 결과 처리
                if (!!error) handleError(error);  // 오류 처리
              }}
              style={{ width: '100%' }}
            />
          )}
          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" role="status" />
              <p>QR 코드 처리 중...</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default LobbyApp;
