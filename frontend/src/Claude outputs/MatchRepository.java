/**
 * ====================================
 * 파일: MatchRepository.java
 * 위치: repository 패키지 안에 넣기
 * 분야: 백엔드 / 데이터 접근
 * 기능: 경기 기록 DB 접근 (CRUD 자동 생성)
 * ====================================
 *
 * MemberRepository 만들었던 것과 완전 똑같아!
 * JpaRepository를 상속하면 findAll(), findById(), save(), deleteById()가
 * 자동으로 만들어져.
 *
 * 추가로 findAllByOrderByMatchDateDesc()를 넣었는데,
 * 이건 "경기 날짜 최신순으로 정렬해서 가져와"라는 뜻이야.
 * JPA가 메서드 이름을 분석해서 SQL을 자동으로 만들어줘! (Spring Data JPA 규칙)
 */
package com.teammanage.teammanage.repository;

import com.teammanage.teammanage.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    // 경기 날짜 최신순으로 정렬해서 전체 조회
    // SQL로 하면: SELECT * FROM match_record ORDER BY match_date DESC
    List<Match> findAllByOrderByMatchDateDesc();
}
