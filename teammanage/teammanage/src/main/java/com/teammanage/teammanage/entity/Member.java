/**
 * ====================================
 * 파일: Member.java (수정됨)
 * 위치: entity 패키지 (기존 파일 덮어쓰기)
 * 기능: 팀 멤버 정보 + 프로필 사진 Base64 추가
 * ====================================
 *
 * 변경사항:
 * - profilePhoto (Base64 TEXT) 필드 추가
 * - profilePhotoFileName 필드 추가
 * - 기존 profileImage 필드 유지 (하위 호환)
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

    private String profileImage;     // 프로필 사진 URL (기존)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String profilePhoto;     // 프로필 사진 Base64 (신규)

    private String profilePhotoFileName;  // 프로필 사진 파일명

    @Enumerated(EnumType.STRING)
    private MemberRole role;         // 역할 (CAPTAIN, MANAGER, MEMBER)

    // --- SNS 링크 ---
    private String youtubeLink;      // 유튜브 링크

    private String instagramLink;    // 인스타그램 링크

    private String snsLink;          // 기타 SNS 링크
}
