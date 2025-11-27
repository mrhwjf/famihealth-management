package com.famihealth.family_health_management.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {

	@Value("${cloudinary.cloud-name}")
	private String cloudName;

	@Value("${cloudinary.api-key}")
	private String apiKey;

	@Value("${cloudinary.api-secret}")
	private String apiSecret;

	@Value("${cloudinary.secure:true}")
	private boolean secure;

	@Bean
	public Cloudinary cloudinary() {
		if (cloudName == null || cloudName.isBlank()) {
			throw new IllegalStateException("Cloudinary cloud-name is not configured");
		}
		if (apiKey == null || apiKey.isBlank()) {
			throw new IllegalStateException("Cloudinary api-key is not configured");
		}
		if (apiSecret == null || apiSecret.isBlank()) {
			throw new IllegalStateException("Cloudinary api-secret is not configured");
		}

		Map<String, Object> config = new HashMap<>();
		config.put("cloud_name", cloudName);
		config.put("api_key", apiKey);
		config.put("api_secret", apiSecret);
		config.put("secure", secure);
		return new Cloudinary(config);
	}
}
