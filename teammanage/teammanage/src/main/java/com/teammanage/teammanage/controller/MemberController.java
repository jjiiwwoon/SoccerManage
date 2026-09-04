/**
 * ====================================
 * 파일: MemberController.java
 * 분야: 백엔드 / 컨트롤러 (Controller)
 * 기능: 프론트엔드에서 오는 HTTP 요청을 받아 처리
 * ====================================
 *
 * 고급웹프로그래밍 수업에서 REST API 배웠잖아?
 * GET, POST, PUT, DELETE 이 4가지 HTTP 메서드로
 * 데이터를 조회, 생성, 수정, 삭제하는 거.
 *
 * 웹개발응용 수업에서 jQuery로
 * $.ajax({ url: "/api/members", method: "GET" })
 * 이렇게 서버에 요청 보냈잖아?
 * 그 요청을 받아주는 쪽이 바로 이 Controller야.
 *
 * 프론트(React)에서 fetch("/api/members")로 요청 보내면
 * 여기 @GetMapping("/api/members")가 받아서 처리해.
 *
 * @RestController = @Controller + @ResponseBody
 *   → JSON으로 데이터를 응답해줘 (HTML 페이지가 아니라)
 * @RequestMapping = 이 컨트롤러의 기본 URL 경로
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.Member;
import com.teammanage.teammanage.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")     // 기본 경로: /api/members
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // GET /api/members → 전체 멤버 목록 조회
    // 프론트에서: fetch("/api/members") 로 호출
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // GET /api/members/1 → ID가 1인 멤버 조회
    // 프론트에서: fetch("/api/members/1") 로 호출
    @GetMapping("/{id}")
    public Member getMember(@PathVariable Long id) {
        return memberService.getMemberById(id);
    }

    // POST /api/members → 새 멤버 추가
    // 프론트에서: fetch("/api/members", { method: "POST", body: JSON }) 로 호출
    @PostMapping
    public Member createMember(@RequestBody Member member) {
        return memberService.createMember(member);
    }

    // PUT /api/members/1 → ID가 1인 멤버 정보 수정
    // 프론트에서: fetch("/api/members/1", { method: "PUT", body: JSON }) 로 호출
    @PutMapping("/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }

    // DELETE /api/members/1 → ID가 1인 멤버 삭제
    // 프론트에서: fetch("/api/members/1", { method: "DELETE" }) 로 호출
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok().build();
        // 삭제 성공하면 200 OK 응답 (본문 없이)
    }
}
