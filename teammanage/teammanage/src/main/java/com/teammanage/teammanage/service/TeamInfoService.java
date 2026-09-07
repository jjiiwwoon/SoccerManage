/**
 * ====================================
 * 파일: TeamInfoService.java (수정됨)
 * 위치: service 패키지
 * 기능: 팀 정보 비즈니스 로직
 * ====================================
 *
 * 변경사항:
 * - linksJson 필드 업데이트 추가
 * - 기존 link1~3 마이그레이션 지원
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
            defaultInfo.setLinksJson("[]");
            return teamInfoRepository.save(defaultInfo);
        }
        TeamInfo info = all.get(0);

        // 기존 link1~3 → linksJson 마이그레이션 (최초 1회)
        if ((info.getLinksJson() == null || info.getLinksJson().isEmpty()) && hasOldLinks(info)) {
            StringBuilder sb = new StringBuilder("[");
            boolean first = true;
            if (info.getLink1() != null && !info.getLink1().isEmpty()) {
                sb.append(buildLinkJson(info.getLink1Label(), info.getLink1()));
                first = false;
            }
            if (info.getLink2() != null && !info.getLink2().isEmpty()) {
                if (!first) sb.append(",");
                sb.append(buildLinkJson(info.getLink2Label(), info.getLink2()));
                first = false;
            }
            if (info.getLink3() != null && !info.getLink3().isEmpty()) {
                if (!first) sb.append(",");
                sb.append(buildLinkJson(info.getLink3Label(), info.getLink3()));
            }
            sb.append("]");
            info.setLinksJson(sb.toString());
            teamInfoRepository.save(info);
        }

        return info;
    }

    private boolean hasOldLinks(TeamInfo info) {
        return (info.getLink1() != null && !info.getLink1().isEmpty())
                || (info.getLink2() != null && !info.getLink2().isEmpty())
                || (info.getLink3() != null && !info.getLink3().isEmpty());
    }

    private String buildLinkJson(String label, String url) {
        String safeLabel = (label != null ? label : "").replace("\"", "\\\"");
        String safeUrl = (url != null ? url : "").replace("\"", "\\\"");
        return "{\"label\":\"" + safeLabel + "\",\"url\":\"" + safeUrl + "\"}";
    }

    // 팀 정보 업데이트
    public TeamInfo updateTeamInfo(TeamInfo data) {
        TeamInfo info = getTeamInfo();
        info.setTeamName(data.getTeamName());
        info.setDescription(data.getDescription());
        info.setLinksJson(data.getLinksJson());
        // 기존 link1~3 필드는 더 이상 사용하지 않으므로 비움
        info.setLink1(null);
        info.setLink1Label(null);
        info.setLink2(null);
        info.setLink2Label(null);
        info.setLink3(null);
        info.setLink3Label(null);
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
