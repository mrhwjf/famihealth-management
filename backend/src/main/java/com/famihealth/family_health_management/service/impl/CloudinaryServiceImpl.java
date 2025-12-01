package com.famihealth.family_health_management.service.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.dto.response.common.FileUploadResponseDto;
import com.famihealth.family_health_management.dto.response.medical_document.MedicalDocumentDto;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.MedicalDocumentMapper;
import com.famihealth.family_health_management.model.DoctorProfile;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.MedicalDocument;
import com.famihealth.family_health_management.model.MedicalRecord;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.DoctorProfileRepository;
import com.famihealth.family_health_management.repository.FamilyMemberRepository;
import com.famihealth.family_health_management.repository.MedicalDocumentRepository;
import com.famihealth.family_health_management.repository.MedicalRecordRepository;
import com.famihealth.family_health_management.repository.MemberAccessRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.CloudinaryService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.utils.FileTypeUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

	private static final String USER_PROFILE_FOLDER = "users/profile";
	private static final String FAMILY_MEMBER_PROFILE_FOLDER = "family-members/profile";
	private static final String DOCTOR_CERTIFICATE_FOLDER = "doctors/certificates";
	private static final String MEDICAL_DOCUMENT_FOLDER = "medical-records/documents";

	private final Cloudinary cloudinary;
	private final SessionService sessionService;
	private final UserRepository userRepository;
	private final FamilyMemberRepository familyMemberRepository;
	private final DoctorProfileRepository doctorProfileRepository;
	private final MedicalRecordRepository medicalRecordRepository;
	private final MedicalDocumentRepository medicalDocumentRepository;
	private final MemberAccessRepository memberAccessRepository;
	private final MedicalDocumentMapper medicalDocumentMapper;

	@Override
	@Transactional
	public FileUploadResponseDto uploadUserProfilePicture(String sessionId, MultipartFile file) {
		SessionData session = requireSession(sessionId);
		User user = requireUser(session.getUserId());
		requireFile(file);
		ensureImage(file, "Only image files are allowed for profile pictures");
		String publicId = FileTypeUtils.buildPublicId(USER_PROFILE_FOLDER, user.getId(), file,
				System.currentTimeMillis());
		String secureUrl = upload(file, "image", publicId);
		user.setProfileUrl(secureUrl);
		userRepository.save(user);
		return FileUploadResponseDto.builder().fileUrl(secureUrl).build();
	}

	@Override
	@Transactional
	public FileUploadResponseDto uploadFamilyMemberProfilePicture(String sessionId, Integer memberId,
			MultipartFile file) {
		SessionData session = requireSession(sessionId);
		FamilyMember member = requireMember(memberId);
		ensureCanUpdateMemberProfile(session.getUserId(), member);
		requireFile(file);
		ensureImage(file, "Only image files are allowed for family member profile pictures");
		String publicId = FileTypeUtils.buildPublicId(FAMILY_MEMBER_PROFILE_FOLDER, member.getId(), file,
				System.currentTimeMillis());
		String secureUrl = upload(file, "image", publicId);
		member.setProfileUrl(secureUrl);
		familyMemberRepository.save(member);
		return FileUploadResponseDto.builder().fileUrl(secureUrl).build();
	}

	@Override
	@Transactional
	public FileUploadResponseDto uploadDoctorCertificate(String sessionId, Integer doctorId, MultipartFile file) {
		SessionData session = requireSession(sessionId);
		if (!doctorId.equals(session.getUserId())) {
			throw new ForbiddenException("You may only upload your own certificate");
		}
		DoctorProfile profile = doctorProfileRepository.findByDoctorId(doctorId)
				.orElseThrow(() -> new NotFoundException("Doctor profile not found"));
		requireFile(file);
		ensurePdf(file, "Doctor certificates must be PDF files");
		String publicId = FileTypeUtils.buildPublicId(DOCTOR_CERTIFICATE_FOLDER, doctorId, file,
				System.currentTimeMillis());
		String secureUrl = upload(file, "raw", publicId);
		profile.setCertificateFileUrl(secureUrl);
		doctorProfileRepository.save(profile);
		return FileUploadResponseDto.builder().fileUrl(secureUrl).build();
	}

	@Override
	@Transactional
	public MedicalDocumentDto uploadMedicalDocument(String sessionId, Integer medicalRecordId, MultipartFile file) {
		SessionData session = requireSession(sessionId);
		MedicalRecord record = requireRecord(medicalRecordId);
		FamilyMember member = record.getFamilyMember();
		if (member == null) {
			throw new NotFoundException("Medical record is not linked to a family member");
		}
		ensureCanUploadDocument(session, record);
		requireFile(file);
		String resourceType = resolveResourceType(file);
		String publicId = FileTypeUtils.buildPublicId(MEDICAL_DOCUMENT_FOLDER, record.getId(), file,
				System.currentTimeMillis());
		String secureUrl = upload(file, resourceType, publicId);
		MedicalDocument document = new MedicalDocument();
		document.setMedicalRecord(record);
		document.setFileUrl(secureUrl);
		document.setFileName(resolveFileName(file));
		MedicalDocument saved = medicalDocumentRepository.save(document);
		return medicalDocumentMapper.toDto(saved);
	}

	@Override
	public void deleteFile(String url) {
		if (!StringUtils.hasText(url)) {
			return;
		}
		String publicId = FileTypeUtils.extractPublicId(url);
		if (!StringUtils.hasText(publicId)) {
			return;
		}
		String resourceType = FileTypeUtils.extractResourceType(url);
		if (!StringUtils.hasText(resourceType)) {
			resourceType = "image";
		}
		try {
			cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
		} catch (IOException ex) {
			throw new IllegalStateException("Failed to delete file from Cloudinary", ex);
		}
	}

	private String resolveResourceType(MultipartFile file) {
		String resourceType;
		try {
			resourceType = FileTypeUtils.determineResourceType(file);
		} catch (IllegalArgumentException ex) {
			throw new BadRequestException("Unsupported file type");
		}
		if ("image".equals(resourceType)) {
			ensureImage(file, "Only image files are allowed for image medical documents");
		}
		if ("raw".equals(resourceType)) {
			ensurePdf(file, "Only PDF files are allowed for raw medical documents");
		}
		return resourceType;
	}

	private String resolveFileName(MultipartFile file) {
		String base = FileTypeUtils.sanitizeFileName(file.getOriginalFilename());
		String ext = FileTypeUtils.getExtension(file);
		if (StringUtils.hasText(ext)) {
			return base + "." + ext;
		}
		return base;
	}

	private SessionData requireSession(String sessionId) {
		return sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid or expired session"));
	}

	private User requireUser(Integer userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("User not found"));
	}

	private FamilyMember requireMember(Integer memberId) {
		return familyMemberRepository.findById(memberId)
				.orElseThrow(() -> new NotFoundException("Family member not found"));
	}

	private MedicalRecord requireRecord(Integer recordId) {
		return medicalRecordRepository.findById(recordId)
				.orElseThrow(() -> new NotFoundException("Medical record not found"));
	}

	private void ensureCanUpdateMemberProfile(Integer requesterId, FamilyMember member) {
		boolean isCreator = member.getFamily() != null
				&& member.getFamily().getCreator() != null
				&& member.getFamily().getCreator().getId().equals(requesterId);

		boolean isSelf = member.getUser() != null
				&& member.getUser().getId() != null
				&& member.getUser().getId().equals(requesterId);

		if (!isCreator && !isSelf) {
			throw new ForbiddenException("You are not allowed to update this member's profile picture");
		}
	}

	private void ensureCanUploadDocument(SessionData session, MedicalRecord record) {
		Integer requesterId = session.getUserId();
		FamilyMember member = record.getFamilyMember();
		if (member == null) {
			throw new ForbiddenException("Medical record is not linked to a family member");
		}

		if (member.getFamily() != null
				&& member.getFamily().getCreator() != null
				&& member.getFamily().getCreator().getId().equals(requesterId)) {
			return;
		}

		if (member.getUser() != null
				&& member.getUser().getId() != null
				&& member.getUser().getId().equals(requesterId)) {
			return;
		}

		if (memberAccessRepository.existsByMemberIdAndDoctorId(member.getId(), requesterId)) {
			return;
		}

		if (record.getDoctor() != null
				&& record.getDoctor().getId() != null
				&& record.getDoctor().getId().equals(requesterId)) {
			return;
		}

		throw new ForbiddenException("You do not have permission to upload documents for this member");
	}

	private void ensureImage(MultipartFile file, String message) {
		if (!FileTypeUtils.isImage(file)) {
			throw new BadRequestException(message);
		}
	}

	private void ensurePdf(MultipartFile file, String message) {
		if (!FileTypeUtils.isPdf(file)) {
			throw new BadRequestException(message);
		}
	}

	private String upload(MultipartFile file, String resourceType, String publicId) {
		try {
			Map<?, ?> result = cloudinary.uploader()
					.upload(file.getBytes(), ObjectUtils.asMap(
							"resource_type", resourceType,
							"public_id", publicId,
							"overwrite", true,
							"invalidate", true,
							"use_filename", false,
							"unique_filename", false));
			Object secureUrl = result.get("secure_url");
			if (secureUrl == null) {
				throw new IllegalStateException("Cloudinary did not return a secure_url");
			}
			return secureUrl.toString();
		} catch (IOException ex) {
			throw new IllegalStateException("Failed to upload file to Cloudinary", ex);
		}
	}

	private void requireFile(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new BadRequestException("File must not be empty");
		}
	}
}
