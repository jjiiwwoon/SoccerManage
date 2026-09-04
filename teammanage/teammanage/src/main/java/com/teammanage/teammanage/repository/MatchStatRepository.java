/**
 * ====================================
 * 파일: MatchStatRepository.java
 * 위치: repository 패키지 안에 넣기
 * 분야: 백엔드 / 데이터 접근
 * 기능: 개인 스탯 DB 접근 (CRUD + 커스텀 조회)
 * ====================================
 *
 * MemberRepository, MatchRepository랑 같은 패턴이야.
 * 다른 점은 커스텀 조회 메서드가 좀 더 있다는 거야.
 *
 * findByMatchId(Long matchId) → 특정 경기의 모든 스탯 가져오기
 * findByMemberId(Long memberId) → 특정 선수의 모든 스탯 가져오기
 *
 * JPA가 메서드 이름 규칙에 맞춰 SQL을 자동 생성해줘.
 */
package com.teammanage.teammanage.repository;

import com.teammanage.teammanage.entity.MatchStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchStatRepository extends JpaRepository<MatchStat, Long> {
    // 특정 경기의 모든 스탯 조회
    // SQL: SELECT * FROM match_stat WHERE match_id = ?
    List<MatchStat> findByMatchId(Long matchId);

    // 특정 선수의 모든 스탯 조회
    // SQL: SELECT * FROM match_stat WHERE member_id = ?
    List<MatchStat> findByMemberId(Long memberId);
}
