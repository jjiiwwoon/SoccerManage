/**
 * ====================================
 * 파일: GalleryService.java (신규)
 * 위치: service 패키지
 * 기능: 갤러리 비즈니스 로직
 * ====================================
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.GalleryItem;
import com.teammanage.teammanage.repository.GalleryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryItemRepository galleryItemRepository;

    // 전체 갤러리 조회 (최신순)
    public List<GalleryItem> getAllItems() {
        return galleryItemRepository.findAllByOrderByCreatedAtDesc();
    }

    // 타입별 조회
    public List<GalleryItem> getItemsByType(String type) {
        return galleryItemRepository.findByTypeOrderByCreatedAtDesc(type);
    }

    // 단일 항목 조회
    public GalleryItem getItem(Long id) {
        return galleryItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("갤러리 항목을 찾을 수 없습니다."));
    }

    // 사진 업로드 (Base64)
    public GalleryItem uploadPhoto(String base64Data, String fileName, String title) {
        GalleryItem item = new GalleryItem();
        item.setType("PHOTO");
        item.setFileData(base64Data);
        item.setFileName(fileName);
        item.setTitle(title);
        return galleryItemRepository.save(item);
    }

    // 동영상 등록 (URL)
    public GalleryItem addVideo(String url, String title, String thumbnailData) {
        GalleryItem item = new GalleryItem();
        item.setType("VIDEO");
        item.setFileData(url);
        item.setTitle(title);
        item.setThumbnailData(thumbnailData);
        return galleryItemRepository.save(item);
    }

    // 항목 삭제
    public void deleteItem(Long id) {
        galleryItemRepository.deleteById(id);
    }

    // 제목 수정
    public GalleryItem updateTitle(Long id, String title) {
        GalleryItem item = getItem(id);
        item.setTitle(title);
        return galleryItemRepository.save(item);
    }
}
