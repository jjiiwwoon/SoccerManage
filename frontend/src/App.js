/**
 * ====================================
 * 파일: App.js (수정됨)
 * 위치: frontend/src/ (기존 파일 덮어쓰기)
 * 기능: 라우팅 + 네비게이션
 * ====================================
 *
 * 추가된 라우트:
 * - /players/:id → PlayerProfile (선수 개인 프로필)
 * - /gallery → MediaGallery (사진/동영상 갤러리)
 *
 * 추가된 네비게이션:
 * - 갤러리 링크
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import MemberList from './pages/MemberList';
import MatchList from './pages/MatchList';
import MatchDetail from './pages/MatchDetail';
import PlayerProfile from './pages/PlayerProfile';
import MediaGallery from './pages/MediaGallery';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="main-nav">
                    <div className="nav-brand">
                        <Link to="/">창우FC</Link>
                    </div>
                    <div className="nav-links">
                        <Link to="/">홈</Link>
                        <Link to="/members">멤버 목록</Link>
                        <Link to="/matches">경기 기록</Link>
                        <Link to="/gallery">갤러리</Link>
                    </div>
                </nav>

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/members" element={<MemberList />} />
                        <Route path="/matches" element={<MatchList />} />
                        <Route path="/matches/:id" element={<MatchDetail />} />
                        <Route path="/players/:id" element={<PlayerProfile />} />
                        <Route path="/gallery" element={<MediaGallery />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
