/**
 * ====================================
 * 파일: MemberController.java (수정됨)
 * 위치: controller 패키지 (기존 파일 덮어쓰기)
 * 기능: 멤버 REST API + 프로필 사진 업로드 엔드포인트
 * ====================================
 *
 * 변경사항:
 * - POST /api/members/{id}/photo → 프로필 사진 업로드
 * - DELETE /api/members/{id}/photo → 프로필 사진 삭제
 * - POST /api/members/with-photo → 사진과 함께 선수 등록
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.Member;
import com.teammanage.teammanage.entity.MemberRole;
import com.teammanage.teammanage.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // GET /api/members → 전체 멤버 목록
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // GET /api/members/{id} → 멤버 한 명
    @GetMapping("/{id}")
    public Member getMember(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

    // POST /api/members → 새 멤버 추가 (JSON)
    @PostMapping
    public Member createMember(@RequestBody Member member) {
        return memberService.createMember(member);
    }

    // POST /api/members/with-photo → 사진과 함께 선수 등록 (Multipart)
    @PostMapping("/with-photo")
    public Member createMemberWithPhoto(
            @RequestParam("name") String name,
            @RequestParam("backNumber") Integer backNumber,
            @RequestParam("position") String position,
            @RequestParam(value = "role", defaultValue = "MEMBER") String role,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) throws IOException {
        Member member = new Member();
        member.setName(name);
        member.setBackNumber(backNumber);
        member.setPosition(position);
        member.setRole(MemberRole.valueOf(role));

        if (photo != null && !photo.isEmpty()) {
            String base64 = Base64.getEncoder().encodeToString(photo.getBytes());
            String contentType = photo.getContentType();
            member.setProfilePhoto("data:" + contentType + ";base64," + base64);
            member.setProfilePhotoFileName(photo.getOriginalFilename());
        }

        return memberService.createMember(member);
    }

    // PUT /api/members/{id} → 멤버 수정 (JSON)
    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }

    // PUT /api/members/{id}/with-photo → 멤버 수정 (사진 포함, Multipart)
    @PutMapping("/{id}/with-photo")
    public Member updateMemberWithPhoto(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("backNumber") Integer backNumber,
            @RequestParam("position") String position,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "removePhoto", defaultValue = "false") boolean removePhoto
    ) throws IOException {
        String photoBase64 = null;
        String photoFileName = null;

        if (photo != null && !photo.isEmpty()) {
            String base64 = Base64.getEncoder().encodeToString(photo.getBytes());
            String contentType = photo.getContentType();
            photoBase64 = "data:" + contentType + ";base64," + base64;
            photoFileName = photo.getOriginalFilename();
        }

        return memberService.updateMemberWithPhoto(id, name, backNumber, position,
                photoBase64, photoFileName, removePhoto);
    }

    // POST /api/members/{id}/photo → 프로필 사진 업로드
    @PostMapping("/{id}/photo")
    public Member uploadPhoto(@PathVariable Long id,
                              @RequestParam("file") MultipartFile file) throws IOException {
        String base64 = Base64.getEncoder().encodeToString(file.getBytes());
        String contentType = file.getContentType();
        String dataUri = "data:" + contentType + ";base64," + base64;
        return memberService.updateProfilePhoto(id, dataUri, file.getOriginalFilename());
    }

    // DELETE /api/members/{id}/photo → 프로필 사진 삭제
    @DeleteMapping("/{id}/photo")
    public Member deletePhoto(@PathVariable Long id) {
        return memberService.deleteProfilePhoto(id);
    }

    // DELETE /api/members/{id} → 멤버 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok().build();
    }
}
