/**
 * ====================================
 * 파일: MatchStat.java
 * 위치: entity 패키지 안에 넣기
 * 분야: 백엔드 / 엔티티
 * 기능: 경기별 개인 스탯 테이블 구조 정의
 * ====================================
 *
 * 이건 "경기"와 "선수"를 연결하는 테이블이야.
 * DB 수업에서 배운 "관계 테이블" 기억나?
 *
 * 예를 들어:
 *   - 3월 15일 경기에서 정지원이 골 2개, 어시스트 1개
 *   - 3월 15일 경기에서 김철수가 골 1개, 어시스트 0개
 *
 * 이렇게 "어떤 경기에서 어떤 선수가 뭘 했는지"를 기록하는 거야.
 *
 * @ManyToOne = "여러 개의 스탯이 하나의 경기에 속한다"
 * DB에서 외래키(FK) 설정한 것과 같은 개념이야.
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

    /**
     * 어떤 경기인지 (외래키)
     * DB에서 FOREIGN KEY (match_id) REFERENCES match_record(id) 한 것과 같아
     */
    @ManyToOne
    @JoinColumn(name = "match_id")
    private Match match;

    /**
     * 어떤 선수인지 (외래키)
     * DB에서 FOREIGN KEY (member_id) REFERENCES member(id) 한 것과 같아
     */
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private Integer goals = 0;      // 골 수 (기본값 0)

    private Integer assists = 0;    // 어시스트 수 (기본값 0)
}
