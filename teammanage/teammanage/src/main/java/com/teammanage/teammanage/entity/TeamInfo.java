/**
 * ====================================
 * 파일: TeamInfo.java (수정됨)
 * 위치: entity 패키지
 * 기능: 팀 소개 정보 (이름, 소개글, 사진, 링크 등)
 * ====================================
 *
 * 변경사항:
 * - link1~3 고정 컬럼 → linksJson (JSON 문자열)으로 변경
 * - 링크 개수 제한 없이 동적 관리 가능
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TeamInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String teamName;            // 팀 이름

    @Column(length = 2000)
    private String description;         // 팀 소개글

    @Lob
    @Column(columnDefinition = "TEXT")
    private String photoBase64;         // 팀 사진 (Base64 인코딩)

    private String photoFileName;       // 원본 파일명

    // 기존 link1~3 필드는 유지 (하위 호환, DB 컬럼 유지)
    private String link1;
    private String link1Label;
    private String link2;
    private String link2Label;
    private String link3;
    private String link3Label;

    // 새로운 동적 링크 저장 (JSON 배열 문자열)
    // 예: [{"label":"인스타그램","url":"https://..."},{"label":"카페","url":"https://..."}]
    @Lob
    @Column(columnDefinition = "TEXT")
    private String linksJson;
}
