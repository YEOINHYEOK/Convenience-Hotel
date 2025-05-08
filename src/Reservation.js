import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Reservation.css";
import image1 from './assets/luxury-hotel-bg.jpg'; // 배경 이미지 경로

function Reservation() {
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    occupants: "",
  });
  const [paymentStatus, setPaymentStatus] = useState(false);  // 결제 상태
  const [reservationCode, setReservationCode] = useState("");  // 예약 코드
  const [roomNumber, setRoomNumber] = useState("");  // 방 번호
  const [responseMessage, setResponseMessage] = useState("");  // 메시지
  const [userEmail, setUserEmail] = useState("");  // 사용자 이메일
  const [userName, setUserName] = useState("");  // 사용자 이름

  // 사용자 정보를 로컬 스토리지에서 가져오기
  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // 로그인한 사용자의 이메일을 가져옴
    const name = localStorage.getItem("userName"); // 로그인한 사용자의 이름을 가져옴
    if (email && name) {
      setUserEmail(email);
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotalPrice = () => {
    const pricePerPerson = 100;  // 1인당 가격
    return formData.occupants * pricePerPerson;
  };

  const handleReservationAndPayment = (e) => {
    e.preventDefault();
    
    // 결제 금액 계산
    const totalPrice = calculateTotalPrice();
    if (totalPrice < 0) {
      setResponseMessage("결제 금액이 잘못되었습니다.");
      return;
    }

    // Iamport 결제 API 호출
    const IMP = window.IMP;
    IMP.init("imp53474078");

    IMP.request_pay(
      {
        pg: "uplus",
        pay_method: "card",
        name: "호텔 예약",  // 상품명
        amount: totalPrice,  // 결제 금액
        buyer_tel: "010-1234-5678",
        buyer_addr: "서울시 강남구",
        buyer_postcode: "12345",
      },
      async (rsp) => {
        if (rsp.success) {
          // 결제 성공 시 예약 정보 서버에 저장
          const reservationData = {
            checkInDate: formData.checkInDate,
            checkOutDate: formData.checkOutDate,
            occupants: formData.occupants,
            customerEmail: userEmail,  // 로그인된 사용자 이메일
            customerName: userName,  // 로그인된 사용자 이름
          };

          try {
            const response = await axios.post("http://localhost:8080/api/reservation/reserve", reservationData);
            if (response.status === 200) {
              setReservationCode(response.data.data.roomNumber);  // 방 번호
              setRoomNumber(response.data.data.roomNumber);  // 예약 코드
              setResponseMessage(`결제가 완료되었습니다! 예약 코드: ${response.data.data.roomNumber}, 방 번호: ${response.data.data.roomNumber}`);
            }
          } catch (error) {
            setResponseMessage("예약 저장 실패: " + error.message);
          }
        } else {
          setResponseMessage(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );
  };

  return (
    <div>
      {/* 네비게이션 */}
      <header className="navbar">
        <h1 className="logo">Convenience Hotel</h1>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">메인</Link></li>
            <li><Link to="/mypage">마이페이지</Link></li>
            <li><Link to="/reservation">예약하기</Link></li>
          </ul>
        </nav>
      </header>

      {/* 고급 배경 이미지 */}
      <div className="reservation-background" style={{ backgroundImage: `url(${image1})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '70vh', filter: 'brightness(0.6)' }}>
        <div className="overlay">
          <h2 className="text-center text-white pt-5 display-3" style={{ fontFamily: 'Playfair Display, serif' }}>Welcome to Luxury</h2>
          <h3 className="text-center text-white">Your perfect stay awaits</h3>
        </div>
      </div>

      {/* 예약 폼 섹션 */}
      <Container className="reservation-container mt-5">
        <Row className="gx-5 justify-content-center">
          <Col md={6} className="d-flex justify-content-center">
            <div className="reservation-form shadow-lg p-5 rounded bg-white opacity-90">
              <Form onSubmit={handleReservationAndPayment}>
                <h3 className="text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>호텔 예약</h3>
                <Form.Group controlId="checkInDate">
                  <Form.Label>체크인 날짜</Form.Label>
                  <Form.Control
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    required
                    className="rounded-pill border-dark shadow-sm"
                    style={{ fontSize: '18px' }}
                  />
                </Form.Group>
                <Form.Group controlId="checkOutDate" className="mt-3">
                  <Form.Label>체크아웃 날짜</Form.Label>
                  <Form.Control
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    required
                    className="rounded-pill border-dark shadow-sm"
                    style={{ fontSize: '18px' }}
                  />
                </Form.Group>
                <Form.Group controlId="occupants" className="mt-3">
                  <Form.Label>인원 수</Form.Label>
                  <Form.Control
                    type="number"
                    name="occupants"
                    value={formData.occupants}
                    onChange={handleChange}
                    required
                    className="rounded-pill border-dark shadow-sm"
                    style={{ fontSize: '18px' }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3 w-100 py-3 rounded-pill" style={styles.button}>
                  예약하기
                </Button>
              </Form>

              {/* 결제 후 표시되는 예약 코드와 방 번호 */}
              {reservationCode && roomNumber && (
                <div className="mt-4 text-center">
                  <h3 style={styles.reservationText}>예약 코드: {reservationCode}</h3>
                  <h4>방 번호: {roomNumber}</h4>
                </div>
              )}

              {/* 메시지 표시 */}
              {responseMessage && (
                <Alert variant="info" className="mt-4" style={styles.alertMessage}>
                  {responseMessage}
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const styles = {
  button: {
    background: 'linear-gradient(90deg, #1abc9c, #16a085)',
    fontSize: '18px',
    border: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  reservationText: {
    fontWeight: '700',
    color: '#2C3E50',
    fontSize: '26px',
  },
  alertMessage: {
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#dff0d8',
    color: '#3c763d',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default Reservation;
