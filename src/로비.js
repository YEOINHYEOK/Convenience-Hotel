import React, { useState, useEffect } from 'react';  // React 라이브러리와 useState, useEffect 훅을 import
import { useNavigate } from 'react-router-dom';  // react-router-dom에서 useNavigate를 import하여 페이지 이동 기능 사용
import axios from 'axios';  // axios를 import하여 HTTP 요청을 보낼 수 있도록 설정
import { Container, Button, Navbar, Spinner, Alert } from 'react-bootstrap';  // react-bootstrap에서 필요한 컴포넌트들을 import
import { QrReader } from 'react-qr-reader';  // QR 코드를 읽을 수 있는 QrReader 컴포넌트를 import

const LobbyApp = () => {
  const [scanEnable, setScanEnable] = useState(false); // QR 코드 스캔 가능 여부 초기화
  const [statusMessage, setStatusMessage] = useState(''); // 상태 메시지 초기화
  const [debugMessage, setDebugMessage] = useState(''); // 디버깅 메시지 초기화
  const [qrData, setQrData] = useState(null); // QR 코드 데이터 초기화
  const [actionType, setActionType] = useState(null); // 액션 타입(체크인/체크아웃) 초기화
  const [loading, setLoading] = useState(false); // 로딩 상태 초기화
  const navigate = useNavigate();  // useNavigate를 사용하여 페이지 이동 기능 설정

  // useEffect(() => {
  //   if (loading) { // QR 코드 처리 중일 때 서버에 요청을 보냄
  //     try {        
  //       const response = axios.post(`http://localhost:8080/api/lobby/checkin-checkout`, {
  //         qrCodeData: qrData.text,
  //         actionType: actionType
  //       });
  //       const data = response.data;
  //       if (data.result) {
  //         setStatusMessage(`체크 ${actionType === 'CHECK_IN' ? '인' : '아웃'} 성공: ${data.message}`);
  //       } else {
  //         setStatusMessage(data.message);
  //       }
  //     } catch (error) {
  //       // 오류 처리
  //       console.error(`오류가 발생했습니다(${error}). ${qrData.text} ${actionType} `);
  //     } finally {
  //       setActionType(null);
  //       setLoading(false);  // 로딩 상태 리셋
  //       setQrData(null);  // QR 데이터 리셋
  //     }
  //   }
  // }, [loading]);

  useEffect(() => {
    setDebugMessage(`scanEnable: ${scanEnable} `);  // scanEnable 상태가 바뀔 때마다 디버깅 메시지 출력
  }, [setScanEnable]);

  // QR 코드 인식이 완료되면 처리 함수
  const handleScan = async (result) => {  
    if (result && scanEnable) {  // QR 코드가 인식되었고 스캔이 활성화된 경우
      setQrData(result);  // QR 코드 데이터 저장
      try {        
        // 서버에 체크인/체크아웃 요청을 보냄
        const response = axios.post(`http://localhost:8080/api/lobby/checkin-checkout`, {
          qrCodeData: qrData.text,
          actionType: actionType
        });
        const data = response.data;
        if (data.result) {
          console.error(`체크 ${actionType === 'CHECK_IN' ? '인' : '아웃'} 성공: ${data.message}`);  // 성공 메시지 출력
        } else {
          console.error(`오류가 발생했습니다(${data.message})`);  // 실패 메시지 출력
        }
      } catch (error) {
        console.error(`오류가 발생했습니다(${error})`);  // 오류 발생 시 메시지 출력
      } finally {
        setScanEnable(false);  // 스캔 비활성화
        setActionType(null);  // 액션 타입 리셋
        setLoading(false);  // 로딩 상태 리셋
        setQrData(null);  // QR 데이터 리셋
      }
    }
  };

  // QR 코드 인식 오류 처리 함수
  const handleError = (error) => {
    console.error('QR Reader 오류:', error);  // 오류 콘솔 출력
    setStatusMessage('QR 코드를 제시해 주세요.');  // 상태 메시지 변경
  };

  // 체크인 버튼 클릭 시
  const handleCheckIn = () => {
    setActionType('CHECK_IN');  // 액션 타입을 CHECK_IN으로 설정
    setQrData(null);  // QR 데이터 리셋
    setStatusMessage('체크인용 QR 코드 스캔 중...');  // 상태 메시지 설정
    setScanEnable(true);  // 스캔 활성화
  };

  // 체크아웃 버튼 클릭 시
  const handleCheckOut = () => {
    setActionType('CHECK_OUT');  // 액션 타입을 CHECK_OUT으로 설정
    setQrData(null);  // QR 데이터 리셋
    setStatusMessage('체크아웃용 QR 코드 스캔 중...');  // 상태 메시지 설정
    setScanEnable(true);  // 스캔 활성화
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
          {/* 체크인, 체크아웃 버튼 */}
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
          {scanEnable && (           
            <QrReader
              delay={300}  // 300ms 지연 시간
              onResult={(result, error) => {
                if (!!result) handleScan(result);  // 결과가 있으면 handleScan 호출
                if (!!error) handleError(error);  // 오류가 있으면 handleError 호출
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
