package com.famihealth.family_health_management.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.famihealth.family_health_management.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender mailSender;

	@Value("${app.mail.from:no-reply@famihealth.com}")
	private String fromAddress;

	@Override
	public void sendEmail(String to, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);
		message.setFrom(fromAddress);

		try {
			mailSender.send(message);
		} catch (MailException ex) {
			log.error("Failed to send email to {}", to, ex);
			throw new IllegalStateException("Unable to send email at this time");
		}
	}
}
