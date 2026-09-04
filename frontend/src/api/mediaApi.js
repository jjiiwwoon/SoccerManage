/**
 * ====================================
 * 파일: mediaApi.js
 * 위치: frontend/src/api/
 * 기능: 미디어 갤러리 API 통신
 * ====================================
 */

const API_URL = 'http://localhost:8080/api';

// 미디어 목록 (전체 또는 타입별)
export async function getMediaList(type) {
    const url = type ? `${API_URL}/media?type=${type}` : `${API_URL}/media`;
    const response = await fetch(url);
    return response.json();
}

// 미디어 추가
export async function createMedia(mediaData) {
    const response = await fetch(`${API_URL}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mediaData),
    });
    return response.json();
}

// 미디어 삭제
export async function deleteMedia(id) {
    await fetch(`${API_URL}/media/${id}`, { method: 'DELETE' });
}
