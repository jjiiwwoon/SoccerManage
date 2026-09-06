/**
 * ====================================
 * 파일: Squad.js (수정됨)
 * 위치: frontend/src/pages/Squad.js
 * 기능: 스쿼드 페이지 - 팀원 카드 + 등록/편집/삭제/검색
 * ====================================
 *
 * 변경사항:
 * - 연락처 필드 제거
 * - 프로필 사진 업로드 기능 (선택사항)
 * - 등번호 표기: # → No.
 * - 포지션 필터 탭 포지션별 색상
 * - 선수 가나다순 정렬
 * - 선수 편집 모달 (이름, 등번호, 포지션, 사진 수정/삭제)
 * - 선수 검색 기능 (이름, 등번호)
 */
import React, { useState, useEffect, useRef } from 'react';
import {
    getMembers, createMemberWithPhoto, updateMemberWithPhoto, deleteMember
} from '../api/memberApi';

function Squad() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);

    // 등록 폼
    const [newMember, setNewMember] = useState({
        name: '',
        backNumber: '',
        position: '',
    });
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const fileInputRef = useRef(null);

    // 편집 모달
    const [editMember, setEditMember] = useState(null); // 편집 대상 멤버
    const [editForm, setEditForm] = useState({
        name: '',
        backNumber: '',
        position: '',
    });
    const [editPhotoFile, setEditPhotoFile] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);
    const [removePhoto, setRemovePhoto] = useState(false);
    const [saving, setSaving] = useState(false);
    const editFileInputRef = useRef(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    async function fetchMembers() {
        try {
            setLoading(true);
            const data = await getMembers();
            setMembers(data);
        } catch (err) {
            console.error('멤버 로딩 실패:', err);
        } finally {
            setLoading(false);
        }
    }

    // 포지션 판별
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

    // 포지션별 인원수
    function getPositionCount(pos) {
        if (pos === 'all') return members.length;
        return members.filter(m => getPositionLabel(m.position) === pos.toUpperCase()).length;
    }

    // 필터링 + 검색 + 가나다순 정렬
    const filteredMembers = members
        .filter(m => {
            if (filter !== 'all' && getPositionLabel(m.position) !== filter.toUpperCase()) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                const nameMatch = (m.name || '').toLowerCase().includes(q);
                const numberMatch = String(m.backNumber || '').includes(q);
                return nameMatch || numberMatch;
            }
            return true;
        })
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));

    // === 등록 관련 ===
    function handleProfileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    }

    function clearProfile() {
        setProfileFile(null);
        setProfilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!newMember.name || !newMember.backNumber || !newMember.position) {
            alert('이름, 등번호, 포지션은 필수입니다.');
            return;
        }
        try {
            await createMemberWithPhoto(
                newMember.name,
                parseInt(newMember.backNumber),
                newMember.position,
                'MEMBER',
                profileFile
            );
            setNewMember({ name: '', backNumber: '', position: '' });
            clearProfile();
            setShowForm(false);
            fetchMembers();
        } catch (err) {
            alert('선수 등록에 실패했습니다.');
        }
    }

    // === 편집 모달 관련 ===
    function openEditModal(member) {
        setEditMember(member);
        setEditForm({
            name: member.name || '',
            backNumber: member.backNumber || '',
            position: member.position || '',
        });
        setEditPhotoFile(null);
        setEditPhotoPreview(member.profilePhoto || null);
        setRemovePhoto(false);
    }

    function closeEditModal() {
        setEditMember(null);
        setEditForm({ name: '', backNumber: '', position: '' });
        setEditPhotoFile(null);
        setEditPhotoPreview(null);
        setRemovePhoto(false);
    }

    function handleEditPhotoSelect(e) {
        const file = e.target.files[0];
        if (file) {
            setEditPhotoFile(file);
            setEditPhotoPreview(URL.createObjectURL(file));
            setRemovePhoto(false);
        }
    }

    function handleRemoveEditPhoto() {
        setEditPhotoFile(null);
        setEditPhotoPreview(null);
        setRemovePhoto(true);
        if (editFileInputRef.current) editFileInputRef.current.value = '';
    }

    async function handleEditSubmit(e) {
        e.preventDefault();
        if (!editForm.name || !editForm.backNumber || !editForm.position) {
            alert('이름, 등번호, 포지션은 필수입니다.');
            return;
        }
        setSaving(true);
        try {
            await updateMemberWithPhoto(
                editMember.id,
                editForm.name,
                parseInt(editForm.backNumber),
                editForm.position,
                editPhotoFile,
                removePhoto
            );
            closeEditModal();
            fetchMembers();
        } catch (err) {
            alert('선수 정보 수정에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    }

    // 삭제 (편집 모달 내)
    async function handleDelete(id, name) {
        if (!window.confirm(`${name} 선수를 삭제하시겠습니까?`)) return;
        try {
            await deleteMember(id);
            closeEditModal();
            fetchMembers();
        } catch (err) {
            alert('선수 삭제에 실패했습니다.');
        }
    }

    // 포지션 필터 탭 색상 클래스
    function getFilterTabClass(tabKey) {
        if (filter !== tabKey) return 'filter-tab';
        if (tabKey === 'all') return 'filter-tab active';
        return `filter-tab active filter-tab-${tabKey}`;
    }

    if (loading) return <div className="loading">로딩 중...</div>;

    return (
        <div className="squad-page">
            <div className="page-header">
                <h1 className="page-title">스쿼드</h1>
                <button
                    className="btn btn-gold"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '닫기' : '+ 선수 등록'}
                </button>
            </div>

            {/* 포지션 필터 + 검색 */}
            <div className="squad-toolbar">
                <div className="filter-tabs">
                    {[
                        { key: 'all', label: 'ALL' },
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
                            {tab.label} ({getPositionCount(tab.key)})
                        </button>
                    ))}
                </div>
                <div className="squad-search">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 이름 또는 등번호 검색"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="search-clear"
                            onClick={() => setSearchQuery('')}
                            title="검색 초기화"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* 선수 카드 그리드 */}
            <div className="player-grid">
                {filteredMembers.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        {searchQuery ? `"${searchQuery}" 검색 결과가 없습니다.` : '등록된 선수가 없습니다.'}
                    </p>
                ) : (
                    filteredMembers.map(member => (
                        <div
                            key={member.id}
                            className="player-card"
                            onClick={() => openEditModal(member)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="player-avatar">
                                {member.profilePhoto ? (
                                    <img
                                        src={member.profilePhoto}
                                        alt={member.name}
                                        className="player-avatar-img"
                                    />
                                ) : (
                                    '👤'
                                )}
                            </div>
                            <div className="player-name">{member.name}</div>
                            <div className="player-number">
                                No.{member.backNumber || '-'}
                            </div>
                            <span className={`badge ${getPositionClass(member.position)}`}>
                                {getPositionLabel(member.position)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* ===== 선수 등록 폼 ===== */}
            {showForm && (
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-title">선수 등록</div>

                    <div className="profile-upload-area">
                        <div
                            className="profile-upload-preview"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {profilePreview ? (
                                <img src={profilePreview} alt="미리보기" className="profile-upload-img" />
                            ) : (
                                <div className="profile-upload-placeholder">
                                    <span style={{ fontSize: '2rem' }}>📷</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                        사진 추가
                                    </span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileSelect}
                            style={{ display: 'none' }}
                        />
                        {profilePreview && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline"
                                onClick={clearProfile}
                                style={{ marginTop: '8px' }}
                            >
                                사진 제거
                            </button>
                        )}
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            선택사항
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">이름 *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="선수 이름"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">등번호 *</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="등번호"
                                value={newMember.backNumber}
                                onChange={(e) => setNewMember({ ...newMember, backNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">포지션 *</label>
                            <select
                                className="form-select"
                                value={newMember.position}
                                onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                                required
                            >
                                <option value="">선택</option>
                                <option value="GK">GK (골키퍼)</option>
                                <option value="DF">DF (수비수)</option>
                                <option value="MF">MF (미드필더)</option>
                                <option value="FW">FW (공격수)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                setShowForm(false);
                                setNewMember({ name: '', backNumber: '', position: '' });
                                clearProfile();
                            }}
                        >
                            취소
                        </button>
                        <button type="submit" className="btn btn-gold">
                            등록
                        </button>
                    </div>
                </form>
            )}

            {/* ===== 선수 편집 모달 ===== */}
            {editMember && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="form-title">선수 정보 수정</div>
                        <form onSubmit={handleEditSubmit}>
                            {/* 프로필 사진 편집 */}
                            <div className="profile-upload-area">
                                <div
                                    className="profile-upload-preview"
                                    onClick={() => editFileInputRef.current?.click()}
                                >
                                    {editPhotoPreview ? (
                                        <img src={editPhotoPreview} alt="프로필" className="profile-upload-img" />
                                    ) : (
                                        <div className="profile-upload-placeholder">
                                            <span style={{ fontSize: '2rem' }}>📷</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                                사진 추가
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={editFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditPhotoSelect}
                                    style={{ display: 'none' }}
                                />
                                {editPhotoPreview && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline"
                                        onClick={handleRemoveEditPhoto}
                                        style={{ marginTop: '8px' }}
                                    >
                                        사진 제거
                                    </button>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">이름 *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">등번호 *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={editForm.backNumber}
                                    onChange={e => setEditForm({ ...editForm, backNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">포지션 *</label>
                                <select
                                    className="form-select"
                                    value={editForm.position}
                                    onChange={e => setEditForm({ ...editForm, position: e.target.value })}
                                    required
                                >
                                    <option value="">선택</option>
                                    <option value="GK">GK (골키퍼)</option>
                                    <option value="DF">DF (수비수)</option>
                                    <option value="MF">MF (미드필더)</option>
                                    <option value="FW">FW (공격수)</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--color-fw)',
                                        border: '1px solid var(--color-fw)',
                                        marginRight: 'auto',
                                    }}
                                    onClick={() => handleDelete(editMember.id, editMember.name)}
                                >
                                    선수 삭제
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeEditModal}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-gold"
                                    disabled={saving}
                                >
                                    {saving ? '저장 중...' : '저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Squad;
