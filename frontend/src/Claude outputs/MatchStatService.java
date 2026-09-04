/**
 * ====================================
 * 파일: MatchStatService.java
 * 위치: service 패키지 안에 넣기
 * 분야: 백엔드 / 비즈니스 로직
 * 기능: 개인 스탯 관련 비즈니스 로직
 * ====================================
 *
 * 이 서비스는 "경기"와 "선수"를 연결하는 역할을 해.
 *
 * 예를 들어:
 *   "3월 15일 경기에 정지원 선수의 골 2, 어시스트 1 기록"
 *   → matchId=1, memberId=3, goals=2, assists=1
 *
 * 추가로 선수별 통산 기록(총 골, 총 어시스트)도 계산해줘.
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

    // 스탯 추가 (경기 ID + 선수 ID + 골 + 어시스트)
    public MatchStat createStat(Long matchId, Long memberId, MatchStat statData) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("경기를 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("멤버를 찾을 수 없습니다."));

        statData.setMatch(match);
        statData.setMember(member);
        return matchStatRepository.save(statData);
    }

    // 스탯 수정
    public MatchStat updateStat(Long statId, MatchStat statData) {
        MatchStat stat = matchStatRepository.findById(statId)
                .orElseThrow(() -> new RuntimeException("스탯을 찾을 수 없습니다."));

        stat.setGoals(statData.getGoals());
        stat.setAssists(statData.getAssists());
        return matchStatRepository.save(stat);
    }

    // 스탯 삭제
    public void deleteStat(Long statId) {
        matchStatRepository.deleteById(statId);
    }
}
