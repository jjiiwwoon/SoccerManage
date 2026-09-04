/**
 * ====================================
 * 파일: matchApi.js
 * 위치: frontend/src/api/ 폴더 안에 넣기
 * 분야: 프론트엔드 / API 통신
 * 기능: 경기 기록 관련 백엔드 API 호출
 * ====================================
 *
 * memberApi.js랑 완전 같은 패턴이야!
 * fetch()로 Spring Boot 서버에 HTTP 요청을 보내는 거야.
 *
 * memberApi.js에서 /api/members로 요청했듯이,
 * 여기서는 /api/matches로 요청해.
 */

const API_URL = 'http://localhost:8080/api';

// 전체 경기 목록 가져오기
export async function getMatches() {
    const response = await fetch(`${API_URL}/matches`);
    return response.json();
}

// 특정 경기 상세 조회
export async function getMatch(id) {
    const response = await fetch(`${API_URL}/matches/${id}`);
    return response.json();
}

// 경기 추가
export async function createMatch(matchData) {
    const response = await fetch(`${API_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
    });
    return response.json();
}

// 경기 수정
export async function updateMatch(id, matchData) {
    const response = await fetch(`${API_URL}/matches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
    });
    return response.json();
}

// 경기 삭제
export async function deleteMatch(id) {
    await fetch(`${API_URL}/matches/${id}`, { method: 'DELETE' });
}

// --- 개인 스탯 API ---

// 특정 경기의 스탯 목록
export async function getMatchStats(matchId) {
    const response = await fetch(`${API_URL}/matches/${matchId}/stats`);
    return response.json();
}

// 스탯 추가 (경기 ID + 선수 ID)
export async function createMatchStat(matchId, memberId, statData) {
    const response = await fetch(`${API_URL}/matches/${matchId}/stats?memberId=${memberId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statData),
    });
    return response.json();
}

// 스탯 삭제
export async function deleteMatchStat(statId) {
    await fetch(`${API_URL}/stats/${statId}`, { method: 'DELETE' });
}
