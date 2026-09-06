/**
 * ====================================
 * 파일: TeamInfoService.java (신규)
 * 위치: service 패키지
 * 기능: 팀 정보 비즈니스 로직
 * ====================================
 *
 * 단일 row 관리 — 없으면 기본값으로 생성, 있으면 업데이트
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.TeamInfo;
import com.teammanage.teammanage.repository.TeamInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamInfoService {

    private final TeamInfoRepository teamInfoRepository;

    // 팀 정보 조회 (없으면 기본값으로 생성)
    public TeamInfo getTeamInfo() {
        List<TeamInfo> all = teamInfoRepository.findAll();
        if (all.isEmpty()) {
            TeamInfo defaultInfo = new TeamInfo();
            defaultInfo.setTeamName("창우FC");
            defaultInfo.setDescription("축구동호회 팀 관리 시스템");
            return teamInfoRepository.save(defaultInfo);
        }
        return all.get(0);
    }

    // 팀 정보 업데이트
    public TeamInfo updateTeamInfo(TeamInfo data) {
        TeamInfo info = getTeamInfo();
        info.setTeamName(data.getTeamName());
        info.setDescription(data.getDescription());
        info.setLink1(data.getLink1());
        info.setLink1Label(data.getLink1Label());
        info.setLink2(data.getLink2());
        info.setLink2Label(data.getLink2Label());
        info.setLink3(data.getLink3());
        info.setLink3Label(data.getLink3Label());
        return teamInfoRepository.save(info);
    }

    // 팀 사진 업데이트 (Base64로 저장)
    public TeamInfo updateTeamPhoto(String base64, String fileName) {
        TeamInfo info = getTeamInfo();
        info.setPhotoBase64(base64);
        info.setPhotoFileName(fileName);
        return teamInfoRepository.save(info);
    }

    // 팀 사진 삭제
    public TeamInfo deleteTeamPhoto() {
        TeamInfo info = getTeamInfo();
        info.setPhotoBase64(null);
        info.setPhotoFileName(null);
        return teamInfoRepository.save(info);
    }
}
