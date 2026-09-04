/**
 * ====================================
 * 파일: Media.java
 * 위치: entity 패키지
 * 기능: 사진/동영상 갤러리 테이블
 * ====================================
 *
 * 경기 사진이나 하이라이트 영상의 URL을 저장하는 테이블이야.
 *
 * 사진: 이미지 URL (직접 업로드는 배포 단계에서 추가)
 * 동영상: 유튜브 링크 등 외부 동영상 URL
 *
 * mediaType으로 PHOTO/VIDEO를 구분해서
 * 프론트에서 "사진만 보기", "동영상만 보기" 필터가 가능해.
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter @Setter
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;               // 제목 (예: "3월 15일 경기 하이라이트")

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type")
    private MediaType mediaType;        // PHOTO 또는 VIDEO

    private String url;                 // 미디어 URL (이미지 주소 or 유튜브 링크)

    private String description;         // 설명 (선택)

    private LocalDate uploadDate;       // 업로드 날짜
}
