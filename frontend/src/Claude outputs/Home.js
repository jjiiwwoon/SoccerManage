/**
 * ====================================
 * 파일: Home.js (새 파일)
 * 위치: frontend/src/pages/
 * 기능: 홈 페이지 (메인 화면)
 * ====================================
 */
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <h1>창우FC</h1>
            <p>축구동호회 팀 관리 시스템</p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                marginTop: '40px',
                flexWrap: 'wrap'
            }}>
                <Link to="/members" style={{
                    padding: '15px 30px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '1.1em',
                    transition: 'background-color 0.3s'
                }}>
                    멤버 목록
                </Link>
                <Link to="/matches" style={{
                    padding: '15px 30px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '1.1em'
                }}>
                    경기 기록
                </Link>
                <Link to="/gallery" style={{
                    padding: '15px 30px',
                    backgroundColor: '#9b59b6',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '1.1em'
                }}>
                    갤러리
                </Link>
            </div>
        </div>
    );
}

export default Home;
