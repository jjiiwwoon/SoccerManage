/**
 * ====================================
 * 파일: Member.java (수정됨)
 * 위치: entity 패키지 (기존 파일 덮어쓰기)
 * 기능: 팀 멤버 정보 + SNS 링크 추가
 * ====================================
 *
 * 기존: name, position, backNumber, profileImage, role
 * 추가: youtubeLink, instagramLink, snsLink (외부 링크 기능)
 *
 * 인스타, 유튜브, 기타 SNS 주소를 저장해서
 * 프로필에서 클릭하면 해당 페이지로 이동하게 해.
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;             // 이름

    private String position;         // 포지션 (GK, DF, MF, FW)

    private Integer backNumber;      // 등번호

    private String profileImage;     // 프로필 사진 URL

    @Enumerated(EnumType.STRING)
    private MemberRole role;         // 역할 (CAPTAIN, MANAGER, MEMBER)

    // --- SNS 링크 (새로 추가) ---
    private String youtubeLink;      // 유튜브 링크

    private String instagramLink;    // 인스타그램 링크

    private String snsLink;          // 기타 SNS 링크 (트위터, 팀 홈페이지 등)
}
