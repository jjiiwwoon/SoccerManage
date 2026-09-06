/**
 * ====================================
 * 파일: Match.java (수정됨)
 * 위치: entity 패키지 (기존 파일 덮어쓰기)
 * 기능: 경기 기록 테이블 구조 정의
 * ====================================
 *
 * 변경사항:
 * - matchTime 필드 추가 (경기 시간, 예: "14:00")
 * - memo 필드 추가 (메모/비고)
 *
 * 일정 등록 시 스코어 없이 날짜+시간+장소+상대팀만 입력하면
 * "예정" 상태로 저장되고, 경기 후 스코어를 입력하면
 * 자동으로 결과(승/무/패)가 계산됨
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "match_record")
@Getter @Setter
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate matchDate;    // 경기 날짜

    private String matchTime;       // 경기 시간 (예: "14:00") — 새로 추가

    private String opponent;        // 상대팀 이름

    private Integer ourScore;       // 우리팀 점수 (null이면 아직 예정인 경기)

    private Integer opponentScore;  // 상대팀 점수

    @Enumerated(EnumType.STRING)
    private MatchResult result;     // 경기 결과 (승/무/패, null이면 예정)

    private String location;        // 경기 장소

    private String memo;            // 메모/비고 — 새로 추가
}
