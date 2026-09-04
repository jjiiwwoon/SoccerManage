/**
 * ====================================
 * 파일: MatchResult.java
 * 위치: entity 패키지 안에 넣기
 * 분야: 백엔드 / 엔티티
 * 기능: 경기 결과를 나타내는 열거형(enum)
 * ====================================
 *
 * MemberRole(CAPTAIN, MANAGER, MEMBER) 만들었던 것처럼
 * 경기 결과도 정해진 값만 쓸 수 있게 enum으로 만들어.
 *
 * WIN = 승리, DRAW = 무승부, LOSE = 패배
 */
package com.teammanage.teammanage.entity;

public enum MatchResult {
    WIN,    // 승리
    DRAW,   // 무승부
    LOSE    // 패배
}
