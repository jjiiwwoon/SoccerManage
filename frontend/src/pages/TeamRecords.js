/**
 * ====================================
 * 파일: TeamRecords.js (수정됨)
 * 위치: frontend/src/pages/TeamRecords.js
 * 기능: 팀 전적 테이블 + 경기 결과 리스트
 * ====================================
 *
 * 변경사항:
 * - 예정 경기(스코어 없음)를 통계 및 리스트에서 제외
 * - 완료된 경기만 승/무/패 계산에 포함
 */
import React, { useState, useEffect } from 'react';
import { getMatches } from '../api/matchApi';

function TeamRecords() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, win, draw, lose

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMatches();
                setMatches(data);
            } catch (err) {
                console.error('경기 데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // 결과 판별
    function getResult(match) {
        if (match.ourScore > match.opponentScore) return 'win';
        if (match.ourScore === match.opponentScore) return 'draw';
        return 'lose';
    }

    function getResultLabel(result) {
        if (result === 'win') return '승리';
        if (result === 'draw') return '무승부';
        return '패배';
    }

    // 완료된 경기만 필터 (스코어가 입력된 경기)
    const completedMatches = matches.filter(m => m.ourScore != null && m.opponentScore != null);

    // 통계 계산 (완료된 경기 기준)
    const totalMatches = completedMatches.length;
    const wins = completedMatches.filter(m => getResult(m) === 'win').length;
    const draws = completedMatches.filter(m => getResult(m) === 'draw').length;
    const losses = completedMatches.filter(m => getResult(m) === 'lose').length;
    const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';
    const totalGoals = completedMatches.reduce((sum, m) => sum + (m.ourScore || 0), 0);
    const totalConceded = completedMatches.reduce((sum, m) => sum + (m.opponentScore || 0), 0);

    // 필터링된 경기 목록 (완료된 경기 중에서만)
    const filteredMatches = completedMatches
        .filter(m => {
            if (filter === 'all') return true;
            return getResult(m) === filter;
        })
        .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="team-records-page">
            <div className="page-header">
                <h1 className="page-title">팀기록</h1>
            </div>

            {/* 팀 전적 요약 */}
            <div className="card" style={{ marginBottom: '24px', padding: 0, overflow: 'hidden' }}>
                <div className="team-stats-grid">
                    <div className="team-stat-item">
                        <div className="team-stat-value">{totalMatches}</div>
                        <div className="team-stat-label">경기</div>
                    </div>
                    <div className="team-stat-item">
                        <div className="team-stat-value" style={{ color: 'var(--color-win)' }}>{wins}</div>
                        <div className="team-stat-label">승</div>
                    </div>
                    <div className="team-stat-item">
                        <div className="team-stat-value" style={{ color: 'var(--color-draw)' }}>{draws}</div>
                        <div className="team-stat-label">무</div>
                    </div>
                    <div className="team-stat-item">
                        <div className="team-stat-value" style={{ color: 'var(--color-lose)' }}>{losses}</div>
                        <div className="team-stat-label">패</div>
                    </div>
                    <div className="team-stat-item">
                        <div className="team-stat-value" style={{ color: 'var(--color-gold)' }}>{winRate}%</div>
                        <div className="team-stat-label">승률</div>
                    </div>
                    <div className="team-stat-item">
                        <div className="team-stat-value">{totalGoals}</div>
                        <div className="team-stat-label">득점</div>
                    </div>
                    <div className="team-stat-item">
                        <div className="team-stat-value">{totalConceded}</div>
                        <div className="team-stat-label">실점</div>
                    </div>
                </div>
            </div>

            {/* 필터 탭 */}
            <div className="filter-tabs">
                {[
                    { key: 'all', label: '전체' },
                    { key: 'win', label: '승리' },
                    { key: 'draw', label: '무승부' },
                    { key: 'lose', label: '패배' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 경기 결과 리스트 */}
            <div className="card" style={{ padding: 0 }}>
                <div className="card-title" style={{ padding: '16px 16px 0' }}>
                    경기 결과 ({filteredMatches.length})
                </div>
                {filteredMatches.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 20px' }}>
                        해당하는 경기가 없습니다.
                    </p>
                ) : (
                    filteredMatches.map((match) => {
                        const result = getResult(match);
                        return (
                            <div key={match.id} className="match-row">
                                <div className={`match-result-bar ${result}`} />
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
                                <span className={`result-badge result-${result}`}>
                                    {getResultLabel(result)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default TeamRecords;
