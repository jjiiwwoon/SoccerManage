/**
 * ====================================
 * 파일: MemberList.js (수정됨)
 * 위치: frontend/src/pages/ (기존 파일 덮어쓰기)
 * 기능: 멤버 목록 + SNS 링크 입력 추가 + 프로필 링크
 * ====================================
 *
 * 기존: 이름, 포지션, 등번호, 역할
 * 추가: 유튜브/인스타/SNS 링크 입력, 이름 클릭 시 프로필 이동
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMembers, createMember, deleteMember } from '../api/memberApi';

function MemberList() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLinkInputs, setShowLinkInputs] = useState(false);

    const [newMember, setNewMember] = useState({
        name: '',
        position: '',
        backNumber: '',
        role: 'MEMBER',
        youtubeLink: '',
        instagramLink: '',
        snsLink: '',
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
            setError('멤버 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddMember(e) {
        e.preventDefault();
        if (!newMember.name) {
            alert('이름을 입력해주세요.');
            return;
        }
        try {
            await createMember({
                ...newMember,
                backNumber: newMember.backNumber ? parseInt(newMember.backNumber) : null,
            });
            setNewMember({ name: '', position: '', backNumber: '', role: 'MEMBER', youtubeLink: '', instagramLink: '', snsLink: '' });
            setShowLinkInputs(false);
            fetchMembers();
        } catch (err) {
            alert('멤버 추가에 실패했습니다.');
        }
    }

    async function handleDeleteMember(id, name) {
        if (window.confirm(`${name} 선수를 삭제하시겠습니까?`)) {
            try {
                await deleteMember(id);
                fetchMembers();
            } catch (err) {
                alert('멤버 삭제에 실패했습니다.');
            }
        }
    }

    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="member-list">
            <h2>팀 멤버 목록</h2>

            <form className="add-member-form" onSubmit={handleAddMember}>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="이름"
                        value={newMember.name}
                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    />
                    <select
                        value={newMember.position}
                        onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                    >
                        <option value="">포지션 선택</option>
                        <option value="GK">GK (골키퍼)</option>
                        <option value="DF">DF (수비수)</option>
                        <option value="MF">MF (미드필더)</option>
                        <option value="FW">FW (공격수)</option>
                    </select>
                    <input
                        type="number"
                        placeholder="등번호"
                        value={newMember.backNumber}
                        onChange={(e) => setNewMember({...newMember, backNumber: e.target.value})}
                    />
                    <select
                        value={newMember.role}
                        onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    >
                        <option value="MEMBER">일반 팀원</option>
                        <option value="MANAGER">매니저</option>
                        <option value="CAPTAIN">주장</option>
                    </select>
                </div>

                {/* SNS 링크 입력 (토글) */}
                <button
                    type="button"
                    onClick={() => setShowLinkInputs(!showLinkInputs)}
                    className="toggle-link-btn"
                >
                    {showLinkInputs ? '▲ 링크 접기' : '▼ SNS 링크 추가'}
                </button>

                {showLinkInputs && (
                    <div className="form-row link-row">
                        <input
                            type="url"
                            placeholder="유튜브 링크"
                            value={newMember.youtubeLink}
                            onChange={(e) => setNewMember({...newMember, youtubeLink: e.target.value})}
                        />
                        <input
                            type="url"
                            placeholder="인스타그램 링크"
                            value={newMember.instagramLink}
                            onChange={(e) => setNewMember({...newMember, instagramLink: e.target.value})}
                        />
                        <input
                            type="url"
                            placeholder="기타 SNS 링크"
                            value={newMember.snsLink}
                            onChange={(e) => setNewMember({...newMember, snsLink: e.target.value})}
                        />
                    </div>
                )}

                <button type="submit">멤버 추가</button>
            </form>

            {members.length === 0 ? (
                <p style={{textAlign: 'center', color: '#666', padding: '40px'}}>
                    등록된 멤버가 없습니다. 첫 번째 멤버를 추가해보세요!
                </p>
            ) : (
                <div className="member-grid">
                    {members.map((member) => (
                        <div key={member.id} className="member-card">
                            <Link to={`/players/${member.id}`} className="member-name-link">
                                <div className="name">{member.name}</div>
                            </Link>
                            <div className="position">{member.position || '미정'}</div>
                            <div className="back-number">
                                {member.backNumber ? `#${member.backNumber}` : '등번호 미정'}
                            </div>
                            <span className={`role-badge ${member.role}`}>
                                {member.role === 'CAPTAIN' ? '주장' :
                                 member.role === 'MANAGER' ? '매니저' : '팀원'}
                            </span>

                            {/* SNS 링크 아이콘 */}
                            {(member.youtubeLink || member.instagramLink || member.snsLink) && (
                                <div className="member-links">
                                    {member.youtubeLink && (
                                        <a href={member.youtubeLink} target="_blank" rel="noopener noreferrer" title="YouTube">▶</a>
                                    )}
                                    {member.instagramLink && (
                                        <a href={member.instagramLink} target="_blank" rel="noopener noreferrer" title="Instagram">📷</a>
                                    )}
                                    {member.snsLink && (
                                        <a href={member.snsLink} target="_blank" rel="noopener noreferrer" title="SNS">🔗</a>
                                    )}
                                </div>
                            )}

                            <div style={{marginTop: '10px'}}>
                                <button
                                    onClick={() => handleDeleteMember(member.id, member.name)}
                                    style={{
                                        background: '#e74c3c', color: 'white',
                                        border: 'none', padding: '5px 15px',
                                        borderRadius: '5px', cursor: 'pointer'
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MemberList;
