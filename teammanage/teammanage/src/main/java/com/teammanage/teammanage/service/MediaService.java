/**
 * ====================================
 * 파일: MediaService.java
 * 위치: service 패키지
 * 기능: 미디어 갤러리 비즈니스 로직
 * ====================================
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.Media;
import com.teammanage.teammanage.entity.MediaType;
import com.teammanage.teammanage.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    // 전체 미디어 조회 (최신순)
    public List<Media> getAllMedia() {
        return mediaRepository.findAllByOrderByUploadDateDesc();
    }

    // 타입별 필터 조회 (PHOTO만 또는 VIDEO만)
    public List<Media> getMediaByType(MediaType mediaType) {
        return mediaRepository.findByMediaTypeOrderByUploadDateDesc(mediaType);
    }

    // 미디어 추가
    public Media createMedia(Media media) {
        if (media.getUploadDate() == null) {
            media.setUploadDate(LocalDate.now());   // 날짜 없으면 오늘 날짜
        }
        return mediaRepository.save(media);
    }

    // 미디어 삭제
    public void deleteMedia(Long id) {
        mediaRepository.deleteById(id);
    }
}
