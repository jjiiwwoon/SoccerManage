/**
 * ====================================
 * 파일: MatchService.java
 * 위치: service 패키지 안에 넣기
 * 분야: 백엔드 / 비즈니스 로직
 * 기능: 경기 기록 관련 비즈니스 로직
 * ====================================
 *
 * MemberService 만들었던 것과 같은 패턴이야.
 * Controller에서 직접 Repository를 쓰지 않고,
 * Service를 거쳐서 쓰는 이유는 "역할 분리" 때문이야.
 *
 * 추가된 로직: 스코어를 입력하면 자동으로 결과(승/무/패)를 계산해줘!
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.Match;
import com.teammanage.teammanage.entity.MatchResult;
import com.teammanage.teammanage.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    // 전체 경기 목록 (최신순)
    public List<Match> getAllMatches() {
        return matchRepository.findAllByOrderByMatchDateDesc();
    }

    // 특정 경기 조회
    public Match getMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("경기를 찾을 수 없습니다. id: " + id));
    }

    // 경기 추가 (스코어에 따라 결과 자동 계산)
    public Match createMatch(Match match) {
        // 스코어가 입력되었으면 결과를 자동 계산
        if (match.getOurScore() != null && match.getOpponentScore() != null) {
            match.setResult(calculateResult(match.getOurScore(), match.getOpponentScore()));
        }
        return matchRepository.save(match);
    }

    // 경기 수정
    public Match updateMatch(Long id, Match matchData) {
        Match match = getMatchById(id);
        match.setMatchDate(matchData.getMatchDate());
        match.setOpponent(matchData.getOpponent());
        match.setOurScore(matchData.getOurScore());
        match.setOpponentScore(matchData.getOpponentScore());
        match.setLocation(matchData.getLocation());

        // 스코어가 있으면 결과 자동 계산
        if (match.getOurScore() != null && match.getOpponentScore() != null) {
            match.setResult(calculateResult(match.getOurScore(), match.getOpponentScore()));
        }
        return matchRepository.save(match);
    }

    // 경기 삭제
    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    /**
     * 스코어로 승/무/패 자동 계산
     * 우리 점수 > 상대 점수 → WIN (승리)
     * 우리 점수 = 상대 점수 → DRAW (무승부)
     * 우리 점수 < 상대 점수 → LOSE (패배)
     */
    private MatchResult calculateResult(int ourScore, int opponentScore) {
        if (ourScore > opponentScore) return MatchResult.WIN;
        if (ourScore == opponentScore) return MatchResult.DRAW;
        return MatchResult.LOSE;
    }
}
