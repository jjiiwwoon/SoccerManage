/**
 * ====================================
 * 파일: MatchStatController.java (수정됨)
 * 위치: controller 패키지 (기존 파일 덮어쓰기)
 * 기능: 개인 스탯 REST API
 * ====================================
 *
 * 변경사항:
 * - DELETE /api/matches/{matchId}/stats/all 추가 (경기별 스탯 전체 삭제)
 *   → 결과 재입력 시 기존 스탯을 모두 지우고 다시 입력할 때 사용
 */
package com.teammanage.teammanage.controller;

import com.teammanage.teammanage.entity.MatchStat;
import com.teammanage.teammanage.service.MatchStatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MatchStatController {

    private final MatchStatService matchStatService;

    // GET /api/matches/{matchId}/stats
    @GetMapping("/api/matches/{matchId}/stats")
    public List<MatchStat> getStatsByMatch(@PathVariable Long matchId) {
        return matchStatService.getStatsByMatch(matchId);
    }

    // GET /api/members/{memberId}/stats
    @GetMapping("/api/members/{memberId}/stats")
    public List<MatchStat> getStatsByMember(@PathVariable Long memberId) {
        return matchStatService.getStatsByMember(memberId);
    }

    // POST /api/matches/{matchId}/stats?memberId={memberId}
    @PostMapping("/api/matches/{matchId}/stats")
    public MatchStat createStat(
            @PathVariable Long matchId,
            @RequestParam Long memberId,
            @RequestBody MatchStat stat) {
        return matchStatService.createStat(matchId, memberId, stat);
    }

    // PUT /api/stats/{statId}
    @PutMapping("/api/stats/{statId}")
    public MatchStat updateStat(@PathVariable Long statId, @RequestBody MatchStat stat) {
        return matchStatService.updateStat(statId, stat);
    }

    // DELETE /api/stats/{statId}
    @DeleteMapping("/api/stats/{statId}")
    public ResponseEntity<Void> deleteStat(@PathVariable Long statId) {
        matchStatService.deleteStat(statId);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/matches/{matchId}/stats/all — 경기별 스탯 전체 삭제 (결과 재입력용)
    @DeleteMapping("/api/matches/{matchId}/stats/all")
    public ResponseEntity<Void> deleteAllStatsByMatch(@PathVariable Long matchId) {
        matchStatService.deleteStatsByMatch(matchId);
        return ResponseEntity.ok().build();
    }
}
