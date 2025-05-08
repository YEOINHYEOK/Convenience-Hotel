import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';
import './MyPage.css';  // CSS 파일을 import

// 네비게이션 바 컴포넌트
function Navigation() {
  return (
    <header className="navbar">
      <h1 className="logo">Convenience Hotel</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">메인</Link></li>
          <li><Link to="/mypage">마이페이지</Link></li>
          <li><Link to="/reservation">예약하기</Link></li>
          <li><Link to="/lobby">로비</Link></li>
        </ul>
      </nav>
    </header>
  );
}

// 마이 페이지 컴포넌트
function MyPage() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      navigate('/login'); // 로그인되지 않았다면 로그인 페이지로 리디렉션
      return;
    }

    const fetchReservationData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reservation/my-reservation?customerEmail=${encodeURIComponent(email)}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        if (response.data.result) {
          setReservations(response.data.data);
        } else {
          setMessage(response.data.message || '예약 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('예약 데이터 가져오기 오류:', error);
        setMessage('서버 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [navigate]);

  const handleSendToEmail = async (room) => {
    const emailData = {
      recipient: 'yjg9993@gmail.com',
      subject: 'Your QR Code for Check-in',
      content: `Here is your QR code for check-in: http://localhost:8080/checkin/${room.customerEmail}-${String(room.roomNumber)}`,
      qrCodeText: `http://localhost:8080/checkin/${room.customerEmail}-${String(room.roomNumber)}`
    };

    try {
      const response = await axios.post(
        'http://localhost:8080/api/send-email',
        emailData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setMessage('QR 코드가 이메일로 전송되었습니다.');
      } else {
        setMessage('이메일 전송 실패: ' + (response.data.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('이메일 전송 오류:', error);
      setMessage('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  const handleQrModal = (room) => {
    const qrCodeUrl = `http://localhost:8080/checkin/${room.customerEmail}-${String(room.roomNumber)}`;
    setQrCodeData(qrCodeUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (reservations.length === 0) {
    return <div>예약 내역이 없습니다.</div>;
  }

  return (
    <div>
      <Navigation /> {/* 네비게이션 바 통합 */}
      <Container className="custom-container mt-5">
        <h2 className="text-center mb-4">나의 예약 정보</h2>

        <Row className="mb-4">
          <Col md={12} lg={12} className="mx-auto">
            <Card className="shadow-lg border-0 rounded-xl">
              <Card.Body>
                <Table striped bordered hover responsive variant="light">
                  <thead>
                    <tr>
                      <th>방 번호</th>
                      <th>QR 코드</th>
                      <th>이메일 전송</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation, index) => (
                      <tr key={reservation.roomNumber || index}>
                        <td>{reservation.roomNumber}</td>
                        <td>
                          <Button 
                            variant="info" 
                            onClick={() => handleQrModal(reservation)} 
                            className="w-100"
                          >
                            QR 코드 보기
                          </Button>
                        </td>
                        <td>
                          <Button 
                            variant="success" 
                            onClick={() => handleSendToEmail(reservation)} 
                            className="w-100"
                          >
                            이메일 전송
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>QR 코드</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-4">
            {qrCodeData && <QRCode value={qrCodeData} size={256} />}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>

        {message && (
          <Alert variant="info" className="mt-3">
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
}

export default MyPage;
