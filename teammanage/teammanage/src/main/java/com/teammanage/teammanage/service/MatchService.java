/**
 * ====================================
 * 파일: MatchService.java (수정됨)
 * 위치: service 패키지 (기존 파일 덮어쓰기)
 * 기능: 경기 기록 관련 비즈니스 로직
 * ====================================
 *
 * 변경사항:
 * - updateMatch()에 matchTime, memo 필드 추가
 * - 스코어가 null이면 result도 null로 유지 (예정 경기)
 * - 스코어가 입력되면 result 자동 계산 (결과 입력)
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

    // 경기 추가 (일정 등록 시 스코어 없이 저장 가능)
    public Match createMatch(Match match) {
        if (match.getOurScore() != null && match.getOpponentScore() != null) {
            match.setResult(calculateResult(match.getOurScore(), match.getOpponentScore()));
        }
        // 스코어가 없으면 result는 null → 프론트에서 "예정"으로 표시
        return matchRepository.save(match);
    }

    // 경기 수정 (결과 입력 포함)
    public Match updateMatch(Long id, Match matchData) {
        Match match = getMatchById(id);
        match.setMatchDate(matchData.getMatchDate());
        match.setOpponent(matchData.getOpponent());
        match.setOurScore(matchData.getOurScore());
        match.setOpponentScore(matchData.getOpponentScore());
        match.setLocation(matchData.getLocation());
        match.setMatchTime(matchData.getMatchTime());   // 새로 추가
        match.setMemo(matchData.getMemo());               // 새로 추가

        // 스코어가 있으면 결과 자동 계산, 없으면 null (예정)
        if (match.getOurScore() != null && match.getOpponentScore() != null) {
            match.setResult(calculateResult(match.getOurScore(), match.getOpponentScore()));
        } else {
            match.setResult(null);
        }
        return matchRepository.save(match);
    }

    // 경기 삭제
    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    /**
     * 스코어로 승/무/패 자동 계산
     */
    private MatchResult calculateResult(int ourScore, int opponentScore) {
        if (ourScore > opponentScore) return MatchResult.WIN;
        if (ourScore == opponentScore) return MatchResult.DRAW;
        return MatchResult.LOSE;
    }
}
