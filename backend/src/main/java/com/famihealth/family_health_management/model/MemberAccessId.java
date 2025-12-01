package com.famihealth.family_health_management.model;

import java.io.Serializable;
import java.util.Objects;

public class MemberAccessId implements Serializable {

	private Integer memberId;
	private Integer doctorId;

	public MemberAccessId() {
	}

	public MemberAccessId(Integer memberId, Integer doctorId) {
		this.memberId = memberId;
		this.doctorId = doctorId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof MemberAccessId))
			return false;
		MemberAccessId that = (MemberAccessId) o;
		return Objects.equals(memberId, that.memberId) && Objects.equals(doctorId, that.doctorId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(memberId, doctorId);
	}

	public Integer getMemberId() {
		return memberId;
	}

	public void setMemberId(Integer memberId) {
		this.memberId = memberId;
	}

	public Integer getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Integer doctorId) {
		this.doctorId = doctorId;
	}
}
