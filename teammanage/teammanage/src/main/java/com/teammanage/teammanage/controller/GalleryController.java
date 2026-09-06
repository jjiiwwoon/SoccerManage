/**
 * ====================================
 * 파일: GalleryController.java (신규)
 * 위치: controller 패키지
 * 기능: 갤러리 REST API
 * ====================================
 *
 * 엔드포인트:
 * - GET    /api/gallery              → 전체 조회
 * - GET    /api/gallery?type=PHOTO   → 타입별 조회
 * - GET    /api/gallery/{id}         → 단일 조회
 * - POST   /api/gallery/photo        → 사진 업로드 (MultipartFile)
 * - POST   /api/gallery/video        → 동영상 URL 등록
 * - PUT    /api/gallery/{id}         → 제목 수정
 * - DELETE /api/gallery/{id}         → 삭제
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.GalleryItem;
import com.teammanage.teammanage.service.GalleryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    // GET /api/gallery — 전체 또는 타입별 조회
    @GetMapping
    public List<GalleryItem> getItems(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            return galleryService.getItemsByType(type.toUpperCase());
        }
        return galleryService.getAllItems();
    }

    // GET /api/gallery/{id} — 단일 조회
    @GetMapping("/{id}")
    public GalleryItem getItem(@PathVariable Long id) {
        return galleryService.getItem(id);
    }

    // POST /api/gallery/photo — 사진 업로드
    @PostMapping("/photo")
    public GalleryItem uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false, defaultValue = "") String title
    ) throws IOException {
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String contentType = file.getContentType();
        String fullBase64 = "data:" + contentType + ";base64," + base64;
        return galleryService.uploadPhoto(fullBase64, file.getOriginalFilename(), title);
    }

    // POST /api/gallery/video — 동영상 URL 등록
    @PostMapping("/video")
    public GalleryItem addVideo(@RequestBody Map<String, String> body) {
        String url = body.get("url");
        String title = body.getOrDefault("title", "");
        String thumbnail = body.get("thumbnail");
        return galleryService.addVideo(url, title, thumbnail);
    }

    // PUT /api/gallery/{id} — 제목 수정
    @PutMapping("/{id}")
    public GalleryItem updateItem(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String title = body.get("title");
        return galleryService.updateTitle(id, title);
    }

    // DELETE /api/gallery/{id} — 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        galleryService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
