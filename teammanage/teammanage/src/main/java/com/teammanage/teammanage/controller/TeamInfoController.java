/**
 * ====================================
 * 파일: TeamInfoController.java (신규)
 * 위치: controller 패키지
 * 기능: 팀 정보 REST API
 * ====================================
 *
 * 엔드포인트:
 * - GET    /api/team-info          → 팀 정보 조회
 * - PUT    /api/team-info          → 팀 정보 수정 (이름, 소개, 링크)
 * - POST   /api/team-info/photo    → 팀 사진 업로드 (MultipartFile)
 * - DELETE /api/team-info/photo    → 팀 사진 삭제
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.TeamInfo;
import com.teammanage.teammanage.service.TeamInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/team-info")
public class TeamInfoController {

    private final TeamInfoService teamInfoService;

    // GET /api/team-info — 팀 정보 조회
    @GetMapping
    public TeamInfo getTeamInfo() {
        return teamInfoService.getTeamInfo();
    }

    // PUT /api/team-info — 팀 정보 수정
    @PutMapping
    public TeamInfo updateTeamInfo(@RequestBody TeamInfo data) {
        return teamInfoService.updateTeamInfo(data);
    }

    // POST /api/team-info/photo — 팀 사진 업로드
    @PostMapping("/photo")
    public TeamInfo uploadPhoto(@RequestParam("file") MultipartFile file) throws IOException {
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String contentType = file.getContentType();
        // data:image/jpeg;base64, 형식으로 저장
        String fullBase64 = "data:" + contentType + ";base64," + base64;
        return teamInfoService.updateTeamPhoto(fullBase64, file.getOriginalFilename());
    }

    // DELETE /api/team-info/photo — 팀 사진 삭제
    @DeleteMapping("/photo")
    public ResponseEntity<Void> deletePhoto() {
        teamInfoService.deleteTeamPhoto();
        return ResponseEntity.ok().build();
    }
}
