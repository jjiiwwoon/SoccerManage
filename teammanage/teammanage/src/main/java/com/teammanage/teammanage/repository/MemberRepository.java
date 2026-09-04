/**
 * ====================================
 * 파일: MemberRepository.java
 * 분야: 백엔드 / 레포지토리 (Repository)
 * 기능: DB에 접근해서 데이터를 가져오거나 저장하는 역할
 * ====================================
 *
 * 졸업작품에서 Firebase에 접근할 때
 * firebase.database().ref("members").get()  ← 전체 조회
 * firebase.database().ref("members").child(id).get()  ← 한 명 조회
 * 이렇게 했잖아?
 *
 * JPA에서는 JpaRepository를 상속(extends)하면
 * 이런 기본 기능들이 자동으로 만들어져:
 *   findAll()      → 전체 조회 (= Firebase의 get())
 *   findById(id)   → ID로 한 명 조회
 *   save(member)   → 저장/수정
 *   deleteById(id) → 삭제
 *
 * SQL로 치면 SELECT, INSERT, UPDATE, DELETE를
 * 직접 안 써도 되는 거야. JPA가 자동으로 만들어줘.
 *
 * 웹서버프레임워크 수업에서 JpaRepository 써봤던 거 기억나?
 * 그때랑 똑같아!
 */
package com.teammanage.teammanage.repository;

import com.teammanage.teammanage.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository<엔티티 클래스, ID 타입>
// 이거 하나로 기본 CRUD(생성, 조회, 수정, 삭제)가 전부 자동 생성돼!
public interface MemberRepository extends JpaRepository<Member, Long> {
    // 여기는 비워놔도 기본 기능이 다 있어.
    // 나중에 커스텀 조회가 필요하면 여기에 메서드를 추가하면 돼.
    // 예: List<Member> findByPosition(String position);
    //     → "포지션으로 멤버 찾기" 가 자동으로 만들어짐
}
