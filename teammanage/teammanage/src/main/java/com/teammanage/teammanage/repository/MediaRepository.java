/**
 * ====================================
 * 파일: MediaRepository.java
 * 위치: repository 패키지
 * 기능: 미디어 갤러리 DB 접근
 * ====================================
 *
 * 전체 조회, 타입별 필터(사진만/동영상만) 조회를 지원해.
 */
package com.teammanage.teammanage.repository;

import com.teammanage.teammanage.entity.Media;
import com.teammanage.teammanage.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    // 최신순 전체 조회
    List<Media> findAllByOrderByUploadDateDesc();

    // 타입별 필터 (PHOTO만 또는 VIDEO만) - 최신순
    List<Media> findByMediaTypeOrderByUploadDateDesc(MediaType mediaType);
}
