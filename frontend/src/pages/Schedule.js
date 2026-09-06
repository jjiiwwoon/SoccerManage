/**
 * ====================================
 * 파일: Schedule.js (수정됨)
 * 위치: frontend/src/pages/Schedule.js (기존 파일 덮어쓰기)
 * 기능: 일정 페이지 - 캘린더 + 일정 등록 + 결과 입력
 * ====================================
 *
 * 변경사항:
 * 1. 일정 등록 기능: 날짜, 시간, 장소, 상대팀을 입력해서 예정 경기 등록
 * 2. 결과 입력 기능: 예정 경기 클릭 → 스코어 + 개인 기록 일괄 입력
 * 3. 경기 삭제 기능: 등록된 경기 삭제 가능
 */
import React, { useState, useEffect } from 'react';
import {
    getMatches, createMatch, updateMatch, deleteMatch,
    getMatchStats, createMatchStat, deleteAllMatchStats
} from '../api/matchApi';
import { getMembers } from '../api/memberApi';

function Schedule() {
    const [matches, setMatches] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [matchStats, setMatchStats] = useState([]);

    // 모달 상태
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showResultForm, setShowResultForm] = useState(false);

    // 일정 등록 폼
    const [newSchedule, setNewSchedule] = useState({
        matchDate: '',
        matchTime: '',
        matchEndTime: '',
        location: '',
        opponent: '',
        memo: '',
    });

    // 날짜 직접 선택용 상태
    const [dateYear, setDateYear] = useState('');
    const [dateMonth, setDateMonth] = useState('');
    const [dateDay, setDateDay] = useState('');

    // 결과 입력 폼
    const [resultData, setResultData] = useState({
        ourScore: '',
        opponentScore: '',
    });
    const [playerStatInputs, setPlayerStatInputs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const [matchData, memberData] = await Promise.all([
                getMatches(),
                getMembers(),
            ]);
            setMatches(matchData);
            setMembers(memberData);
        } catch (err) {
            console.error('데이터 로딩 실패:', err);
        } finally {
            setLoading(false);
        }
    }

    // 날짜 유틸
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    function prevMonth() {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
        setSelectedMatch(null);
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
        setSelectedMatch(null);
    }

    function getMatchForDate(day) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return matches.find(m => m.matchDate === dateStr);
    }

    function getResult(match) {
        if (match.ourScore == null || match.opponentScore == null) return 'upcoming';
        if (match.ourScore > match.opponentScore) return 'win';
        if (match.ourScore === match.opponentScore) return 'draw';
        return 'lose';
    }

    function getResultLabel(result) {
        if (result === 'win') return '승리';
        if (result === 'draw') return '무승부';
        if (result === 'lose') return '패배';
        return '예정';
    }

    // 날짜 클릭
    async function handleDateClick(day) {
        setSelectedDate(day);
        const match = getMatchForDate(day);
        setSelectedMatch(match);

        if (match) {
            try {
                const stats = await getMatchStats(match.id);
                setMatchStats(stats);
            } catch (err) {
                setMatchStats([]);
            }
        } else {
            setMatchStats([]);
        }
    }

    // 날짜 select 동기화 함수
    function syncDateSelects(dateStr) {
        if (dateStr) {
            const parts = dateStr.split('-');
            setDateYear(parts[0]);
            setDateMonth(parts[1]);
            setDateDay(parts[2]);
        }
    }

    function handleDateSelectChange(y, m, d) {
        setDateYear(y);
        setDateMonth(m);
        setDateDay(d);
        if (y && m && d) {
            const dateStr = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            setNewSchedule(prev => ({ ...prev, matchDate: dateStr }));
        }
    }

    // 해당 월의 일수 계산
    function getDaysInMonth(y, m) {
        if (!y || !m) return 31;
        return new Date(parseInt(y), parseInt(m), 0).getDate();
    }

    // ========== 일정 등록 ==========
    function openRegisterForm() {
        const today = new Date();
        const dateStr = selectedDate
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
            : `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setNewSchedule({
            matchDate: dateStr,
            matchTime: '',
            matchEndTime: '',
            location: '',
            opponent: '',
            memo: '',
        });
        syncDateSelects(dateStr);
        setShowRegisterForm(true);
    }

    async function handleRegisterSubmit(e) {
        e.preventDefault();
        if (!newSchedule.matchDate || !newSchedule.opponent) {
            alert('날짜와 상대팀은 필수입니다.');
            return;
        }
        try {
            await createMatch({
                matchDate: newSchedule.matchDate,
                matchTime: newSchedule.matchTime || null,
                matchEndTime: newSchedule.matchEndTime || null,
                location: newSchedule.location || null,
                opponent: newSchedule.opponent,
                memo: newSchedule.memo || null,
                ourScore: null,
                opponentScore: null,
            });
            setShowRegisterForm(false);
            await fetchData();
            // 등록한 날짜 선택
            const day = parseInt(newSchedule.matchDate.split('-')[2]);
            handleDateClick(day);
        } catch (err) {
            alert('일정 등록에 실패했습니다.');
        }
    }

    // ========== 결과 입력 ==========
    function openResultForm() {
        if (!selectedMatch) return;
        setResultData({
            ourScore: selectedMatch.ourScore ?? '',
            opponentScore: selectedMatch.opponentScore ?? '',
        });
        // 선수 목록으로 스탯 입력 폼 초기화
        const inputs = members.map(member => {
            // 기존 스탯이 있으면 채우기
            const existing = matchStats.find(s =>
                (s.member?.id || s.memberId) === member.id
            );
            return {
                memberId: member.id,
                name: member.name,
                position: member.position,
                backNumber: member.backNumber,
                played: existing ? true : false,
                goals: existing?.goals || 0,
                assists: existing?.assists || 0,
                quarters: existing?.quarters || 0,
            };
        });
        setPlayerStatInputs(inputs);
        setShowResultForm(true);
    }

    function handlePlayerStatChange(index, field, value) {
        const updated = [...playerStatInputs];
        if (field === 'played') {
            updated[index].played = value;
            if (!value) {
                updated[index].goals = 0;
                updated[index].assists = 0;
                updated[index].quarters = 0;
            }
        } else {
            updated[index][field] = parseInt(value) || 0;
        }
        setPlayerStatInputs(updated);
    }

    async function handleResultSubmit(e) {
        e.preventDefault();
        if (resultData.ourScore === '' || resultData.opponentScore === '') {
            alert('스코어를 입력해주세요.');
            return;
        }

        try {
            // 1. 경기 결과 업데이트
            await updateMatch(selectedMatch.id, {
                matchDate: selectedMatch.matchDate,
                matchTime: selectedMatch.matchTime,
                matchEndTime: selectedMatch.matchEndTime,
                opponent: selectedMatch.opponent,
                location: selectedMatch.location,
                memo: selectedMatch.memo,
                ourScore: parseInt(resultData.ourScore),
                opponentScore: parseInt(resultData.opponentScore),
            });

            // 2. 기존 스탯 삭제
            await deleteAllMatchStats(selectedMatch.id);

            // 3. 출전 선수의 스탯 일괄 등록
            const playedPlayers = playerStatInputs.filter(p => p.played);
            for (const player of playedPlayers) {
                await createMatchStat(selectedMatch.id, player.memberId, {
                    goals: player.goals,
                    assists: player.assists,
                    quarters: player.quarters,
                });
            }

            setShowResultForm(false);
            await fetchData();
            if (selectedDate) {
                handleDateClick(selectedDate);
            }
        } catch (err) {
            alert('결과 입력에 실패했습니다.');
            console.error(err);
        }
    }

    // ========== 경기 삭제 ==========
    async function handleDeleteMatch() {
        if (!selectedMatch) return;
        if (window.confirm(`vs ${selectedMatch.opponent} 일정을 삭제하시겠습니까?`)) {
            try {
                await deleteMatch(selectedMatch.id);
                setSelectedMatch(null);
                setMatchStats([]);
                await fetchData();
            } catch (err) {
                alert('삭제에 실패했습니다.');
            }
        }
    }

    // 포지션 라벨
    function getPositionLabel(position) {
        const pos = (position || '').toUpperCase();
        if (pos.includes('GK') || pos === '골키퍼') return 'GK';
        if (pos.includes('DF') || pos === '수비수') return 'DF';
        if (pos.includes('MF') || pos === '미드필더') return 'MF';
        if (pos.includes('FW') || pos === '공격수') return 'FW';
        return pos || '-';
    }

    function getPositionClass(position) {
        const label = getPositionLabel(position);
        return `badge-${label.toLowerCase()}`;
    }

    // 캘린더 셀 렌더링
    function renderCalendarCells() {
        const cells = [];
        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        for (let i = firstDay - 1; i >= 0; i--) {
            cells.push(
                <div key={`prev-${i}`} className="calendar-cell other-month">
                    {daysInPrevMonth - i}
                </div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const match = getMatchForDate(day);
            const isToday = day === todayDay && month === todayMonth && year === todayYear;
            const isSelected = day === selectedDate;
            const result = match ? getResult(match) : null;

            let className = 'calendar-cell';
            if (isToday) className += ' today';
            if (isSelected) className += ' selected';
            if (match) {
                className += ' has-match';
                if (result === 'upcoming') className += ' upcoming';
            }

            // 결과 약자 + 색상
            function getResultShort(r) {
                if (r === 'win') return { label: 'W', className: 'result-w' };
                if (r === 'draw') return { label: 'D', className: 'result-d' };
                if (r === 'lose') return { label: 'L', className: 'result-l' };
                return null;
            }

            cells.push(
                <div
                    key={day}
                    className={className}
                    onClick={() => handleDateClick(day)}
                >
                    <span className="calendar-day-number">{day}</span>
                    {match && result === 'upcoming' && (
                        <span className="calendar-match-info upcoming-label">
                            <span className="match-day-text">Match Day</span>
                            <span className="match-opponent-sub">vs {match.opponent}</span>
                        </span>
                    )}
                    {match && result !== 'upcoming' && (
                        <span className="calendar-match-info">
                            <span className="match-opponent-text">vs {match.opponent}</span>
                            <span className={`result-short ${getResultShort(result)?.className}`}>
                                {getResultShort(result)?.label}
                            </span>
                        </span>
                    )}
                </div>
            );
        }

        const totalCells = cells.length;
        const remaining = 42 - totalCells;
        for (let i = 1; i <= remaining; i++) {
            cells.push(
                <div key={`next-${i}`} className="calendar-cell other-month">
                    {i}
                </div>
            );
        }

        return cells;
    }

    const goalScorers = matchStats.filter(s => s.goals > 0);

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="schedule-page">
            <div className="page-header">
                <h1 className="page-title">일정</h1>
                <button className="btn btn-gold" onClick={openRegisterForm}>
                    + 일정 등록
                </button>
            </div>

            <div className="schedule-layout">
                {/* 캘린더 */}
                <div className="card">
                    <div className="calendar-header">
                        <button className="calendar-nav" onClick={prevMonth}>◀</button>
                        <span className="calendar-title">
                            {year}년 {month + 1}월
                        </span>
                        <button className="calendar-nav" onClick={nextMonth}>▶</button>
                    </div>

                    <div className="calendar-grid">
                        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                            <div key={day} className="calendar-day-header">{day}</div>
                        ))}
                        {renderCalendarCells()}
                    </div>
                </div>

                {/* 오른쪽 사이드바 */}
                <div>
                    {selectedMatch ? (
                        <div className="match-detail-card">
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                                    {selectedMatch.matchDate}
                                    {selectedMatch.matchTime && ` ${selectedMatch.matchTime}`}
                                    {selectedMatch.matchEndTime && `~${selectedMatch.matchEndTime}`}
                                    {selectedMatch.location && ` · ${selectedMatch.location}`}
                                </div>
                                <div className="teams">
                                    <span className="team-name">창우FC</span>
                                    <span className="score-display">
                                        {selectedMatch.ourScore ?? '-'} : {selectedMatch.opponentScore ?? '-'}
                                    </span>
                                    <span className="team-name">{selectedMatch.opponent}</span>
                                </div>
                                {getResult(selectedMatch) !== 'upcoming' ? (
                                    <span className={`result-badge result-${getResult(selectedMatch)}`}>
                                        {getResultLabel(getResult(selectedMatch))}
                                    </span>
                                ) : (
                                    <span className="result-badge result-upcoming">예정</span>
                                )}
                                {selectedMatch.memo && (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                                        메모: {selectedMatch.memo}
                                    </div>
                                )}
                            </div>

                            {/* 골 기록자 */}
                            {goalScorers.length > 0 && (
                                <div className="goal-list">
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-dark)' }}>
                                        득점 기록
                                    </div>
                                    {goalScorers.map((stat, i) => (
                                        <div key={i} className="goal-item">
                                            <span className="goal-icon">⚽</span>
                                            <span>{stat.member?.name || '선수'}</span>
                                            <span style={{ color: 'var(--color-text-muted)' }}>
                                                ({stat.goals}골)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 출전 선수 목록 */}
                            {matchStats.length > 0 && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-dark)' }}>
                                        출전 선수 ({matchStats.length}명)
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {matchStats.map((stat, i) => (
                                            <span key={i} style={{
                                                fontSize: '0.75rem',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                backgroundColor: 'var(--color-light)',
                                                color: 'var(--color-dark)',
                                            }}>
                                                {stat.member?.name || '선수'}
                                                {stat.quarters > 0 && ` (${stat.quarters}Q)`}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 액션 버튼 */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                {getResult(selectedMatch) === 'upcoming' ? (
                                    <button
                                        className="btn btn-gold"
                                        style={{ flex: 1, fontSize: '0.85rem' }}
                                        onClick={openResultForm}
                                    >
                                        결과 입력
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-outline"
                                        style={{ flex: 1, fontSize: '0.85rem' }}
                                        onClick={openResultForm}
                                    >
                                        결과 수정
                                    </button>
                                )}
                                <button
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.85rem', color: 'var(--color-lose)' }}
                                    onClick={handleDeleteMatch}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ) : selectedDate ? (
                        <div className="match-detail-card" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <p style={{ padding: '20px' }}>
                                {month + 1}월 {selectedDate}일에는 경기가 없습니다.
                            </p>
                            <button
                                className="btn btn-gold"
                                style={{ fontSize: '0.85rem' }}
                                onClick={openRegisterForm}
                            >
                                이 날짜에 일정 등록
                            </button>
                        </div>
                    ) : (
                        <div className="match-detail-card" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            <p style={{ padding: '20px' }}>
                                날짜를 선택하면 경기 정보가 표시됩니다.
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* ========== 일정 등록 모달 ========== */}
            {showRegisterForm && (
                <div className="modal-overlay" onClick={() => setShowRegisterForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="form-title">일정 등록</div>
                            <div className="form-grid">
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label className="form-label date-label-with-icon">
                                        날짜
                                        <span className="date-icon-wrap">
                                            <span className="date-icon-trigger">📅</span>
                                            <input
                                                type="date"
                                                className="date-hidden-input"
                                                value={newSchedule.matchDate}
                                                onChange={(e) => {
                                                    setNewSchedule({ ...newSchedule, matchDate: e.target.value });
                                                    syncDateSelects(e.target.value);
                                                }}
                                                title="달력에서 선택"
                                            />
                                        </span>
                                    </label>
                                    <div className="date-picker-row">
                                        <select
                                            className="form-input date-select"
                                            value={dateYear}
                                            onChange={(e) => handleDateSelectChange(e.target.value, dateMonth, dateDay)}
                                            required
                                        >
                                            <option value="">년</option>
                                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i).map(y => (
                                                <option key={y} value={String(y)}>{y}년</option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-input date-select"
                                            value={dateMonth}
                                            onChange={(e) => handleDateSelectChange(dateYear, e.target.value, dateDay)}
                                            required
                                        >
                                            <option value="">월</option>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={String(m).padStart(2, '0')}>{m}월</option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-input date-select"
                                            value={dateDay}
                                            onChange={(e) => handleDateSelectChange(dateYear, dateMonth, e.target.value)}
                                            required
                                        >
                                            <option value="">일</option>
                                            {Array.from({ length: getDaysInMonth(dateYear, dateMonth) }, (_, i) => i + 1).map(d => (
                                                <option key={d} value={String(d).padStart(2, '0')}>{d}일</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">시작 시간</label>
                                    <div className="time-picker-row">
                                        <select
                                            className="form-input time-select"
                                            value={newSchedule.matchTime ? newSchedule.matchTime.split(':')[0] : ''}
                                            onChange={(e) => {
                                                const hour = e.target.value;
                                                const min = newSchedule.matchTime ? newSchedule.matchTime.split(':')[1] : '00';
                                                setNewSchedule({ ...newSchedule, matchTime: hour ? `${hour}:${min}` : '' });
                                            }}
                                        >
                                            <option value="">시</option>
                                            {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                                <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}시</option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-input time-select"
                                            value={newSchedule.matchTime ? newSchedule.matchTime.split(':')[1] : ''}
                                            onChange={(e) => {
                                                const hour = newSchedule.matchTime ? newSchedule.matchTime.split(':')[0] : '00';
                                                const min = e.target.value;
                                                setNewSchedule({ ...newSchedule, matchTime: min ? `${hour}:${min}` : '' });
                                            }}
                                        >
                                            <option value="">분</option>
                                            {Array.from({ length: 60 }, (_, i) => i).map(m => (
                                                <option key={m} value={String(m).padStart(2, '0')}>{String(m).padStart(2, '0')}분</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">종료 시간</label>
                                    <div className="time-picker-row">
                                        <select
                                            className="form-input time-select"
                                            value={newSchedule.matchEndTime ? newSchedule.matchEndTime.split(':')[0] : ''}
                                            onChange={(e) => {
                                                const hour = e.target.value;
                                                const min = newSchedule.matchEndTime ? newSchedule.matchEndTime.split(':')[1] : '00';
                                                setNewSchedule({ ...newSchedule, matchEndTime: hour ? `${hour}:${min}` : '' });
                                            }}
                                        >
                                            <option value="">시</option>
                                            {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                                <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}시</option>
                                            ))}
                                        </select>
                                        <select
                                            className="form-input time-select"
                                            value={newSchedule.matchEndTime ? newSchedule.matchEndTime.split(':')[1] : ''}
                                            onChange={(e) => {
                                                const hour = newSchedule.matchEndTime ? newSchedule.matchEndTime.split(':')[0] : '00';
                                                const min = e.target.value;
                                                setNewSchedule({ ...newSchedule, matchEndTime: min ? `${hour}:${min}` : '' });
                                            }}
                                        >
                                            <option value="">분</option>
                                            {Array.from({ length: 60 }, (_, i) => i).map(m => (
                                                <option key={m} value={String(m).padStart(2, '0')}>{String(m).padStart(2, '0')}분</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">상대팀</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="상대팀 이름"
                                        value={newSchedule.opponent}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, opponent: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">장소</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="경기 장소"
                                        value={newSchedule.location}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '12px' }}>
                                <label className="form-label">메모</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="메모"
                                    value={newSchedule.memo}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, memo: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowRegisterForm(false)}
                                >
                                    취소
                                </button>
                                <button type="submit" className="btn btn-gold">
                                    등록
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========== 결과 입력 모달 ========== */}
            {showResultForm && selectedMatch && (
                <div className="modal-overlay" onClick={() => setShowResultForm(false)}>
                    <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleResultSubmit}>
                            <div className="form-title">
                                {getResult(selectedMatch) === 'upcoming' ? '결과 입력' : '결과 수정'} — vs {selectedMatch.opponent}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                                {selectedMatch.matchDate}
                                {selectedMatch.matchTime && ` ${selectedMatch.matchTime}`}
                                {selectedMatch.location && ` · ${selectedMatch.location}`}
                            </div>

                            {/* 스코어 입력 */}
                            <div className="score-input-section">
                                <div className="score-team">
                                    <span style={{ fontWeight: 600 }}>창우FC</span>
                                    <input
                                        type="number"
                                        className="score-input"
                                        min="0"
                                        value={resultData.ourScore}
                                        onChange={(e) => setResultData({ ...resultData, ourScore: e.target.value })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <span className="score-vs">VS</span>
                                <div className="score-team">
                                    <span style={{ fontWeight: 600 }}>{selectedMatch.opponent}</span>
                                    <input
                                        type="number"
                                        className="score-input"
                                        min="0"
                                        value={resultData.opponentScore}
                                        onChange={(e) => setResultData({ ...resultData, opponentScore: e.target.value })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 개인 기록 입력 */}
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-dark)' }}>
                                    개인 기록 (출전 선수 체크 후 기록 입력)
                                </div>

                                <div className="stat-input-table-wrap">
                                    <table className="stat-input-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40px' }}>출전</th>
                                                <th>선수</th>
                                                <th style={{ width: '50px' }}>포지션</th>
                                                <th style={{ width: '60px' }}>쿼터</th>
                                                <th style={{ width: '60px' }}>득점</th>
                                                <th style={{ width: '60px' }}>도움</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {playerStatInputs.map((player, index) => (
                                                <tr key={player.memberId} style={{
                                                    opacity: player.played ? 1 : 0.5,
                                                }}>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={player.played}
                                                            onChange={(e) => handlePlayerStatChange(index, 'played', e.target.checked)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight: 600 }}>
                                                            #{player.backNumber} {player.name}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getPositionClass(player.position)}`} style={{ fontSize: '0.7rem' }}>
                                                            {getPositionLabel(player.position)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="stat-mini-input"
                                                            min="0"
                                                            max="4"
                                                            value={player.quarters}
                                                            onChange={(e) => handlePlayerStatChange(index, 'quarters', e.target.value)}
                                                            disabled={!player.played}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="stat-mini-input"
                                                            min="0"
                                                            value={player.goals}
                                                            onChange={(e) => handlePlayerStatChange(index, 'goals', e.target.value)}
                                                            disabled={!player.played}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="stat-mini-input"
                                                            min="0"
                                                            value={player.assists}
                                                            onChange={(e) => handlePlayerStatChange(index, 'assists', e.target.value)}
                                                            disabled={!player.played}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="form-actions" style={{ marginTop: '20px' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowResultForm(false)}
                                >
                                    취소
                                </button>
                                <button type="submit" className="btn btn-gold">
                                    {getResult(selectedMatch) === 'upcoming' ? '결과 저장' : '결과 수정'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Schedule;
