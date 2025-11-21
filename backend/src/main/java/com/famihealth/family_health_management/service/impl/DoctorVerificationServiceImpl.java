package com.famihealth.family_health_management.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationDetailDto;
import com.famihealth.family_health_management.dto.response.doctor_verification.DoctorVerificationSummaryDto;
import com.famihealth.family_health_management.dto.response.user.UserSummaryDto;
import com.famihealth.family_health_management.enums.VerificationStatus;
import com.famihealth.family_health_management.mapper.DoctorVerificationMapper;
import com.famihealth.family_health_management.mapper.UserMapper;
import com.famihealth.family_health_management.model.DoctorVerification;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.DoctorVerificationRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.DoctorVerificationService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorVerificationServiceImpl implements DoctorVerificationService {

	private final DoctorVerificationRepository doctorVerificationRepository;
	private final DoctorVerificationMapper doctorVerificationMapper;
	private final UserRepository userRepository;
	private final UserMapper userMapper;

	@Override
	public DoctorVerificationSummaryDto submitForVerification(Integer doctorId) {
		DoctorVerification dv = new DoctorVerification();

		// Set doctor
		User doctor = userRepository.findById(doctorId)
				.orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));
		dv.setDoctor(doctor);
		dv.setStatus(VerificationStatus.PENDING);
		doctorVerificationRepository.save(dv);
		return doctorVerificationMapper.toSummaryDto(dv);

	}

	@Override
	public PageResponse<DoctorVerificationSummaryDto> getVerificationHistory(Integer doctorId) {
		// Return full history (unpaged) for the doctor
		if (!userRepository.existsById(doctorId)) {
			throw new IllegalArgumentException("Doctor not found with ID: " + doctorId);
		}
		Page<DoctorVerification> page = doctorVerificationRepository.findByDoctorId(doctorId, Pageable.unpaged());
		return PageResponseMapper.fromPage(page, doctorVerificationMapper::toSummaryDto);
	}

	@Override
	public DoctorVerificationSummaryDto getLatestVerification(Integer doctorId) {
		DoctorVerification latest = doctorVerificationRepository.findTopByDoctorIdOrderBySubmittedAtDesc(doctorId)
				.orElseThrow(
						() -> new IllegalArgumentException("No verification attempts found for doctorId=" + doctorId));
		return doctorVerificationMapper.toSummaryDto(latest);
	}

	@Override
	public void approveDoctor(Integer doctorId, Integer adminId, String remarks) {
		DoctorVerification pending = doctorVerificationRepository
				.findFirstByDoctorIdAndStatusOrderBySubmittedAtDesc(doctorId, VerificationStatus.PENDING)
				.orElseThrow(() -> new IllegalStateException("No PENDING verification found for doctorId=" + doctorId));
		User admin = userRepository.findById(adminId)
				.orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));
		User doctor = userRepository.findById(doctorId)
				.orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));

		// Get current timestamp
		pending.setReviewedAt(LocalDateTime.now());
		// Update doctor's verified status
		doctor.getDoctorProfile().setVerified(true);
		pending.setAdmin(admin);
		pending.setStatus(VerificationStatus.APPROVED);
		pending.setRemarks(remarks);
		doctorVerificationRepository.save(pending);
	}

	@Override
	public void rejectDoctor(Integer doctorId, Integer adminId, String remarks) {
		DoctorVerification pending = doctorVerificationRepository
				.findFirstByDoctorIdAndStatusOrderBySubmittedAtDesc(doctorId, VerificationStatus.PENDING)
				.orElseThrow(() -> new IllegalStateException("No PENDING verification found for doctorId=" + doctorId));
		User admin = userRepository.findById(adminId)
				.orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminId));

		// Get current timestamp
		pending.setReviewedAt(LocalDateTime.now());
		pending.setAdmin(admin);
		pending.setStatus(VerificationStatus.REJECTED);
		pending.setRemarks(remarks);
		doctorVerificationRepository.save(pending);
	}

	@Override
	public PageResponse<UserSummaryDto> getPendingVerification(Pageable pageable) {
		Page<DoctorVerification> page = doctorVerificationRepository.findByStatus(VerificationStatus.PENDING, pageable);
		Page<UserSummaryDto> mapped = page.map(v -> userMapper.toSummaryDto(v.getDoctor()));
		return PageResponseMapper.fromPage(mapped, u -> u); // already mapped
	}

	@Override
	public PageResponse<UserSummaryDto> getRejectedVerification(Pageable pageable) {
		Page<DoctorVerification> page = doctorVerificationRepository.findByStatus(VerificationStatus.REJECTED,
				pageable);
		Page<UserSummaryDto> mapped = page.map(v -> userMapper.toSummaryDto(v.getDoctor()));
		return PageResponseMapper.fromPage(mapped, u -> u);
	}

	@Override
	public PageResponse<DoctorVerificationSummaryDto> getDoctorVerificationHistory(Integer doctorId) {
		if (!userRepository.existsById(doctorId)) {
			throw new IllegalArgumentException("Doctor not found with ID: " + doctorId);
		}
		Page<DoctorVerification> page = doctorVerificationRepository.findByDoctorId(doctorId, Pageable.unpaged());
		return PageResponseMapper.fromPage(page, doctorVerificationMapper::toSummaryDto);
	}

	@Override
	public boolean isVerified(Integer doctorId) {
		return doctorVerificationRepository
				.findFirstByDoctorIdAndStatusOrderBySubmittedAtDesc(doctorId, VerificationStatus.APPROVED)
				.isPresent();
	}

	@Override
	public boolean hasPendingVerification(Integer doctorId) {
		return doctorVerificationRepository.existsByDoctorIdAndStatus(doctorId, VerificationStatus.PENDING);
	}

	@Override
	public DoctorVerificationDetailDto getVerificationDetails(Integer verificationId) {
		DoctorVerification dv = doctorVerificationRepository.findById(verificationId)
				.orElseThrow(() -> new IllegalArgumentException("Verification not found with ID: " + verificationId));
		return doctorVerificationMapper.toDetailDto(dv);
	}

	@Override
	public DoctorVerificationSummaryDto resubmit(Integer doctorId) {
		if (!canResubmit(doctorId)) {
			throw new IllegalStateException("Doctor cannot resubmit at this time.");
		}
		User doctor = userRepository.findById(doctorId)
				.orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + doctorId));
		DoctorVerification dv = new DoctorVerification();
		dv.setDoctor(doctor);
		dv.setStatus(VerificationStatus.PENDING);
		dv = doctorVerificationRepository.save(dv);
		return doctorVerificationMapper.toSummaryDto(dv);
	}

	@Override
	public boolean canResubmit(Integer doctorId) {
		// Allowed if latest attempt exists and is REJECTED and no current PENDING
		DoctorVerification latest = doctorVerificationRepository.findTopByDoctorIdOrderBySubmittedAtDesc(doctorId)
				.orElse(null);
		if (latest == null) {
			return false;
		}
		return latest.getStatus() == VerificationStatus.REJECTED
				&& !doctorVerificationRepository.existsByDoctorIdAndStatus(doctorId, VerificationStatus.PENDING);
	}

}
