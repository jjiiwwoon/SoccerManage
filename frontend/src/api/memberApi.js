/**
 * ====================================
 * 파일: memberApi.js (기존 그대로 + 선수 스탯 조회 추가)
 * 위치: frontend/src/api/ (기존 파일 덮어쓰기)
 * ====================================
 */

const API_URL = 'http://localhost:8080/api';

// 전체 멤버 목록
export async function getMembers() {
    const response = await fetch(`${API_URL}/members`);
    return response.json();
}

// 특정 멤버 조회
export async function getMember(id) {
    const response = await fetch(`${API_URL}/members/${id}`);
    return response.json();
}

// 멤버 추가
export async function createMember(memberData) {
    const response = await fetch(`${API_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
    });
    return response.json();
}

// 멤버 수정
export async function updateMember(id, memberData) {
    const response = await fetch(`${API_URL}/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
    });
    return response.json();
}

// 멤버 삭제
export async function deleteMember(id) {
    await fetch(`${API_URL}/members/${id}`, { method: 'DELETE' });
}

// 특정 선수의 모든 스탯 조회 (새로 추가)
export async function getMemberStats(memberId) {
    const response = await fetch(`${API_URL}/members/${memberId}/stats`);
    return response.json();
}
