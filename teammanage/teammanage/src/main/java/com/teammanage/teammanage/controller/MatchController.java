/**
 * ====================================
 * 파일: MatchController.java
 * 위치: controller 패키지 안에 넣기
 * 분야: 백엔드 / API 엔드포인트
 * 기능: 경기 기록 REST API
 * ====================================
 *
 * MemberController랑 완전 같은 패턴이야!
 * URL만 /api/matches로 바뀐 거야.
 *
 * GET    /api/matches       → 전체 경기 목록
 * GET    /api/matches/{id}  → 특정 경기 조회
 * POST   /api/matches       → 경기 추가
 * PUT    /api/matches/{id}  → 경기 수정
 * DELETE /api/matches/{id}  → 경기 삭제
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.Match;
import com.teammanage.teammanage.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // GET /api/matches — 전체 경기 목록
    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }

    // GET /api/matches/{id} — 특정 경기 조회
    @GetMapping("/{id}")
    public Match getMatch(@PathVariable Long id) {
        return matchService.getMatchById(id);
    }

    // POST /api/matches — 경기 추가
    @PostMapping
    public Match createMatch(@RequestBody Match match) {
        return matchService.createMatch(match);
    }

    // PUT /api/matches/{id} — 경기 수정
    @PutMapping("/{id}")
    public Match updateMatch(@PathVariable Long id, @RequestBody Match match) {
        return matchService.updateMatch(id, match);
    }

    // DELETE /api/matches/{id} — 경기 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.ok().build();
    }
}
