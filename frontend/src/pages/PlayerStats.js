/**
 * ====================================
 * 파일: PlayerStats.js (새 파일)
 * 위치: frontend/src/pages/PlayerStats.js
 * 기능: 개인기록 페이지 - 선수별 스탯 테이블
 * ====================================
 *
 * 디자인의 개인기록 페이지 구현:
 * - 선수별 경기, 쿼터, 득점, 어시스트, 공헌점 테이블
 * - 포지션 배지 (GK/DF/MF/FW 색상 구분)
 * - 정렬 기능 (포지션별 필터 + 검색)
 * - 하단 요약 카드 (총 득점, 총 어시스트, 경기 참여, 최고 득점자)
 */
import React, { useState, useEffect } from 'react';
import { getMembers } from '../api/memberApi';
import { getMatches, getMatchStats } from '../api/matchApi';

function PlayerStats() {
    const [members, setMembers] = useState([]);
    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('goals'); // goals, assists, matches, contribution

    useEffect(() => {
        async function fetchData() {
            try {
                const [membersData, matchesData] = await Promise.all([
                    getMembers(),
                    getMatches(),
                ]);
                setMembers(membersData);

                // 각 경기의 스탯을 모아서 선수별로 집계
                const allStats = {};

                // 멤버 초기화
                membersData.forEach(member => {
                    allStats[member.id] = {
                        id: member.id,
                        name: member.name,
                        position: member.position || '-',
                        backNumber: member.backNumber || '-',
                        matches: 0,
                        quarters: 0,
                        goals: 0,
                        assists: 0,
                    };
                });

                // 각 경기의 스탯 가져오기
                for (const match of matchesData) {
                    try {
                        const stats = await getMatchStats(match.id);
                        stats.forEach(stat => {
                            const memberId = stat.member?.id || stat.memberId;
                            if (allStats[memberId]) {
                                allStats[memberId].matches += 1;
                                allStats[memberId].quarters += (stat.quarters || 0);
                                allStats[memberId].goals += (stat.goals || 0);
                                allStats[memberId].assists += (stat.assists || 0);
                            }
                        });
                    } catch (err) {
                        // 개별 경기 스탯 로딩 실패 시 건너뜀
                    }
                }

                // 공헌점 계산 (득점×2 + 어시스트×1)
                const statsArray = Object.values(allStats).map(s => ({
                    ...s,
                    contribution: s.goals * 2 + s.assists,
                }));

                setPlayerStats(statsArray);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // 포지션 배지 CSS 클래스
    function getPositionClass(position) {
        const pos = (position || '').toUpperCase();
        if (pos.includes('GK') || pos === '골키퍼') return 'badge-gk';
        if (pos.includes('DF') || pos === '수비수') return 'badge-df';
        if (pos.includes('MF') || pos === '미드필더') return 'badge-mf';
        if (pos.includes('FW') || pos === '공격수') return 'badge-fw';
        return '';
    }

    function getPositionLabel(position) {
        const pos = (position || '').toUpperCase();
        if (pos.includes('GK') || pos === '골키퍼') return 'GK';
        if (pos.includes('DF') || pos === '수비수') return 'DF';
        if (pos.includes('MF') || pos === '미드필더') return 'MF';
        if (pos.includes('FW') || pos === '공격수') return 'FW';
        return pos || '-';
    }

    // 필터 + 검색 + 정렬
    const filteredStats = playerStats
        .filter(p => {
            if (filter === 'all') return true;
            return getPositionLabel(p.position) === filter.toUpperCase();
        })
        .filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b[sortBy] - a[sortBy]);

    // 요약 통계
    const totalGoals = playerStats.reduce((sum, p) => sum + p.goals, 0);
    const totalAssists = playerStats.reduce((sum, p) => sum + p.assists, 0);
    const participatedPlayers = playerStats.filter(p => p.matches > 0).length;
    const topScorer = playerStats.reduce((top, p) => (p.goals > (top?.goals || 0) ? p : top), null);

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="player-stats-page">
            <div className="page-header">
                <h1 className="page-title">개인기록</h1>
                <input
                    type="text"
                    className="search-input"
                    placeholder="선수 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 포지션 필터 */}
            <div className="filter-tabs">
                {[
                    { key: 'all', label: '전체' },
                    { key: 'gk', label: 'GK' },
                    { key: 'df', label: 'DF' },
                    { key: 'mf', label: 'MF' },
                    { key: 'fw', label: 'FW' },
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

            {/* 선수 스탯 테이블 */}
            <div className="card" style={{ padding: 0, overflow: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>선수</th>
                            <th>포지션</th>
                            <th className="text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSortBy('matches')}>
                                경기 {sortBy === 'matches' ? '▼' : ''}
                            </th>
                            <th className="text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSortBy('quarters')}>
                                쿼터 {sortBy === 'quarters' ? '▼' : ''}
                            </th>
                            <th className="text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSortBy('goals')}>
                                득점 {sortBy === 'goals' ? '▼' : ''}
                            </th>
                            <th className="text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSortBy('assists')}>
                                어시스트 {sortBy === 'assists' ? '▼' : ''}
                            </th>
                            <th className="text-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSortBy('contribution')}>
                                공헌점 {sortBy === 'contribution' ? '▼' : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStats.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                                    해당하는 선수가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            filteredStats.map((player, index) => (
                                <tr key={player.id}>
                                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                        {player.backNumber}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{player.name}</td>
                                    <td>
                                        <span className={`badge ${getPositionClass(player.position)}`}>
                                            {getPositionLabel(player.position)}
                                        </span>
                                    </td>
                                    <td className="text-center">{player.matches}</td>
                                    <td className="text-center">{player.quarters}</td>
                                    <td className="text-center" style={{ fontWeight: 600 }}>{player.goals}</td>
                                    <td className="text-center">{player.assists}</td>
                                    <td className="text-center" style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                                        {player.contribution}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 요약 카드 */}
            <div className="summary-stats">
                <div className="summary-stat-card">
                    <div className="stat-icon">⚽</div>
                    <div className="stat-number">{totalGoals}</div>
                    <div className="stat-label">총 득점</div>
                </div>
                <div className="summary-stat-card">
                    <div className="stat-icon">🅰️</div>
                    <div className="stat-number">{totalAssists}</div>
                    <div className="stat-label">총 어시스트</div>
                </div>
                <div className="summary-stat-card">
                    <div className="stat-icon">🏃</div>
                    <div className="stat-number">{participatedPlayers}</div>
                    <div className="stat-label">경기 참여</div>
                </div>
                <div className="summary-stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-number" style={{ fontSize: '1.2rem' }}>
                        {topScorer?.name || '-'}
                    </div>
                    <div className="stat-label">최고 득점자</div>
                </div>
            </div>
        </div>
    );
}

export default PlayerStats;
