import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/Reservation.css';

function Reservation() {
  // 예약 폼 데이터 상태 변수
  const [formData, setFormData] = useState({
    checkInDate: null, // 체크인 날짜
    checkOutDate: null, // 체크아웃 날짜
    occupants: 1, // 이용 인원 수
    customerEmail: '', // 고객 이메일
    customerName: '' // 고객 이름
  });
  
  // 예약 정보 상태 변수
  const [reservationInfo, setReservationInfo] = useState(null);
  // 서버 메시지 상태 변수 (에러 메시지, 성공 메시지 등)
  const [message, setMessage] = useState('');

  // 컴포넌트가 마운트될 때 이메일을 localStorage에서 가져와서 폼 데이터에 자동 설정
  useEffect(() => {
    const email = localStorage.getItem('customerEmail');
    if (email) {
      setFormData((prevFormData) => ({ ...prevFormData, customerEmail: email }));
    }
  }, []); // 이 effect는 처음 렌더링될 때만 실행됨

  // 날짜 범위가 변경되었을 때 실행되는 함수
  const handleDateChange = (dates) => {
    const [checkInDate, checkOutDate] = dates; // 선택된 체크인, 체크아웃 날짜
    setFormData({
      ...formData,
      checkInDate,
      checkOutDate
    });
  };

  // 폼의 입력 값이 변경되었을 때 실행되는 함수
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value // 해당 input의 name 속성을 기준으로 폼 데이터 갱신
    });
  };

  // 예약 요청을 서버에 보낼 때 실행되는 함수
  const handleReservation = async () => {
    try {
      // 예약 API 요청 보내기
      const response = await axios.post('http://localhost:8080/api/reservation/reserve', formData);
      if (response.data.result) {
        // 예약 성공 시, 예약 정보를 상태에 저장
        setReservationInfo(response.data.data);
      } else {
        // 예약 실패 시, 오류 메시지 표시
        setMessage(response.data.message);
      }
    } catch (error) {
      // 서버 오류가 발생한 경우
      setMessage('Server error occurred');
    }
  };

  // 달력 타일에 클래스를 추가하는 함수 (체크인, 체크아웃, 예약 중인 날짜 표시)
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const checkInDate = formData.checkInDate && new Date(formData.checkInDate).setHours(0, 0, 0, 0);
      const checkOutDate = formData.checkOutDate && new Date(formData.checkOutDate).setHours(0, 0, 0, 0);
      const currentDate = date.setHours(0, 0, 0, 0);

      // 체크인 날짜, 체크아웃 날짜, 그리고 그 사이 날짜에 클래스를 부여
      if (checkInDate === currentDate) {
        return 'check-in-date'; // 체크인 날짜 클래스
      }
      if (checkOutDate === currentDate) {
        return 'check-out-date'; // 체크아웃 날짜 클래스
      }
      if (checkInDate && checkOutDate && currentDate > checkInDate && currentDate < checkOutDate) {
        return 'in-between-date'; // 체크인과 체크아웃 사이 날짜 클래스
      }
    }
    return ''; // 그 외의 날짜는 기본 스타일
  };

  return (
    <div>
      <h2>호텔 예약</h2>
      <div>
        <label>이름:</label>
        <input type="text" name="customerName" onChange={handleChange} required />
      </div>
      <div>
        <label>예약 날짜:</label>
        <Calendar
          selectRange
          onChange={handleDateChange}
          value={[formData.checkInDate, formData.checkOutDate]}
          tileClassName={tileClassName}
        />
      </div>
      <div>
        <label>이용 인원 수:</label>
        <input type="number" name="occupants" min="1" onChange={handleChange} required />
      </div>
      <button onClick={handleReservation}>예약 요청</button>

      {/* 예약 정보가 있을 때 예약 확정 내용을 표시 */}
      {reservationInfo && (
        <div>
          <h3>예약 확정</h3>
          <p>객실 번호: {reservationInfo.roomNumber}</p>
          <p>체크인 날짜: {formData.checkInDate.toLocaleDateString()}</p>
          <p>체크아웃 날짜: {formData.checkOutDate.toLocaleDateString()}</p>
          <p>이용 인원 수: {formData.occupants}</p>
        </div>
      )}
      {/* 서버에서 받은 메시지 (에러 또는 정보) 출력 */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Reservation;
