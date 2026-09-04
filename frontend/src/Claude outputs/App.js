/**
 * ====================================
 * 파일: App.js (수정됨)
 * 위치: frontend/src/App.js (기존 파일 덮어쓰기)
 * 분야: 프론트엔드 (메인)
 * 기능: 전체 페이지 구조와 페이지 이동(라우팅) 설정
 * ====================================
 *
 * 기존에 홈(/)과 멤버 목록(/members)만 있었는데,
 * 경기 기록(/matches)과 경기 상세(/matches/:id)를 추가했어.
 *
 * :id 는 "동적 파라미터"라고 해.
 * /matches/1 이면 id=1, /matches/5 이면 id=5가 되는 거야.
 * Android에서 Intent에 putExtra("id", 1) 했던 거랑 비슷해.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MemberList from './pages/MemberList';
import MatchList from './pages/MatchList';
import MatchDetail from './pages/MatchDetail';
import './App.css';

function App() {
    return (
        <Router>
            {/* 상단 네비게이션 바 */}
            <nav className="navbar">
                <h1 className="logo">⚽ TeamManage</h1>
                <div className="nav-links">
                    <Link to="/">홈</Link>
                    <Link to="/members">멤버 목록</Link>
                    <Link to="/matches">경기 기록</Link>
                </div>
            </nav>

            {/* 페이지 내용 */}
            <div className="content">
                <Routes>
                    <Route path="/" element={
                        <div className="home">
                            <h2>우리 팀에 오신 것을 환영합니다!</h2>
                            <p>팀 멤버 관리, 경기 기록, 개인 스탯을 한 곳에서 관리하세요.</p>
                        </div>
                    } />
                    <Route path="/members" element={<MemberList />} />
                    <Route path="/matches" element={<MatchList />} />
                    <Route path="/matches/:id" element={<MatchDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
