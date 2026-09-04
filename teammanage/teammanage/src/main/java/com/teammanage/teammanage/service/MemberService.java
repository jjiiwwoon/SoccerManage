/**
 * ====================================
 * 파일: MemberService.java
 * 분야: 백엔드 / 서비스 (Service)
 * 기능: 비즈니스 로직 처리 (실제로 "뭘 할지" 결정)
 * ====================================
 *
 * 웹서버프레임워크 수업에서 MVC 패턴 배웠잖아?
 * Controller → Service → Repository 흐름에서
 * Service는 "중간 관리자" 역할이야.
 *
 * Controller: "멤버 목록 달라는 요청이 왔어!"
 * Service: "알겠어, Repository한테 DB에서 가져오라고 할게"
 * Repository: "여기 데이터!"
 *
 * 왜 Controller에서 바로 Repository를 안 쓰냐면,
 * 나중에 "멤버 추가 전에 등번호 중복 체크" 같은
 * 복잡한 규칙이 생기면 Service에서 처리하기 편하거든.
 *
 * @Service = "이 클래스는 비즈니스 로직을 담당해"
 * @RequiredArgsConstructor = Lombok이 생성자를 자동으로 만들어줘
 */
package com.teammanage.teammanage.service;

import com.teammanage.teammanage.entity.Member;
import com.teammanage.teammanage.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor    // final 필드를 자동으로 생성자 주입
public class MemberService {

    private final MemberRepository memberRepository;

    // 전체 멤버 조회
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
        // SQL로 치면: SELECT * FROM member
    }

    // ID로 멤버 한 명 조회
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("멤버를 찾을 수 없습니다. ID: " + id));
        // SQL로 치면: SELECT * FROM member WHERE id = ?
    }

    // 새 멤버 생성
    public Member createMember(Member member) {
        return memberRepository.save(member);
        // SQL로 치면: INSERT INTO member (name, position, ...) VALUES (?, ?, ...)
    }

    // 멤버 정보 수정
    public Member updateMember(Long id, Member memberData) {
        Member member = getMemberById(id);  // 먼저 기존 멤버를 찾고

        // 전달받은 데이터로 업데이트
        member.setName(memberData.getName());
        member.setPosition(memberData.getPosition());
        member.setBackNumber(memberData.getBackNumber());
        member.setRole(memberData.getRole());

        return memberRepository.save(member);   // 저장 (ID가 있으면 수정)
        // SQL로 치면: UPDATE member SET name=?, position=? WHERE id=?
    }

    // 멤버 삭제
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
        // SQL로 치면: DELETE FROM member WHERE id = ?
    }
}
