/**
 * ====================================
 * 파일: WebConfig.java (수정됨)
 * 위치: config 패키지 (기존 파일 덮어쓰기)
 * 기능: CORS 설정 + 업로드 파일 정적 서빙
 * ====================================
 *
 * 변경 내용:
 * - addResourceHandlers() 추가: /uploads/** 요청을 서버의 uploads/ 폴더에서 찾아서 보여줌
 *
 * 왜 필요하냐면:
 *   사진 업로드하면 서버의 uploads/ 폴더에 저장되잖아?
 *   그런데 브라우저에서 <img src="/uploads/abc.jpg"> 이렇게 접근하려면
 *   Spring Boot한테 "이 경로는 이 폴더에서 찾아줘"라고 알려줘야 해.
 *   그게 Resource Handler야.
 */
package com.teammanage.teammanage.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);

        // 업로드된 파일에 대한 CORS도 허용
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET")
                .allowedHeaders("*");
    }

    // 업로드 파일을 정적으로 서빙
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /uploads/** 요청이 오면 → 실제 uploads/ 폴더에서 파일을 찾아서 보여줘
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
