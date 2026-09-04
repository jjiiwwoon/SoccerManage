/**
 * ====================================
 * 파일: MediaGallery.js (새 파일)
 * 위치: frontend/src/pages/
 * 기능: 사진/동영상 갤러리
 * ====================================
 *
 * 사진과 동영상 URL을 등록하고,
 * "전체 / 사진만 / 동영상만" 필터로 볼 수 있어.
 *
 * 사진: 이미지 URL을 넣으면 바로 미리보기
 * 동영상: 유튜브 링크를 넣으면 임베드 플레이어로 재생
 */
import React, { useState, useEffect } from 'react';
import { getMediaList, createMedia, deleteMedia } from '../api/mediaApi';

function MediaGallery() {
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');    // ALL, PHOTO, VIDEO

    const [newMedia, setNewMedia] = useState({
        title: '',
        mediaType: 'PHOTO',
        url: '',
        description: '',
    });

    useEffect(() => {
        fetchMedia();
    }, [filter]);

    async function fetchMedia() {
        try {
            setLoading(true);
            const type = filter === 'ALL' ? null : filter;
            const data = await getMediaList(type);
            setMediaList(data);
        } catch (err) {
            console.error('미디어 로딩 실패:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddMedia(e) {
        e.preventDefault();
        if (!newMedia.url) {
            alert('URL을 입력해주세요.');
            return;
        }
        if (!newMedia.title) {
            alert('제목을 입력해주세요.');
            return;
        }
        try {
            await createMedia(newMedia);
            setNewMedia({ title: '', mediaType: 'PHOTO', url: '', description: '' });
            fetchMedia();
        } catch (err) {
            alert('미디어 추가에 실패했습니다.');
        }
    }

    async function handleDeleteMedia(id, title) {
        if (window.confirm(`"${title}" 을(를) 삭제하시겠습니까?`)) {
            try {
                await deleteMedia(id);
                fetchMedia();
            } catch (err) {
                alert('삭제에 실패했습니다.');
            }
        }
    }

    // 유튜브 URL에서 영상 ID 추출 (임베드용)
    function getYoutubeEmbedUrl(url) {
        if (!url) return null;
        // youtube.com/watch?v=ID 형태
        let match = url.match(/[?&]v=([^&]+)/);
        if (match) return `https://www.youtube.com/embed/${match[1]}`;
        // youtu.be/ID 형태
        match = url.match(/youtu\.be\/([^?]+)/);
        if (match) return `https://www.youtube.com/embed/${match[1]}`;
        return null;
    }

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="media-gallery">
            <h2>갤러리</h2>

            {/* 미디어 추가 폼 */}
            <form className="add-media-form" onSubmit={handleAddMedia}>
                <select
                    value={newMedia.mediaType}
                    onChange={(e) => setNewMedia({...newMedia, mediaType: e.target.value})}
                >
                    <option value="PHOTO">사진</option>
                    <option value="VIDEO">동영상</option>
                </select>
                <input
                    type="text"
                    placeholder="제목"
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({...newMedia, title: e.target.value})}
                />
                <input
                    type="url"
                    placeholder={newMedia.mediaType === 'PHOTO' ? '이미지 URL' : '유튜브 링크'}
                    value={newMedia.url}
                    onChange={(e) => setNewMedia({...newMedia, url: e.target.value})}
                    style={{flex: 1, minWidth: '200px'}}
                />
                <input
                    type="text"
                    placeholder="설명 (선택)"
                    value={newMedia.description}
                    onChange={(e) => setNewMedia({...newMedia, description: e.target.value})}
                />
                <button type="submit">추가</button>
            </form>

            {/* 필터 버튼 */}
            <div className="media-filter">
                <button
                    className={filter === 'ALL' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('ALL')}
                >
                    전체 ({mediaList.length})
                </button>
                <button
                    className={filter === 'PHOTO' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('PHOTO')}
                >
                    📷 사진
                </button>
                <button
                    className={filter === 'VIDEO' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('VIDEO')}
                >
                    🎬 동영상
                </button>
            </div>

            {/* 미디어 그리드 */}
            {mediaList.length === 0 ? (
                <p style={{textAlign: 'center', color: '#666', padding: '40px'}}>
                    등록된 미디어가 없습니다. 사진이나 동영상을 추가해보세요!
                </p>
            ) : (
                <div className="media-grid">
                    {mediaList.map((media) => (
                        <div key={media.id} className="media-card">
                            {/* 사진이면 이미지 표시 */}
                            {media.mediaType === 'PHOTO' && (
                                <div className="media-preview">
                                    <img
                                        src={media.url}
                                        alt={media.title}
                                        onError={(e) => { e.target.src = ''; e.target.alt = '이미지를 불러올 수 없습니다'; }}
                                    />
                                </div>
                            )}

                            {/* 동영상이면 유튜브 임베드 or 링크 */}
                            {media.mediaType === 'VIDEO' && (
                                <div className="media-preview video">
                                    {getYoutubeEmbedUrl(media.url) ? (
                                        <iframe
                                            src={getYoutubeEmbedUrl(media.url)}
                                            title={media.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <a href={media.url} target="_blank" rel="noopener noreferrer" className="video-link">
                                            🎬 동영상 보기
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className="media-info">
                                <div className="media-title">{media.title}</div>
                                {media.description && (
                                    <div className="media-desc">{media.description}</div>
                                )}
                                <div className="media-date">{media.uploadDate || ''}</div>
                            </div>
                            <button
                                onClick={() => handleDeleteMedia(media.id, media.title)}
                                className="delete-btn-small"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MediaGallery;
