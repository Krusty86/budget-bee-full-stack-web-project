package com.hmi.exp_inc_tracker.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				// 1. Hook the CorsConfigurationSource bean into Spring Security
				.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(auth -> auth
						// 2. Permit all HTTP OPTIONS preflight requests globally
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						// 3. Allow all auth and product endpoints
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api/auth/**", "/v3/api-docs", "/v3/api-docs/**", "/swagger-ui/**",
								"/swagger-ui.html")
						.permitAll().anyRequest().authenticated())
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// Front-end Configuration
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		// Use pattern matching for origin safety
		configuration.setAllowedOriginPatterns(
				List.of("http://localhost:5173", "http://localhost:3000", "http://localhost:5174"));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}