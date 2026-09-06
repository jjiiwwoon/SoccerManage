/**
 * ====================================
 * 파일: TeamInfoRepository.java (신규)
 * 위치: repository 패키지
 * 기능: 팀 정보 데이터 접근
 * ====================================
 */
package com.teammanage.teammanage.repository;

import com.teammanage.teammanage.entity.TeamInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamInfoRepository extends JpaRepository<TeamInfo, Long> {
}
