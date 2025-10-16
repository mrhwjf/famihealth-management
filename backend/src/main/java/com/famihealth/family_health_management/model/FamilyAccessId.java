package com.famihealth.family_health_management.model;

import java.io.Serializable;
import java.util.Objects;

public class FamilyAccessId implements Serializable {

	private Integer familyId;
	private Integer userId;

	public FamilyAccessId() {
	}

	public FamilyAccessId(Integer familyId, Integer userId) {
		this.familyId = familyId;
		this.userId = userId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof FamilyAccessId))
			return false;
		FamilyAccessId that = (FamilyAccessId) o;
		return Objects.equals(familyId, that.familyId) && Objects.equals(userId, that.userId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(familyId, userId);
	}

	public Integer getFamilyId() {
		return familyId;
	}

	public void setFamilyId(Integer familyId) {
		this.familyId = familyId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}
}
