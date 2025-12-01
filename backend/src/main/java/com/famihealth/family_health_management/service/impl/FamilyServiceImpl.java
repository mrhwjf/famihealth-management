package com.famihealth.family_health_management.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.family.FamilyCreateRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyFilterRequest;
import com.famihealth.family_health_management.dto.request.family.FamilyUpdateRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberCreateRequest;
import com.famihealth.family_health_management.dto.request.family_member.FamilyMemberUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.IdNamePair;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.family.FamilyDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberFormDto;
import com.famihealth.family_health_management.dto.response.family_member.FamilyMemberSummaryDto;
import com.famihealth.family_health_management.dto.response.member_access.MemberAccessDto;
import com.famihealth.family_health_management.enums.BloodType;
import com.famihealth.family_health_management.enums.Gender;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.FamilyMapper;
import com.famihealth.family_health_management.mapper.FamilyMemberMapper;
import com.famihealth.family_health_management.mapper.MemberAccessMapper;
import com.famihealth.family_health_management.model.Family;
import com.famihealth.family_health_management.model.FamilyAccess;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.MemberAccess;
import com.famihealth.family_health_management.model.RelationshipsToCreator;
import com.famihealth.family_health_management.model.User;
import com.famihealth.family_health_management.repository.FamilyAccessRepository;
import com.famihealth.family_health_management.repository.FamilyMemberRepository;
import com.famihealth.family_health_management.repository.FamilyRepository;
import com.famihealth.family_health_management.repository.MemberAccessRepository;
import com.famihealth.family_health_management.repository.RelationshipsToCreatorRepository;
import com.famihealth.family_health_management.repository.UserRepository;
import com.famihealth.family_health_management.service.FamilyInviteCodeService;
import com.famihealth.family_health_management.service.FamilyService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.specs.FamilySpecs;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class FamilyServiceImpl implements FamilyService {

	private static final String ROLE_FAMILY = "FAMILY";
	private static final String ROLE_DOCTOR = "DOCTOR";

	private final FamilyRepository familyRepository;
	private final FamilyAccessRepository familyAccessRepository;
	private final FamilyMemberRepository familyMemberRepository;
	private final MemberAccessRepository memberAccessRepository;
	private final RelationshipsToCreatorRepository relationshipsToCreatorRepository;
	private final UserRepository userRepository;
	private final FamilyInviteCodeService familyInviteCodeService;
	private final SessionService sessionService;
	private final FamilyMapper familyMapper;
	private final FamilyMemberMapper familyMemberMapper;
	private final MemberAccessMapper memberAccessMapper;

	@Override
	public FamilyDto create(String sessionId, FamilyCreateRequest req) {
		SessionData session = requireSession(sessionId);

		if (session.getRole() == null || !ROLE_FAMILY.equalsIgnoreCase(session.getRole())) {
			throw new ForbiddenException("Only family accounts can perform this action");
		}

		User requester = userRepository.findById(session.getUserId())
				.orElseThrow(() -> new NotFoundException("User not found"));

		Family family = familyMapper.toEntity(req);
		family.setCreator(requester);

		family = familyRepository.save(family);

		FamilyAccess access = familyAccessBuilder(family.getId(), requester.getId(), Boolean.TRUE, family, requester);
		familyAccessRepository.save(access);

		familyInviteCodeService.createInviteCodeForFamily(family.getId());

		return familyMapper.toDto(family);
	}

	@Override
	public FamilyDto updateById(String sessionId, Integer id, FamilyUpdateRequest req) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(id);
		ensureCreator(session, family);

		familyMapper.updateEntityFromDto(req, family);

		family = familyRepository.save(family);
		return familyMapper.toDto(family);
	}

	@Override
	@Transactional(readOnly = true)
	public FamilyDto getById(String sessionId, Integer id) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(id);
		ensureHasAccess(session.getUserId(), family.getId());
		return familyMapper.toDto(family);
	}

	@Override
	public void deleteById(String sessionId, Integer id) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(id);
		ensureCreator(session, family);
		familyRepository.delete(family);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<FamilyDto> getAll(String sessionId, FamilyFilterRequest filter, Pageable pageable) {
		SessionData session = requireSession(sessionId);
		Integer requesterId = session.getUserId();
		List<Integer> accessibleFamilyIds = familyAccessRepository.findByUserId(requesterId).stream()
				.map(FamilyAccess::getFamilyId)
				.distinct()
				.toList();

		if (accessibleFamilyIds.isEmpty()) {
			Page<Family> emptyPage = Page.empty(pageable);
			return PageResponseMapper.fromPage(emptyPage, familyMapper::toDto);
		}

		Specification<Family> spec = FamilySpecs.hasIds(accessibleFamilyIds)
				.and(FamilySpecs.byFilter(filter));
		Page<Family> page = familyRepository.findAll(spec, pageable);
		return PageResponseMapper.fromPage(page, familyMapper::toDto);
	}

	@Override
	public void addUserToFamily(String sessionId, Integer familyId, Integer userId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);

		if (familyAccessRepository.existsByFamilyIdAndUserId(familyId, userId)) {
			throw new BadRequestException("User already has access to this family");
		}

		User targetUser = requireUser(userId);
		FamilyAccess access = familyAccessBuilder(familyId, userId, Boolean.FALSE, family, targetUser);
		familyAccessRepository.save(access);
	}

	@Override
	public void removeUserFromFamily(String sessionId, Integer familyId, Integer userId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);

		if (userId.equals(family.getCreator().getId())) {
			throw new BadRequestException("Family creator cannot be removed from their own family");
		}

		if (!familyAccessRepository.existsByFamilyIdAndUserId(familyId, userId)) {
			throw new BadRequestException("User does not have access to this family");
		}

		familyAccessRepository.deleteByFamilyIdAndUserId(familyId, userId);
	}

	@Override
	public FamilyMemberSummaryDto createMember(String sessionId, Integer familyId, FamilyMemberCreateRequest req) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);

		RelationshipsToCreator relationship = requireRelationship(req.getRelationshipToCreatorId());

		FamilyMember member = familyMemberMapper.toEntity(req);
		member.setFamily(family);
		member.setRelationshipToCreator(relationship);

		FamilyMember saved = familyMemberRepository.save(member);
		return familyMemberMapper.toSummaryDto(saved);
	}

	@Override
	public FamilyMemberSummaryDto updateMemberById(String sessionId, Integer familyId, Integer memberId,
			FamilyMemberUpdateRequest req) {
		SessionData session = requireSession(sessionId);
		FamilyMember member = requireMember(memberId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);
		requireRelationship(req.getRelationshipToCreatorId());

		familyMemberMapper.updateEntityFromDto(req, member);

		FamilyMember saved = familyMemberRepository.save(member);
		return familyMemberMapper.toSummaryDto(saved);
	}

	@Override
	public void linkUserToMember(String sessionId, Integer familyId, Integer memberId, Integer userId) {
		SessionData session = requireSession(sessionId);
		ensureRole(session, ROLE_FAMILY);
		if (!session.getUserId().equals(userId)) {
			throw new ForbiddenException("Users may only link themselves to a family member");
		}

		FamilyMember member = requireMember(memberId);
		Family family = member.getFamily();
		if (!family.getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}

		if (member.getUser() != null) {
			throw new BadRequestException("Family member is already linked to a user");
		}

		User user = requireUser(userId);
		if (user.getRole() == null || !ROLE_FAMILY.equalsIgnoreCase(user.getRole().getName())) {
			throw new ForbiddenException("Only family accounts can be linked to members");
		}

		member.setUser(user);
		familyMemberRepository.save(member);

		if (!familyAccessRepository.existsByFamilyIdAndUserId(familyId, userId)) {
			FamilyAccess access = familyAccessBuilder(familyId, userId, Boolean.FALSE, family, user);
			familyAccessRepository.save(access);
		}
	}

	@Override
	public void linkDoctorToMember(String sessionId, Integer familyId, Integer memberId, Integer doctorId) {
		SessionData session = requireSession(sessionId);
		ensureRole(session, ROLE_DOCTOR);
		if (!session.getUserId().equals(doctorId)) {
			throw new ForbiddenException("Doctors may only link their own accounts to members");
		}

		FamilyMember member = requireMember(memberId);
		Family family = member.getFamily();
		if (!family.getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}

		if (memberAccessRepository.existsByMemberIdAndDoctorId(memberId, doctorId)) {
			throw new BadRequestException("Doctor already has access to this member");
		}

		User doctor = requireUser(doctorId);
		if (doctor.getRole() == null || !ROLE_DOCTOR.equalsIgnoreCase(doctor.getRole().getName())) {
			throw new ForbiddenException("Target user is not a doctor");
		}

		MemberAccess access = memberAccessBuilder(memberId, doctorId, member, doctor);
		memberAccessRepository.save(access);

		if (!familyAccessRepository.existsByFamilyIdAndUserId(familyId, doctorId)) {
			FamilyAccess familyAccess = familyAccessBuilder(familyId, doctorId, Boolean.FALSE, family, doctor);
			familyAccessRepository.save(familyAccess);
		}
	}

	@Override
	@Transactional(readOnly = true)
	public List<FamilyMemberSummaryDto> getAllMembersInFamily(String sessionId, Integer familyId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureHasAccess(session.getUserId(), family.getId());

		List<FamilyMember> members = familyMemberRepository.findByFamily_Id(familyId);
		List<FamilyMemberSummaryDto> memberDtos = members.stream()
				.map(familyMemberMapper::toSummaryDto)
				.toList();
		return memberDtos;
	}

	@Override
	public void unlinkUserFromMember(String sessionId, Integer familyId, Integer memberId, Integer userId) {
		SessionData session = requireSession(sessionId);
		ensureRole(session, ROLE_FAMILY);
		if (!session.getUserId().equals(userId)) {
			throw new ForbiddenException("Users may only unlink themselves from a family member");
		}
		FamilyMember member = requireMember(memberId);
		Family family = member.getFamily();
		if (!family.getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}
		if (member.getUser() == null || !member.getUser().getId().equals(userId)) {
			throw new BadRequestException("Family member is not linked to the specified user");
		}
		member.setUser(null);
		familyMemberRepository.save(member);
	}

	@Override
	public void unlinkDoctorFromMember(String sessionId, Integer familyId, Integer memberId, Integer doctorId) {
		SessionData session = requireSession(sessionId);
		ensureRole(session, ROLE_FAMILY);
		if (!session.getUserId().equals(doctorId)) {
			throw new ForbiddenException("Doctors may only unlink their own accounts from members");
		}
		FamilyMember member = requireMember(memberId);
		Family family = member.getFamily();
		if (!family.getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}
		if (!memberAccessRepository.existsByMemberIdAndDoctorId(memberId, doctorId)) {
			throw new BadRequestException("Doctor does not have access to this member");
		}
		memberAccessRepository.deleteByMemberIdAndDoctorId(memberId, doctorId);
	}

	@Override
	public FamilyMemberFormDto getMemberFormData() {
		List<RelationshipsToCreator> relationships = relationshipsToCreatorRepository.findAll();
		List<IdNamePair> relationshipPairs = relationships.stream()
				.map(r -> new IdNamePair(r.getId(), r.getRelationshipName()))
				.toList();
		List<BloodType> bloodTypes = List.of(BloodType.values());
		List<Gender> genders = List.of(Gender.values());
		return FamilyMemberFormDto.builder()
				.relationshipsToCreator(relationshipPairs)
				.bloodTypes(bloodTypes)
				.genders(genders)
				.build();
	}

	@Override
	public FamilyMemberFormDto getMemberEditFormData(String sessionId, Integer familyId, Integer memberId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureHasAccess(session.getUserId(), family.getId());
		FamilyMember member = requireMember(memberId);
		if (!member.getFamily().getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}

		FamilyMemberSummaryDto memberDto = familyMemberMapper.toSummaryDto(member);
		FamilyMemberFormDto formDto = getMemberFormData();
		formDto.setFamilyMember(memberDto);
		return formDto;
	}

	private FamilyAccess familyAccessBuilder(Integer familyId, Integer userId, Boolean isCreator, Family family,
			User user) {
		return FamilyAccess.builder()
				.familyId(familyId)
				.userId(userId)
				.familyCreator(isCreator)
				.family(family)
				.user(user)
				.build();
	}

	private MemberAccess memberAccessBuilder(Integer memberId, Integer doctorId, FamilyMember member, User doctor) {
		return MemberAccess.builder()
				.memberId(memberId)
				.doctorId(doctorId)
				.member(member)
				.doctor(doctor)
				.build();
	}

	private SessionData requireSession(String sessionId) {
		return sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid session"));
	}

	private User requireUser(Integer userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new NotFoundException("User not found"));
	}

	private Family requireFamily(Integer familyId) {
		return familyRepository.findById(familyId)
				.orElseThrow(() -> new NotFoundException("Family not found"));
	}

	private FamilyMember requireMember(Integer memberId) {
		return familyMemberRepository.findById(memberId)
				.orElseThrow(() -> new NotFoundException("Family member not found"));
	}

	private RelationshipsToCreator requireRelationship(Integer relationshipId) {
		return relationshipsToCreatorRepository.findById(relationshipId)
				.orElseThrow(() -> new NotFoundException("Relationship to creator not found"));
	}

	private void ensureHasAccess(Integer userId, Integer familyId) {
		boolean hasAccess = familyAccessRepository.existsByFamilyIdAndUserId(familyId, userId);
		if (!hasAccess) {
			throw new ForbiddenException("User does not have access to this family");
		}
	}

	private void ensureCreator(SessionData session, Family family) {
		if (!family.getCreator().getId().equals(session.getUserId())) {
			throw new ForbiddenException("Only the family creator can perform this action");
		}
	}

	private void ensureRole(SessionData session, String requiredRole) {
		if (session.getRole() == null || !requiredRole.equalsIgnoreCase(session.getRole())) {
			throw new ForbiddenException("Cannot perform this action with the current account role");
		}
	}

	@Override
	public void deleteMemberById(String sessionId, Integer familyId, Integer memberId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureCreator(session, family);
		FamilyMember member = requireMember(memberId);
		if (!member.getFamily().getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}
		familyMemberRepository.delete(member);
	}

	@Override
	public FamilyMemberSummaryDto getMemberById(String sessionId, Integer familyId, Integer memberId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureHasAccess(session.getUserId(), family.getId());
		FamilyMember member = requireMember(memberId);
		if (!member.getFamily().getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}
		return familyMemberMapper.toSummaryDto(member);
	}

	@Override
	@Transactional(readOnly = true)
	public List<MemberAccessDto> getMembersAccessList(String sessionId, Integer familyId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		ensureHasAccess(session.getUserId(), family.getId());

		List<FamilyMember> members = familyMemberRepository.findByFamily_Id(familyId);
		List<MemberAccessDto> accessDtos = members.stream()
				.flatMap(member -> {
					List<MemberAccess> accesses = memberAccessRepository.findByMemberId(member.getId());
					return accesses.stream()
							.map(access -> memberAccessMapper.toDto(member, access.getDoctor()));
				})
				.toList();
		return accessDtos;
	}
}
