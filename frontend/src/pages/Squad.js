/**
 * ====================================
 * 파일: Squad.js (새 파일)
 * 위치: frontend/src/pages/Squad.js
 * 기능: 스쿼드 페이지 - 팀원 카드 + 선수 등록/삭제
 * ====================================
 *
 * 디자인의 스쿼드 페이지 구현:
 * - 포지션별 필터 (ALL, GK, DF, MF, FW + 인원수)
 * - 선수 카드 그리드 (사진, 이름, 등번호, 포지션 배지, 삭제 버튼)
 * - 선수 등록 폼 (이름, 등번호, 포지션, 연락처)
 */
import React, { useState, useEffect } from 'react';
import { getMembers, createMember, deleteMember } from '../api/memberApi';

function Squad() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);

    const [newMember, setNewMember] = useState({
        name: '',
        backNumber: '',
        position: '',
        phone: '',
    });

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

    // 필터링
    const filteredMembers = members.filter(m => {
        if (filter === 'all') return true;
        return getPositionLabel(m.position) === filter.toUpperCase();
    });

    // 선수 등록
    async function handleSubmit(e) {
        e.preventDefault();
        if (!newMember.name || !newMember.backNumber || !newMember.position) {
            alert('이름, 등번호, 포지션은 필수입니다.');
            return;
        }
        try {
            await createMember({
                name: newMember.name,
                backNumber: parseInt(newMember.backNumber),
                position: newMember.position,
                role: 'MEMBER',
            });
            setNewMember({ name: '', backNumber: '', position: '', phone: '' });
            setShowForm(false);
            fetchMembers();
        } catch (err) {
            alert('선수 등록에 실패했습니다.');
        }
    }

    // 선수 삭제
    async function handleDelete(id, name) {
        if (window.confirm(`${name} 선수를 삭제하시겠습니까?`)) {
            try {
                await deleteMember(id);
                fetchMembers();
            } catch (err) {
                alert('선수 삭제에 실패했습니다.');
            }
        }
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

            {/* 포지션 필터 */}
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
                        className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label} ({getPositionCount(tab.key)})
                    </button>
                ))}
            </div>

            {/* 선수 카드 그리드 */}
            <div className="player-grid">
                {filteredMembers.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        등록된 선수가 없습니다.
                    </p>
                ) : (
                    filteredMembers.map(member => (
                        <div key={member.id} className="player-card">
                            <button
                                className="player-delete"
                                onClick={() => handleDelete(member.id, member.name)}
                                title="삭제"
                            >
                                🗑
                            </button>
                            <div className="player-avatar">
                                👤
                            </div>
                            <div className="player-name">{member.name}</div>
                            <div className="player-number">
                                #{member.backNumber || '-'}
                            </div>
                            <span className={`badge ${getPositionClass(member.position)}`}>
                                {getPositionLabel(member.position)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* 선수 등록 폼 */}
            {showForm && (
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-title">선수 등록</div>
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
                        <div className="form-group">
                            <label className="form-label">연락처</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="010-0000-0000"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                setShowForm(false);
                                setNewMember({ name: '', backNumber: '', position: '', phone: '' });
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
        </div>
    );
}

export default Squad;
