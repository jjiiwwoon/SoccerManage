/**
 * ====================================
 * 파일: GalleryItemRepository.java (신규)
 * 위치: repository 패키지
 * 기능: 갤러리 데이터 접근
 * ====================================
 */
package com.teammanage.teammanage.repository;

import com.teammanage.teammanage.entity.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findAllByOrderByCreatedAtDesc();
    List<GalleryItem> findByTypeOrderByCreatedAtDesc(String type);
}
