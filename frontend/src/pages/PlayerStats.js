/**
 * ====================================
 * 파일: PlayerStats.js (수정됨)
 * 위치: frontend/src/pages/PlayerStats.js
 * 기능: 개인기록 페이지 - 선수별 스탯 테이블
 * ====================================
 *
 * 변경사항:
 * - 포지션 필터 탭 색상 적용 (GK/DF/MF/FW)
 * - No. → 순위 (공동순위 지원)
 * - 공헌점 → 공격포인트
 * - 정렬: 오름차순/내림차순 토글 + 화살표 표시
 * - 테이블 열 너비 고정 (클릭해도 칸 변동 없음)
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
    const [sortBy, setSortBy] = useState('goals');
    const [sortDir, setSortDir] = useState('desc'); // 'asc' 또는 'desc'

    useEffect(() => {
        async function fetchData() {
            try {
                const [membersData, matchesData] = await Promise.all([
                    getMembers(),
                    getMatches(),
                ]);
                setMembers(membersData);

                const allStats = {};

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

                // 완료된 경기만 통계에 포함 (예정 경기 제외)
                const completedMatches = matchesData.filter(m => m.ourScore != null && m.opponentScore != null);

                for (const match of completedMatches) {
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

                const statsArray = Object.values(allStats).map(s => ({
                    ...s,
                    attackPoints: s.goals * 2 + s.assists,
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

    // 포지션 배지
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

    // 포지션 필터 탭 색상
    function getFilterTabClass(tabKey) {
        if (filter !== tabKey) return 'filter-tab';
        if (tabKey === 'all') return 'filter-tab active';
        return `filter-tab active filter-tab-${tabKey}`;
    }

    // 정렬 핸들러: 같은 열 클릭 시 방향 토글, 다른 열 클릭 시 내림차순부터
    function handleSort(column) {
        if (sortBy === column) {
            setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(column);
            setSortDir('desc');
        }
    }

    // 정렬 화살표 표시
    function getSortArrow(column) {
        if (sortBy !== column) return '';
        return sortDir === 'desc' ? ' ▼' : ' ▲';
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
        .sort((a, b) => {
            const diff = a[sortBy] - b[sortBy];
            return sortDir === 'desc' ? -diff : diff;
        });

    // 공동순위 계산: 같은 정렬 값이면 같은 순위
    function getRanks(stats) {
        const ranks = [];
        let currentRank = 1;
        for (let i = 0; i < stats.length; i++) {
            if (i > 0 && stats[i][sortBy] === stats[i - 1][sortBy]) {
                ranks.push(ranks[i - 1]); // 공동순위
            } else {
                ranks.push(currentRank);
            }
            currentRank = i + 2; // 다음 순위는 실제 위치 기준
        }
        return ranks;
    }
    const ranks = getRanks(filteredStats);

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
                        className={getFilterTabClass(tab.key)}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 선수 스탯 테이블 */}
            <div className="card" style={{ padding: 0, overflow: 'auto' }}>
                <table className="data-table stats-table">
                    <thead>
                        <tr>
                            <th className="col-number">순위</th>
                            <th className="col-name">선수</th>
                            <th className="col-position">포지션</th>
                            <th className="col-stat text-center sortable"
                                onClick={() => handleSort('matches')}>
                                경기{getSortArrow('matches')}
                            </th>
                            <th className="col-stat text-center sortable"
                                onClick={() => handleSort('quarters')}>
                                쿼터{getSortArrow('quarters')}
                            </th>
                            <th className="col-stat text-center sortable"
                                onClick={() => handleSort('goals')}>
                                득점{getSortArrow('goals')}
                            </th>
                            <th className="col-stat text-center sortable"
                                onClick={() => handleSort('assists')}>
                                어시스트{getSortArrow('assists')}
                            </th>
                            <th className="col-stat text-center sortable"
                                onClick={() => handleSort('attackPoints')}>
                                공격포인트{getSortArrow('attackPoints')}
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
                                    <td className="col-number" style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                        {ranks[index]}
                                    </td>
                                    <td className="col-name" style={{ fontWeight: 600 }}>{player.name}</td>
                                    <td className="col-position">
                                        <span className={`badge ${getPositionClass(player.position)}`}>
                                            {getPositionLabel(player.position)}
                                        </span>
                                    </td>
                                    <td className="col-stat text-center">{player.matches}</td>
                                    <td className="col-stat text-center">{player.quarters}</td>
                                    <td className="col-stat text-center" style={{ fontWeight: 600 }}>{player.goals}</td>
                                    <td className="col-stat text-center">{player.assists}</td>
                                    <td className="col-stat text-center" style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                                        {player.attackPoints}
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
