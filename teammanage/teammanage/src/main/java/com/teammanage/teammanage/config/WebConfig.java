/**
 * ====================================
 * 파일: WebConfig.java
 * 분야: 백엔드 / 설정 (Config)
 * 기능: CORS(교차 출처 리소스 공유) 설정
 * ====================================
 *
 * CORS가 뭐냐면:
 * React는 localhost:3000에서 실행되고
 * Spring Boot는 localhost:8080에서 실행되잖아?
 *
 * 브라우저는 보안상 "다른 출처(포트가 다르면 다른 출처)"끼리
 * 통신하는 걸 기본적으로 막아.
 *
 * 그래서 "3000번 포트에서 오는 요청은 괜찮아, 허용해줘!"
 * 라고 Spring Boot한테 알려주는 설정이 이 파일이야.
 *
 * 나중에 배포할 때는 실제 도메인 주소로 바꿔주면 돼.
 */
package com.teammanage.teammanage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration  // "이 클래스는 설정 파일이야"
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")          // /api/로 시작하는 모든 요청에 대해
                .allowedOrigins("http://localhost:3000")  // React 개발 서버 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메서드
                .allowedHeaders("*")            // 모든 헤더 허용
                .allowCredentials(true);        // 쿠키/인증 정보 허용
    }
}
