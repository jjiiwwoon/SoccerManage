/**
 * ====================================
 * 파일: Match.java
 * 위치: entity 패키지 안에 넣기
 * 분야: 백엔드 / 엔티티
 * 기능: 경기 기록 테이블 구조 정의
 * ====================================
 *
 * Member.java에서 @Entity로 MEMBER 테이블을 만들었듯이,
 * 이 파일은 @Entity로 MATCH_RECORD 테이블을 만들어.
 *
 * DB 수업에서 CREATE TABLE로 테이블 만들었던 거랑 같아.
 * JPA가 이 클래스를 보고 자동으로 테이블을 만들어줘.
 *
 * 참고: "Match"는 SQL 예약어라서 테이블 이름을 "match_record"로 지정했어.
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "match_record")   // "match"가 SQL 예약어라서 다른 이름 사용
@Getter @Setter
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;                // 고유 번호 (자동 증가)

    private LocalDate matchDate;    // 경기 날짜

    private String opponent;        // 상대팀 이름

    private Integer ourScore;       // 우리팀 점수

    private Integer opponentScore;  // 상대팀 점수

    @Enumerated(EnumType.STRING)    // DB에 "WIN", "DRAW", "LOSE" 문자열로 저장
    private MatchResult result;     // 경기 결과 (승/무/패)

    private String location;        // 경기 장소
}
