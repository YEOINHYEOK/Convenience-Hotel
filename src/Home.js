import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import hotelImage from './assets/hotel-image.png'; // 호텔 이미지 경로
import bookingImage from './assets/booking.png'; // 예약 이미지 경로
import './Home.css';

function Home() {
  return (
    <div className="home-background">
      <Container className="home-container">
        <h1 className="text-center home-title mb-5">Welcome to Convenience Hotel</h1>

        <Row className="gx-5">
          {/* 첫 번째 카드 - 호텔 소개 */}
          <Col md={6}>
            <Card className="custom-card shadow-lg">
              <Card.Img variant="top" src={hotelImage} alt="Hotel" className="card-image" />
              <Card.Body>
                <Card.Title className="card-title">Convenience Hotel</Card.Title>
                <Card.Text className="card-text">
                  편안한 숙박을 원하시면 Convenience Hotel에서 여유로운 시간을 보내세요. 다양한 시설과 서비스로 고객님을 맞이합니다. 지금 바로 예약하고 편안한 여행을 시작하세요!
                </Card.Text>
                <Link to="/login">
                  <Button variant="primary" className="custom-button">로그인</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* 두 번째 카드 - 예약 안내 */}
          <Col md={6}>
            <Card className="custom-card shadow-lg">
              <Card.Img variant="top" src={bookingImage} alt="Reservation" className="card-image" />
              <Card.Body>
                <Card.Title className="card-title">예약 안내</Card.Title>
                <Card.Text className="card-text">
                  간편한 예약 시스템을 통해 언제 어디서나 손쉽게 예약하세요. 방을 선택하고, 체크인 및 체크아웃 날짜를 입력하면 예약이 완료됩니다.
                </Card.Text>
                <Link to="/reservation">
                  <Button variant="secondary" className="custom-button">예약하기</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
