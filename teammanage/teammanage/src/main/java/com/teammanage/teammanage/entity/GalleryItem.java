/**
 * ====================================
 * 파일: GalleryItem.java (신규)
 * 위치: entity 패키지
 * 기능: 갤러리 항목 (사진/동영상)
 * ====================================
 *
 * 사진: Base64로 DB 저장
 * 동영상: 외부 링크(YouTube 등) 또는 파일 경로
 */
package com.teammanage.teammanage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class GalleryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;               // 제목/설명

    @Column(nullable = false)
    private String type;                // "PHOTO" or "VIDEO"

    @Lob
    @Column(columnDefinition = "TEXT")
    private String fileData;            // 사진: Base64 데이터, 동영상: URL

    private String fileName;            // 원본 파일명

    private String thumbnailData;       // 동영상 썸네일 (선택)

    private LocalDateTime createdAt;    // 업로드 시간

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
