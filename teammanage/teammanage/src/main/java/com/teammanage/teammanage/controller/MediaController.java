/**
 * ====================================
 * 파일: MediaController.java
 * 위치: controller 패키지
 * 기능: 미디어 갤러리 REST API
 * ====================================
 *
 * GET    /api/media           → 전체 미디어 (사진+동영상)
 * GET    /api/media?type=PHOTO → 사진만
 * GET    /api/media?type=VIDEO → 동영상만
 * POST   /api/media           → 미디어 추가
 * DELETE /api/media/{id}      → 미디어 삭제
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.Media;
import com.teammanage.teammanage.entity.MediaType;
import com.teammanage.teammanage.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // POST /api/media
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
