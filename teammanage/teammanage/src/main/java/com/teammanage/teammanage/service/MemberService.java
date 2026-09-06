/**
 * ====================================
 * 파일: MemberService.java (수정됨)
 * 위치: service 패키지 (기존 파일 덮어쓰기)
 * 기능: 멤버 비즈니스 로직 + 프로필 사진 업로드
 * ====================================
 *
 * 변경사항:
 * - updateProfilePhoto() 메서드 추가
 * - deleteProfilePhoto() 메서드 추가
 * - updateMember에서 프로필 사진 필드도 업데이트
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.Member;
import com.teammanage.teammanage.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // 전체 멤버 조회
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // ID로 멤버 한 명 조회
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("멤버를 찾을 수 없습니다. ID: " + id));
    }

    // 새 멤버 생성
    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    // 멤버 정보 수정 (JSON)
    public Member updateMember(Long id, Member memberData) {
        Member member = getMemberById(id);

        member.setName(memberData.getName());
        member.setPosition(memberData.getPosition());
        member.setBackNumber(memberData.getBackNumber());
        member.setRole(memberData.getRole());

        return memberRepository.save(member);
    }

    // 멤버 정보 수정 (이름, 등번호, 포지션 + 사진 선택)
    public Member updateMemberWithPhoto(Long id, String name, Integer backNumber,
                                        String position, String photoBase64, String photoFileName,
                                        boolean removePhoto) {
        Member member = getMemberById(id);

        if (name != null) member.setName(name);
        if (backNumber != null) member.setBackNumber(backNumber);
        if (position != null) member.setPosition(position);

        if (removePhoto) {
            member.setProfilePhoto(null);
            member.setProfilePhotoFileName(null);
        } else if (photoBase64 != null) {
            member.setProfilePhoto(photoBase64);
            member.setProfilePhotoFileName(photoFileName);
        }

        return memberRepository.save(member);
    }

    // 프로필 사진 업로드 (Base64)
    public Member updateProfilePhoto(Long id, String base64Data, String fileName) {
        Member member = getMemberById(id);
        member.setProfilePhoto(base64Data);
        member.setProfilePhotoFileName(fileName);
        return memberRepository.save(member);
    }

    // 프로필 사진 삭제
    public Member deleteProfilePhoto(Long id) {
        Member member = getMemberById(id);
        member.setProfilePhoto(null);
        member.setProfilePhotoFileName(null);
        return memberRepository.save(member);
    }

    // 멤버 삭제
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }
}
