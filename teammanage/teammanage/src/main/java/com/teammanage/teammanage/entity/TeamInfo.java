/**
 * ====================================
 * 파일: TeamInfo.java (신규)
 * 위치: entity 패키지
 * 기능: 팀 소개 정보 (이름, 소개글, 사진, 링크 등)
 * ====================================
 *
 * 테이블에 단 1개의 row만 존재 (싱글톤 패턴)
 * 홈 화면에서 직접 편집 가능
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

    private String link1;               // 링크 1 (예: 인스타그램)
    private String link1Label;          // 링크 1 라벨

    private String link2;               // 링크 2 (예: 카카오톡)
    private String link2Label;          // 링크 2 라벨

    private String link3;               // 링크 3
    private String link3Label;          // 링크 3 라벨
}
