package com.famihealth.family_health_management.service;

public interface EmailService {

	void sendEmail(String to, String subject, String body);
}
