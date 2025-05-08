import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // 홈 페이지
import Reservation from './Reservation'; // 예약 페이지
import MyPage from './MyPage'; // 마이페이지
import Signup from './Signup'; // 회원가입 페이지
import Login from './Login'; // 로그인 페이지
import LobbyApp from './LobbyApp'; // 로비 애플리케이션 페이지
import LobbyResult from './LobbyResult'; // 로비 결과 페이지

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* 홈 페이지 */}
        <Route path="/signup" element={<Signup />} /> {/* 회원가입 페이지 */}
        <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
        <Route path="/reservation" element={<Reservation />} /> {/* 예약 페이지 */}
        <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 */}
        <Route path="/lobby" element={<LobbyApp />} /> {/* 로비 애플리케이션 */}
        <Route path="/result" element={<LobbyResult />} /> {/* 로비 결과 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
