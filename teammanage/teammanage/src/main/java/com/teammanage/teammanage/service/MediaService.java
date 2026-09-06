/**
 * ====================================
 * 파일: MediaService.java (수정됨)
 * 위치: service 패키지 (기존 파일 덮어쓰기)
 * 기능: 미디어 갤러리 비즈니스 로직 + 파일 저장
 * ====================================
 *
 * 변경 내용:
 * - uploadMedia() 추가: 파일을 서버에 저장하고 DB에 기록
 * - 파일은 uploads/ 폴더에 저장 (UUID로 이름 생성해서 중복 방지)
 *
 * UUID란?
 *   고유한 랜덤 문자열이야. 같은 파일명으로 올려도
 *   "abc123-photo.jpg" 이런 식으로 고유 이름이 생겨서 충돌이 안 나.
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.Media;
import com.teammanage.teammanage.entity.MediaType;
import com.teammanage.teammanage.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;

    // application.yaml에서 설정한 업로드 경로
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    // 전체 미디어 조회 (최신순)
    public List<Media> getAllMedia() {
        return mediaRepository.findAllByOrderByUploadDateDesc();
    }

    // 타입별 필터 조회
    public List<Media> getMediaByType(MediaType mediaType) {
        return mediaRepository.findByMediaTypeOrderByUploadDateDesc(mediaType);
    }

    // 파일 업로드 (새로 추가)
    public Media uploadMedia(MultipartFile file, String title, String description) {
        try {
            // 1. 업로드 폴더 생성 (없으면)
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. 고유 파일명 생성 (UUID + 원래 확장자)
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFilename = UUID.randomUUID().toString() + extension;

            // 3. 파일 저장
            Path filePath = uploadPath.resolve(savedFilename);
            Files.copy(file.getInputStream(), filePath);

            // 4. DB에 미디어 정보 저장
            Media media = new Media();
            media.setTitle(title);
            media.setMediaType(MediaType.PHOTO);
            media.setUrl("/uploads/" + savedFilename);  // 접근 가능한 URL
            media.setDescription(description);
            media.setUploadDate(LocalDate.now());

            return mediaRepository.save(media);

        } catch (IOException e) {
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }

    // 동영상 URL 추가 (기존 유지)
    public Media createMedia(Media media) {
        if (media.getUploadDate() == null) {
            media.setUploadDate(LocalDate.now());
        }
        return mediaRepository.save(media);
    }

    // 미디어 삭제
    public void deleteMedia(Long id) {
        mediaRepository.deleteById(id);
    }
}
