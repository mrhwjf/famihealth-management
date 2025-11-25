package com.famihealth.family_health_management.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.famihealth.family_health_management.dto.request.health_stat.HealthStatCreateRequest;
import com.famihealth.family_health_management.dto.request.health_stat.HealthStatFilterRequest;
import com.famihealth.family_health_management.dto.request.health_stat.HealthStatUpdateRequest;
import com.famihealth.family_health_management.dto.response.common.PageResponse;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDetailDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatDto;
import com.famihealth.family_health_management.dto.response.health_stats.HealthStatSummaryDto;
import com.famihealth.family_health_management.dto.response.auth.SessionData;
import com.famihealth.family_health_management.exception.BadRequestException;
import com.famihealth.family_health_management.exception.ForbiddenException;
import com.famihealth.family_health_management.exception.NotFoundException;
import com.famihealth.family_health_management.mapper.HealthStatMapper;
import com.famihealth.family_health_management.model.Family;
import com.famihealth.family_health_management.model.FamilyMember;
import com.famihealth.family_health_management.model.HealthStat;
import com.famihealth.family_health_management.model.HealthStatsType;
import com.famihealth.family_health_management.repository.FamilyAccessRepository;
import com.famihealth.family_health_management.repository.FamilyMemberRepository;
import com.famihealth.family_health_management.repository.FamilyRepository;
import com.famihealth.family_health_management.repository.HealthStatRepository;
import com.famihealth.family_health_management.repository.HealthStatsTypeRepository;
import com.famihealth.family_health_management.service.HealthStatService;
import com.famihealth.family_health_management.service.SessionService;
import com.famihealth.family_health_management.utils.PageResponseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthStatServiceImpl implements HealthStatService {

	private final HealthStatRepository healthStatRepository;
	private final FamilyRepository familyRepository;
	private final FamilyMemberRepository familyMemberRepository;
	private final HealthStatsTypeRepository healthStatsTypeRepository;
	private final FamilyAccessRepository familyAccessRepository;
	private final SessionService sessionService;
	private final HealthStatMapper healthStatMapper;

	@Override
	public HealthStatDto create(String sessionId, Integer familyId, Integer memberId, HealthStatCreateRequest req) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		FamilyMember member = requireMember(memberId);
		ensureMemberBelongsToFamily(member, familyId);
		ensureCanModify(session, family);

		HealthStatsType statsType = requireStatsType(req.getStatsTypeId());

		HealthStat entity = new HealthStat();
		entity.setFamilyMember(member);
		entity.setStatsType(statsType);
		entity.setValue(req.getValue());

		HealthStat saved = healthStatRepository.save(entity);
		return healthStatMapper.toDto(saved);
	}

	@Override
	public HealthStatDto updateById(String sessionId, Integer familyId, Integer memberId, Integer healthStatId,
			HealthStatUpdateRequest req) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		FamilyMember member = requireMember(memberId);
		ensureMemberBelongsToFamily(member, familyId);
		ensureCanModify(session, family);

		HealthStat stat = requireHealthStat(healthStatId);
		ensureStatBelongsToMember(stat, memberId);

		if (req.getStatsTypeId() != null && (stat.getStatsType() == null
				|| !req.getStatsTypeId().equals(stat.getStatsType().getId()))) {
			HealthStatsType statsType = requireStatsType(req.getStatsTypeId());
			stat.setStatsType(statsType);
		}

		stat.setValue(req.getValue());

		HealthStat saved = healthStatRepository.save(stat);
		return healthStatMapper.toDto(saved);
	}

	@Override
	public void deleteById(String sessionId, Integer familyId, Integer memberId, Integer healthStatId) {
		SessionData session = requireSession(sessionId);
		Family family = requireFamily(familyId);
		FamilyMember member = requireMember(memberId);
		ensureMemberBelongsToFamily(member, familyId);
		ensureCanModify(session, family);

		HealthStat stat = requireHealthStat(healthStatId);
		ensureStatBelongsToMember(stat, memberId);

		healthStatRepository.delete(stat);
	}

	@Override
	@Transactional(readOnly = true)
	public HealthStatDetailDto getById(String sessionId, Integer familyId, Integer memberId, Integer healthStatId) {
		SessionData session = requireSession(sessionId);
		requireFamily(familyId);
		ensureHasAccess(session.getUserId(), familyId);

		FamilyMember member = requireMember(memberId);
		ensureMemberBelongsToFamily(member, familyId);

		HealthStat stat = requireHealthStat(healthStatId);
		ensureStatBelongsToMember(stat, memberId);

		return healthStatMapper.toDetailDto(stat);
	}

	@Override
	@Transactional(readOnly = true)
	public PageResponse<HealthStatSummaryDto> getByMember(String sessionId, Integer familyId, Integer memberId,
			HealthStatFilterRequest filter, Pageable pageable) {
		SessionData session = requireSession(sessionId);
		requireFamily(familyId);
		ensureHasAccess(session.getUserId(), familyId);

		FamilyMember member = requireMember(memberId);
		ensureMemberBelongsToFamily(member, familyId);

		HealthStatFilterRequest effectiveFilter = filter != null ? filter : new HealthStatFilterRequest();
		LocalDateTime start = effectiveFilter.getStart();
		LocalDateTime end = effectiveFilter.getEnd();

		if ((start == null) != (end == null)) {
			throw new BadRequestException("Both start and end timestamps must be provided together");
		}

		if (start != null && end != null && start.isAfter(end)) {
			throw new BadRequestException("Start timestamp must be before end timestamp");
		}

		Page<HealthStat> page;
		Integer statsTypeId = effectiveFilter.getStatsTypeId();

		if (statsTypeId != null && start != null && end != null) {
			page = healthStatRepository.findByFamilyMember_IdAndStatsType_IdAndCreatedAtBetween(memberId, statsTypeId,
					start, end, pageable);
		} else if (statsTypeId != null) {
			page = healthStatRepository.findByFamilyMember_IdAndStatsType_Id(memberId, statsTypeId, pageable);
		} else if (start != null && end != null) {
			page = healthStatRepository.findByFamilyMember_IdAndCreatedAtBetween(memberId, start, end, pageable);
		} else {
			page = healthStatRepository.findByFamilyMember_Id(memberId, pageable);
		}

		return PageResponseMapper.fromPage(page, healthStatMapper::toSummaryDto);
	}

	private SessionData requireSession(String sessionId) {
		return sessionService.getSession(sessionId)
				.orElseThrow(() -> new ForbiddenException("Invalid session"));
	}

	private Family requireFamily(Integer familyId) {
		return familyRepository.findById(familyId)
				.orElseThrow(() -> new NotFoundException("Family not found"));
	}

	private FamilyMember requireMember(Integer memberId) {
		return familyMemberRepository.findById(memberId)
				.orElseThrow(() -> new NotFoundException("Family member not found"));
	}

	private HealthStat requireHealthStat(Integer healthStatId) {
		return healthStatRepository.findById(healthStatId)
				.orElseThrow(() -> new NotFoundException("Health stat not found"));
	}

	private HealthStatsType requireStatsType(Integer statsTypeId) {
		return healthStatsTypeRepository.findById(statsTypeId)
				.orElseThrow(() -> new NotFoundException("Health stats type not found"));
	}

	private void ensureMemberBelongsToFamily(FamilyMember member, Integer familyId) {
		if (member.getFamily() == null || !member.getFamily().getId().equals(familyId)) {
			throw new BadRequestException("Family member does not belong to the provided family");
		}
	}

	private void ensureStatBelongsToMember(HealthStat stat, Integer memberId) {
		if (stat.getFamilyMember() == null || !stat.getFamilyMember().getId().equals(memberId)) {
			throw new BadRequestException("Health stat does not belong to the provided family member");
		}
	}

	private void ensureHasAccess(Integer userId, Integer familyId) {
		boolean hasAccess = familyAccessRepository.existsByFamilyIdAndUserId(familyId, userId);
		if (!hasAccess) {
			throw new ForbiddenException("User does not have access to this family");
		}
	}

	private void ensureCanModify(SessionData session, Family family) {
		if (family.getCreator() == null || !family.getCreator().getId().equals(session.getUserId())) {
			throw new ForbiddenException("Only the family creator can modify health stats");
		}
	}
}
