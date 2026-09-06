/**
 * ====================================
 * 파일: Home.js (수정됨)
 * 위치: frontend/src/pages/Home.js
 * 기능: 메인 홈 페이지
 * ====================================
 *
 * 변경사항:
 * 1. 히어로 영역 → 팀 소개 영역 (사진 + 소개글 + 링크, 편집 가능)
 * 2. 통계 바 제거
 * 3. 퀵 링크에 갤러리 추가
 * 4. 최근 경기 결과 → 다가오는 경기(가장 가까운 예정 경기) 표시
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../api/matchApi';
import { getTeamInfo, updateTeamInfo, uploadTeamPhoto, deleteTeamPhoto } from '../api/teamInfoApi';

function Home() {
    const [matches, setMatches] = useState([]);
    const [teamInfo, setTeamInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [savingInfo, setSavingInfo] = useState(false);
    const photoInput = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [matchData, infoData] = await Promise.all([
                    getMatches(),
                    getTeamInfo(),
                ]);
                setMatches(matchData);
                setTeamInfo(infoData);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // 다가오는 경기 (오늘 이후 예정된 경기 중 가장 가까운 것)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingMatches = matches
        .filter(m => {
            const matchDate = new Date(m.matchDate);
            matchDate.setHours(0, 0, 0, 0);
            // 예정 경기(score가 null) 또는 오늘 이후 경기
            return (m.ourScore === null || m.ourScore === undefined) && matchDate >= today;
        })
        .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));

    const nextMatch = upcomingMatches[0] || null;

    // 최근 완료된 경기 3개
    const recentResults = matches
        .filter(m => m.ourScore !== null && m.ourScore !== undefined)
        .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
        .slice(0, 3);

    // 결과 판별
    function getResult(match) {
        if (match.ourScore > match.opponentScore) return 'win';
        if (match.ourScore === match.opponentScore) return 'draw';
        return 'lose';
    }

    function getResultLabel(match) {
        const r = getResult(match);
        if (r === 'win') return '승';
        if (r === 'draw') return '무';
        return '패';
    }

    // D-day 계산
    function getDday(dateStr) {
        const matchDate = new Date(dateStr);
        matchDate.setHours(0, 0, 0, 0);
        const diff = Math.ceil((matchDate - today) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'D-DAY';
        return `D-${diff}`;
    }

    // 날짜 포맷
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${days[d.getDay()]})`;
    }

    // 편집 모드 진입
    function startEdit() {
        setEditData({
            teamName: teamInfo?.teamName || '',
            description: teamInfo?.description || '',
            link1: teamInfo?.link1 || '',
            link1Label: teamInfo?.link1Label || '',
            link2: teamInfo?.link2 || '',
            link2Label: teamInfo?.link2Label || '',
            link3: teamInfo?.link3 || '',
            link3Label: teamInfo?.link3Label || '',
        });
        setEditMode(true);
    }

    // 팀 정보 저장
    async function handleSaveInfo(e) {
        e.preventDefault();
        setSavingInfo(true);
        try {
            const updated = await updateTeamInfo(editData);
            setTeamInfo(updated);
            setEditMode(false);
        } catch (err) {
            console.error('저장 실패:', err);
            alert('저장에 실패했습니다.');
        } finally {
            setSavingInfo(false);
        }
    }

    // 팀 사진 업로드
    async function handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const updated = await uploadTeamPhoto(file);
            setTeamInfo(updated);
        } catch (err) {
            console.error('사진 업로드 실패:', err);
            alert('사진 업로드에 실패했습니다.');
        }
    }

    // 팀 사진 삭제
    async function handlePhotoDelete() {
        if (!window.confirm('팀 사진을 삭제하시겠습니까?')) return;
        try {
            await deleteTeamPhoto();
            setTeamInfo(prev => ({ ...prev, photoBase64: null, photoFileName: null }));
        } catch (err) {
            console.error('사진 삭제 실패:', err);
        }
    }

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="home-page">
            {/* ===== 팀 소개 영역 ===== */}
            <div className="team-intro-section">
                {/* 팀 사진 */}
                <div className="team-photo-area">
                    {teamInfo?.photoBase64 ? (
                        <div className="team-photo-wrapper">
                            <img
                                src={teamInfo.photoBase64}
                                alt="팀 사진"
                                className="team-photo"
                            />
                            <div className="team-photo-actions">
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => photoInput.current?.click()}
                                >
                                    변경
                                </button>
                                <button
                                    className="btn btn-sm btn-outline"
                                    style={{ color: 'var(--color-fw)' }}
                                    onClick={handlePhotoDelete}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="team-photo-placeholder"
                            onClick={() => photoInput.current?.click()}
                        >
                            <div className="placeholder-icon">📷</div>
                            <div className="placeholder-text">팀 사진 등록</div>
                        </div>
                    )}
                    <input
                        ref={photoInput}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                    />
                </div>

                {/* 팀 정보 */}
                <div className="team-info-area">
                    {!editMode ? (
                        <>
                            <div className="team-intro-header">
                                <h1 className="team-intro-name">
                                    {teamInfo?.teamName || '창우FC'}
                                </h1>
                                <button
                                    className="btn btn-sm btn-outline"
                                    onClick={startEdit}
                                >
                                    ✏️ 편집
                                </button>
                            </div>
                            <p className="team-intro-desc">
                                {teamInfo?.description || '팀 소개글을 입력해주세요.'}
                            </p>
                            <div className="team-links">
                                {teamInfo?.link1 && (
                                    <a href={teamInfo.link1} target="_blank" rel="noopener noreferrer" className="team-link">
                                        🔗 {teamInfo.link1Label || teamInfo.link1}
                                    </a>
                                )}
                                {teamInfo?.link2 && (
                                    <a href={teamInfo.link2} target="_blank" rel="noopener noreferrer" className="team-link">
                                        🔗 {teamInfo.link2Label || teamInfo.link2}
                                    </a>
                                )}
                                {teamInfo?.link3 && (
                                    <a href={teamInfo.link3} target="_blank" rel="noopener noreferrer" className="team-link">
                                        🔗 {teamInfo.link3Label || teamInfo.link3}
                                    </a>
                                )}
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSaveInfo} className="team-edit-form">
                            <div className="form-group">
                                <label className="form-label">팀 이름</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editData.teamName}
                                    onChange={e => setEditData({ ...editData, teamName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">팀 소개</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    placeholder="팀 소개를 입력하세요"
                                    value={editData.description}
                                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>
                            <div className="form-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                                <div className="form-group">
                                    <label className="form-label">링크1 이름</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="인스타그램"
                                        value={editData.link1Label}
                                        onChange={e => setEditData({ ...editData, link1Label: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">링크1 URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://..."
                                        value={editData.link1}
                                        onChange={e => setEditData({ ...editData, link1: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">링크2 이름</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="카카오톡"
                                        value={editData.link2Label}
                                        onChange={e => setEditData({ ...editData, link2Label: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">링크2 URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://..."
                                        value={editData.link2}
                                        onChange={e => setEditData({ ...editData, link2: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">링크3 이름</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="네이버 카페"
                                        value={editData.link3Label}
                                        onChange={e => setEditData({ ...editData, link3Label: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">링크3 URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://..."
                                        value={editData.link3}
                                        onChange={e => setEditData({ ...editData, link3: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setEditMode(false)}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-gold"
                                    disabled={savingInfo}
                                >
                                    {savingInfo ? '저장 중...' : '저장'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ===== 다가오는 경기 ===== */}
            <div className="card upcoming-match-card" style={{ marginBottom: '24px' }}>
                <div className="card-title">다가오는 경기</div>
                {nextMatch ? (
                    <div className="upcoming-match-content">
                        <div className="upcoming-dday">
                            <span className="dday-badge">{getDday(nextMatch.matchDate)}</span>
                        </div>
                        <div className="upcoming-match-info">
                            <div className="upcoming-date">
                                {formatDate(nextMatch.matchDate)}
                                {nextMatch.matchTime && (
                                    <span className="upcoming-time"> {nextMatch.matchTime}</span>
                                )}
                            </div>
                            <div className="upcoming-teams">
                                <span className="upcoming-our-team">창우FC</span>
                                <span className="upcoming-vs">VS</span>
                                <span className="upcoming-opponent">{nextMatch.opponent}</span>
                            </div>
                            {nextMatch.location && (
                                <div className="upcoming-location">
                                    📍 {nextMatch.location}
                                </div>
                            )}
                            {nextMatch.memo && (
                                <div className="upcoming-memo">
                                    {nextMatch.memo}
                                </div>
                            )}
                        </div>
                        <Link to="/schedule" className="btn btn-sm btn-outline" style={{ flexShrink: 0 }}>
                            일정 보기 →
                        </Link>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                        예정된 경기가 없습니다.
                        <Link
                            to="/schedule"
                            style={{ display: 'block', marginTop: '8px', color: 'var(--color-gold)', fontSize: '0.85rem' }}
                        >
                            일정 등록하러 가기 →
                        </Link>
                    </div>
                )}
            </div>

            {/* ===== 퀵 링크 ===== */}
            <div className="quick-links">
                <Link to="/team-records" className="quick-link-card">
                    <div className="quick-link-icon">📊</div>
                    <div className="quick-link-title">팀기록</div>
                    <div className="quick-link-desc">팀 전적 및 경기 결과</div>
                </Link>
                <Link to="/player-stats" className="quick-link-card">
                    <div className="quick-link-icon">👤</div>
                    <div className="quick-link-title">개인기록</div>
                    <div className="quick-link-desc">선수별 상세 기록</div>
                </Link>
                <Link to="/squad" className="quick-link-card">
                    <div className="quick-link-icon">🏃</div>
                    <div className="quick-link-title">스쿼드</div>
                    <div className="quick-link-desc">팀원 관리</div>
                </Link>
                <Link to="/schedule" className="quick-link-card">
                    <div className="quick-link-icon">📅</div>
                    <div className="quick-link-title">일정</div>
                    <div className="quick-link-desc">경기 일정 캘린더</div>
                </Link>
                <Link to="/gallery" className="quick-link-card">
                    <div className="quick-link-icon">📸</div>
                    <div className="quick-link-title">갤러리</div>
                    <div className="quick-link-desc">사진 · 동영상</div>
                </Link>
            </div>

            {/* ===== 최근 경기 결과 (간략) ===== */}
            {recentResults.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div className="card-title" style={{ marginBottom: 0 }}>최근 경기 결과</div>
                        <Link to="/team-records" style={{ color: 'var(--color-gold)', fontSize: '0.85rem' }}>
                            전체 보기 →
                        </Link>
                    </div>
                    {recentResults.map((match) => (
                        <div key={match.id} className="match-row">
                            <div className="match-result-bar" style={{
                                backgroundColor: `var(--color-${getResult(match)})`
                            }} />
                            <div className="match-date-col">
                                {match.matchDate}
                            </div>
                            <div className="match-teams-col">
                                <span style={{ fontWeight: 600 }}>창우FC</span>
                                <span className="match-score">
                                    {match.ourScore} - {match.opponentScore}
                                </span>
                                <span>{match.opponent}</span>
                            </div>
                            <span className={`result-badge result-${getResult(match)}`}>
                                {getResultLabel(match)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
