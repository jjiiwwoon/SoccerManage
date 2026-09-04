/**
 * ====================================
 * 파일: MatchStat.java (수정됨)
 * 위치: entity 패키지 (기존 파일 덮어쓰기)
 * 기능: 경기별 개인 스탯 + 쿼터 수 추가
 * ====================================
 *
 * 기존: goals, assists만 있었음
 * 추가: quarters (뛴 쿼터 수, 1경기 = 최대 4쿼터)
 *
 * 1쿼터라도 뛰면 경기수 1로 카운트,
 * 쿼터수는 실제로 뛴 쿼터 수를 기록해.
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class MatchStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private Integer goals = 0;       // 골 수

    private Integer assists = 0;     // 어시스트 수

    private Integer quarters = 0;    // 뛴 쿼터 수 (1~4)
}
