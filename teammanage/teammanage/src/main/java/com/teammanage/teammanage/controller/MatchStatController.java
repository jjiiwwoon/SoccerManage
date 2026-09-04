/**
 * ====================================
 * 파일: MatchStatController.java
 * 위치: controller 패키지 안에 넣기
 * 분야: 백엔드 / API 엔드포인트
 * 기능: 개인 스탯 REST API
 * ====================================
 *
 * 이 API는 "경기 기록" 안에 "선수별 스탯"을 넣는 거야.
 *
 * URL 구조가 좀 다른데:
 *   /api/matches/{matchId}/stats → 특정 경기의 스탯들
 *
 * 이걸 "중첩 리소스(Nested Resource)"라고 해.
 * 경기(match) 안에 스탯(stat)이 들어있으니까
 * URL도 그 관계를 표현하는 거야.
 *
 * 추가로 선수별 스탯 조회도 있어:
 *   /api/members/{memberId}/stats → 특정 선수의 모든 스탯
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

    // GET /api/matches/{matchId}/stats — 특정 경기의 모든 스탯
    @GetMapping("/api/matches/{matchId}/stats")
    public List<MatchStat> getStatsByMatch(@PathVariable Long matchId) {
        return matchStatService.getStatsByMatch(matchId);
    }

    // GET /api/members/{memberId}/stats — 특정 선수의 모든 스탯
    @GetMapping("/api/members/{memberId}/stats")
    public List<MatchStat> getStatsByMember(@PathVariable Long memberId) {
        return matchStatService.getStatsByMember(memberId);
    }

    // POST /api/matches/{matchId}/stats?memberId={memberId} — 스탯 추가
    @PostMapping("/api/matches/{matchId}/stats")
    public MatchStat createStat(
            @PathVariable Long matchId,
            @RequestParam Long memberId,
            @RequestBody MatchStat stat) {
        return matchStatService.createStat(matchId, memberId, stat);
    }

    // PUT /api/stats/{statId} — 스탯 수정
    @PutMapping("/api/stats/{statId}")
    public MatchStat updateStat(@PathVariable Long statId, @RequestBody MatchStat stat) {
        return matchStatService.updateStat(statId, stat);
    }

    // DELETE /api/stats/{statId} — 스탯 삭제
    @DeleteMapping("/api/stats/{statId}")
    public ResponseEntity<Void> deleteStat(@PathVariable Long statId) {
        matchStatService.deleteStat(statId);
        return ResponseEntity.ok().build();
    }
}
