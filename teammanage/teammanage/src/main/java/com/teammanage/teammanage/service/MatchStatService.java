/**
 * ====================================
 * 파일: MatchStatService.java (수정됨)
 * 위치: service 패키지 (기존 파일 덮어쓰기)
 * 기능: 개인 스탯 관련 비즈니스 로직
 * ====================================
 *
 * 변경사항:
 * - updateStat()에 quarters 필드 업데이트 추가
 * - 일괄 스탯 입력을 위해 기존 스탯 삭제 후 재입력 지원
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.Match;
import com.teammanage.teammanage.entity.MatchStat;
import com.teammanage.teammanage.entity.Member;
import com.teammanage.teammanage.repository.MatchRepository;
import com.teammanage.teammanage.repository.MatchStatRepository;
import com.teammanage.teammanage.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchStatService {

    private final MatchStatRepository matchStatRepository;
    private final MatchRepository matchRepository;
    private final MemberRepository memberRepository;

    // 특정 경기의 모든 스탯 조회
    public List<MatchStat> getStatsByMatch(Long matchId) {
        return matchStatRepository.findByMatchId(matchId);
    }

    // 특정 선수의 모든 스탯 조회
    public List<MatchStat> getStatsByMember(Long memberId) {
        return matchStatRepository.findByMemberId(memberId);
    }

    // 스탯 추가
    public MatchStat createStat(Long matchId, Long memberId, MatchStat statData) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("경기를 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("멤버를 찾을 수 없습니다."));

        statData.setMatch(match);
        statData.setMember(member);
        return matchStatRepository.save(statData);
    }

    // 스탯 수정 (quarters 필드 추가)
    public MatchStat updateStat(Long statId, MatchStat statData) {
        MatchStat stat = matchStatRepository.findById(statId)
                .orElseThrow(() -> new RuntimeException("스탯을 찾을 수 없습니다."));

        stat.setGoals(statData.getGoals());
        stat.setAssists(statData.getAssists());
        stat.setQuarters(statData.getQuarters());   // quarters 업데이트 추가
        return matchStatRepository.save(stat);
    }

    // 스탯 삭제
    public void deleteStat(Long statId) {
        matchStatRepository.deleteById(statId);
    }

    // 특정 경기의 모든 스탯 삭제 (결과 재입력용)
    public void deleteStatsByMatch(Long matchId) {
        List<MatchStat> stats = matchStatRepository.findByMatchId(matchId);
        matchStatRepository.deleteAll(stats);
    }
}
