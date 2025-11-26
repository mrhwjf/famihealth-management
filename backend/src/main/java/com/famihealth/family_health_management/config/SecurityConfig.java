package com.famihealth.family_health_management.config;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.famihealth.family_health_management.dto.response.api.ApiResponse;
import com.famihealth.family_health_management.security.GoogleOAuth2SuccessHandler;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, GoogleOAuth2SuccessHandler successHandler,
			ObjectMapper objectMapper) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/v1/oauth/**", "/oauth2/**", "/login/oauth2/**").permitAll()
						.anyRequest().permitAll())
				.oauth2Login(oauth -> oauth
						.successHandler(successHandler)
						.failureHandler((request, response, exception) -> {
							response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
							response.setContentType(MediaType.APPLICATION_JSON_VALUE);
							response.setCharacterEncoding(StandardCharsets.UTF_8.name());
							ApiResponse<Void> body = ApiResponse.failure("Google login failed");
							response.getWriter().write(objectMapper.writeValueAsString(body));
							response.getWriter().flush();
						}));
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	@Qualifier("googleIdTokenDecoder")
	public JwtDecoder googleIdTokenDecoder(@Value("${app.oauth.google.client-id:}") String clientId) {
		NimbusJwtDecoder decoder = (NimbusJwtDecoder) JwtDecoders.fromOidcIssuerLocation("https://accounts.google.com");
		OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer("https://accounts.google.com");
		OAuth2TokenValidator<Jwt> audienceValidator = new GoogleAudienceValidator(clientId);
		decoder.setJwtValidator(token -> {
			OAuth2TokenValidatorResult issuerResult = withIssuer.validate(token);
			if (issuerResult.hasErrors()) {
				return issuerResult;
			}
			return audienceValidator.validate(token);
		});
		return decoder;
	}

	private static final class GoogleAudienceValidator implements OAuth2TokenValidator<Jwt> {

		private final String clientId;

		private GoogleAudienceValidator(String clientId) {
			this.clientId = clientId;
		}

		@Override
		public OAuth2TokenValidatorResult validate(Jwt token) {
			if (!StringUtils.hasText(clientId)) {
				return OAuth2TokenValidatorResult.success();
			}
			if (token.getAudience().contains(clientId)) {
				return OAuth2TokenValidatorResult.success();
			}
			OAuth2Error error = new OAuth2Error("invalid_token",
					"Google token audience does not match configured client id", null);
			return OAuth2TokenValidatorResult.failure(error);
		}
	}
}
