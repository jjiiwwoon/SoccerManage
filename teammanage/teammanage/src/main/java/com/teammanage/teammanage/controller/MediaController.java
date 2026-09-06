/**
 * ====================================
 * 파일: MediaController.java (수정됨)
 * 위치: controller 패키지 (기존 파일 덮어쓰기)
 * 기능: 미디어 갤러리 REST API + 파일 업로드
 * ====================================
 *
 * 변경 내용:
 * - POST /api/media/upload 추가: 파일을 직접 업로드
 * - 업로드된 파일은 서버의 uploads/ 폴더에 저장
 * - 저장된 파일의 URL을 DB에 기록
 *
 * @RequestParam("file") MultipartFile
 *   → HTML의 <input type="file">에서 보낸 파일을 받아주는 거야.
 *   Android에서 Intent로 갤러리에서 사진 가져오던 거랑 비슷해.
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.Media;
import com.teammanage.teammanage.entity.MediaType;
import com.teammanage.teammanage.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    // GET /api/media 또는 GET /api/media?type=PHOTO
    @GetMapping
    public List<Media> getMedia(@RequestParam(required = false) MediaType type) {
        if (type != null) {
            return mediaService.getMediaByType(type);
        }
        return mediaService.getAllMedia();
    }

    // POST /api/media/upload → 파일 업로드 (새로 추가)
    @PostMapping("/upload")
    public Media uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description) {
        return mediaService.uploadMedia(file, title, description);
    }

    // POST /api/media → 동영상 URL 추가 (기존 유지)
    @PostMapping
    public Media createMedia(@RequestBody Media media) {
        return mediaService.createMedia(media);
    }

    // DELETE /api/media/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.ok().build();
    }
}
