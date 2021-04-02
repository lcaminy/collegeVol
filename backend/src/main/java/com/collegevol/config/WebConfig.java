package com.collegevol.config;

import com.collegevol.resolver.MultiRequestBodyArgumentResolver;
import javax.servlet.MultipartConfigElement;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new MultiRequestBodyArgumentResolver());
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setLocation("/opt/webapp/tmp");//指定临时文件路径，这个路径可以随便写
        return factory.createMultipartConfig();
    }

//    private CorsConfiguration buildConfig(){
//        CorsConfiguration corsConfiguration=new CorsConfiguration();
//        corsConfiguration.addAllowedOrigin("*");
//        corsConfiguration.addAllowedMethod("*");
//        corsConfiguration.addAllowedHeader("*");
//        return corsConfiguration;
//
//    }
//
//
//    @Bean
//    public CorsFilter corsFilter(){
//        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource=new UrlBasedCorsConfigurationSource();
//        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**",buildConfig());
//        return new CorsFilter(urlBasedCorsConfigurationSource);
//    }

}
