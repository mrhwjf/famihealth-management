package com.famihealth.family_health_management.utils;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

public final class FileTypeUtils {

	private static final Set<String> IMAGE_CONTENT_TYPES = Set.of(
			MediaType.IMAGE_PNG_VALUE,
			MediaType.IMAGE_JPEG_VALUE,
			"image/webp");

	private static final Set<String> IMAGE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");
	private static final String PDF_CONTENT_TYPE = "application/pdf";

	private FileTypeUtils() {
	}

	public static boolean isImage(MultipartFile file) {
		String contentType = normalizeContentType(file.getContentType());
		if (contentType != null && IMAGE_CONTENT_TYPES.contains(contentType)) {
			return true;
		}
		String ext = getExtension(file);
		return ext != null && IMAGE_EXTENSIONS.contains(ext);
	}

	public static boolean isPdf(MultipartFile file) {
		String contentType = normalizeContentType(file.getContentType());
		if (PDF_CONTENT_TYPE.equals(contentType)) {
			return true;
		}
		String ext = getExtension(file);
		return "pdf".equals(ext);
	}

	public static String determineResourceType(MultipartFile file) {
		if (isPdf(file)) {
			return "raw";
		}
		if (isImage(file)) {
			return "image";
		}
		throw new IllegalArgumentException("Unsupported file type");
	}

	public static String sanitizeFileName(String originalFilename) {
		if (!StringUtils.hasText(originalFilename)) {
			return "file";
		}
		String base = originalFilename.replace("\\", "/");
		int lastSlash = base.lastIndexOf('/');
		if (lastSlash >= 0 && lastSlash < base.length() - 1) {
			base = base.substring(lastSlash + 1);
		}
		int dotIndex = base.lastIndexOf('.');
		if (dotIndex > 0) {
			base = base.substring(0, dotIndex);
		}
		String normalized = Normalizer.normalize(base, Normalizer.Form.NFD)
				.replaceAll("[^\\p{ASCII}]", "");
		normalized = normalized.replaceAll("[^A-Za-z0-9-_]", "-");
		normalized = normalized.replaceAll("-+", "-");
		normalized = normalized.replaceAll("^-|-$", "");
		if (!StringUtils.hasText(normalized)) {
			return "file";
		}
		return normalized.toLowerCase(Locale.ROOT);
	}

	public static String getExtension(MultipartFile file) {
		String originalFilename = file.getOriginalFilename();
		if (originalFilename != null && StringUtils.hasText(originalFilename)) {
			String lowered = originalFilename.toLowerCase(Locale.ROOT);
			int dotIndex = lowered.lastIndexOf('.');
			if (dotIndex >= 0 && dotIndex < lowered.length() - 1) {
				return lowered.substring(dotIndex + 1);
			}
		}
		String contentType = normalizeContentType(file.getContentType());
		if (!StringUtils.hasText(contentType)) {
			return null;
		}
		if (MediaType.IMAGE_PNG_VALUE.equals(contentType)) {
			return "png";
		}
		if (MediaType.IMAGE_JPEG_VALUE.equals(contentType)) {
			return "jpg";
		}
		if ("image/webp".equals(contentType)) {
			return "webp";
		}
		if (PDF_CONTENT_TYPE.equals(contentType)) {
			return "pdf";
		}
		return null;
	}

	public static String extractResourceType(String url) {
		if (!StringUtils.hasText(url)) {
			return null;
		}
		try {
			URI uri = new URI(url);
			String[] segments = uri.getPath().split("/");
			for (int i = 0; i < segments.length; i++) {
				if ("upload".equals(segments[i]) && i > 0) {
					return segments[i - 1];
				}
			}
		} catch (URISyntaxException ex) {
			return null;
		}
		return null;
	}

	public static String extractPublicId(String url) {
		if (!StringUtils.hasText(url)) {
			return null;
		}
		try {
			URI uri = new URI(url);
			String[] segments = uri.getPath().split("/");
			int uploadIndex = -1;
			for (int i = 0; i < segments.length; i++) {
				if ("upload".equals(segments[i])) {
					uploadIndex = i;
					break;
				}
			}
			if (uploadIndex < 0) {
				return null;
			}
			int startIndex = uploadIndex + 1;
			if (startIndex < segments.length && isVersionSegment(segments[startIndex])) {
				startIndex++;
			}
			if (startIndex >= segments.length) {
				return null;
			}
			String[] publicIdSegments = Arrays.copyOfRange(segments, startIndex, segments.length);
			String publicIdWithExt = String.join("/", publicIdSegments);
			if (!StringUtils.hasText(publicIdWithExt)) {
				return null;
			}
			int dotIndex = publicIdWithExt.lastIndexOf('.');
			if (dotIndex > 0) {
				return publicIdWithExt.substring(0, dotIndex);
			}
			return publicIdWithExt;
		} catch (URISyntaxException ex) {
			return null;
		}
	}

	public static String buildPublicId(String folder, Integer entityId, MultipartFile file, long timestampMillis) {
		Objects.requireNonNull(folder, "folder");
		Objects.requireNonNull(entityId, "entityId");
		String sanitized = sanitizeFileName(file.getOriginalFilename());
		return folder + "/" + entityId + "/" + timestampMillis + "-" + sanitized;
	}

	private static boolean isVersionSegment(String value) {
		return StringUtils.hasText(value) && value.startsWith("v") && value.length() > 1
				&& Character.isDigit(value.charAt(1));
	}

	private static String normalizeContentType(String contentType) {
		return StringUtils.hasText(contentType) ? contentType.toLowerCase(Locale.ROOT) : null;
	}
}
