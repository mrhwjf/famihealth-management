NOTE: This file provides Copilot with additional context about the backend architecture, patterns, and conventions to follow when generating code. See [README.md](/README.md) for overall project details.

Defintions:

- Master tables: Static tables whose only purpose is used for references and lookups, e.g., `roles`, `permissions`, `facilities`, `drugs`, `relationships_to_creator`, `vaccines`, `health_stats_types`.
- DTO: Data Transfer Object, used for API request/response payloads. Use @validation annotations in request DTOs for input validation.
- Entity/Model: JPA entity class mapped to a database table.
- Repository: Spring Data JPA repository interface for database operations.
- Service: Business logic layer interacting with repositories. Use DTOs for service methods.
- Controller: REST API layer handling HTTP requests/responses. Do not use mapper in controller, use service to handle mapping.
- Mapper: Component responsible for mapping between entities and DTOs.

### Backend Architecture ###

- Layered architecture: `controller ➜ service ➜ repository ➜ model`, with DTOs in `dto/{request,response}`.
- Entities in `backend/src/main/java/.../model/` (e.g., `DoctorProfile.java`). Tables are plural snake_case (e.g., `doctor_profiles`). Primary keys usually `Integer`.
- Repositories extend `JpaRepository<..., Integer>` (see `repository/*.java`, e.g., `VaccineRepository.java`).
- Response DTOs under `dto/response` use Lombok `@Data`/`@Builder` and Java time (e.g., `UserDto.java`).
- Request DTOs under `dto/request` use Jakarta validation annotations (e.g., `CreateUserRequest.java`).
- MapStruct configured in `pom.xml` (annotationProcessorPaths). Mappers declared under `.../mapper` as interfaces with `@Mapper`; code-gen lands under `backend/target/generated-sources/annotations/.../mapper/`.
- Service layer contains business logic and interacts with repositories. Service interfaces in `service/` and implementations in `service/impl/`.
- Entities kept simple with JPA annotations; repositories extend `JpaRepository`. Use explicit `@Table(name = "...")` when plural/snake case differs from class name (see `DoctorProfile.java`).
- Prefer MapStruct for entity↔DTO translation. Example pattern:
  - Interface in `.../mapper`:
  - Inject and use mappers in services.
- Use Spring Security for authentication/authorization with JWT and role-based access control (RBAC).

### Conventions and Patterns to Follow ###

- DTOs: Put request/response DTOs in `dto/request` and `dto/response`. Response will be used in api responses (built with class `ApiResponse.java`), while request DTOs will be used for incoming requests with jakarta validations. Use Lombok to reduce boilerplate. Use `LocalDateTime` for timestamps.

- **DTO Naming and Pattern Rules:**
  - Use clear, consistent suffixes to indicate purpose and direction:

    | Type | Suffix | Example |
    |------|---------|----------|
    | Flat-id DTO | `Dto` | `FamilyMemberDto` |
    | Detailed/nested response DTO | `DetailDto` | `MedicalRecordDetailDto` |
    | Display-table response DTO | `SummaryDto` | `AppointmentSummaryDto` |
    | Form (for Create/Update) response DTO | `FormDto` | `MedicalRecordFormDto` |
    | Create request DTO | `CreateRequest` | `FamilyMemberCreateRequest` |
    | Update request DTO | `UpdateRequest` | `FamilyMemberUpdateRequest` |
    | Search/filter request DTO | `SearchRequest` / `FilterRequest` | `FilterAppointmentRequest` |

  - Avoid putting `id` in create/update request DTOs — use path variables for updates.
  - Normal Dto: flat DTO with only IDs for relationships (lightweight, i.e., display the id of the doctor instead of the name of the doctor). Mostly used for create/update operations + validation annotations.
  - SummaryDto: Use name attribute in place of id for list responses (lightweight, i.e display the name of the doctor instead of the id of the doctor). Some fields can be omitted if not needed.
  - DetailDto: nested DTOs (e.g., with related DetailDtos, or SummaryDtos if some fields needed hidden) for detailed responses. This helps optimize payload size and clarity, preventing the N+1 query problem. Make sure to check for circular references when nesting DTOs.
  - FormDto: used to pre-fill forms for create/update operations. Can include lists of related entities for dropdowns (e.g., list of Facilities when creating a MedicalRecord). This mostly for transactional tables, rare in master tables.
  - For relationships, include nested DTOs in detailed responses (e.g., `MedicalRecordDetailDto` includes `FamilyMemberSummaryDto`), but use only IDs in summary responses.
  - For master tables, only basic `Dto` is needed; no need for `DetailDto` or `SummaryDto`.
  - Use `CreateRequest` and `UpdateRequest` for create/update operations. Use validation annotations in these DTOs.
  - Keep naming aligned with the entity name: e.g., `FamilyMember` → `FamilyMemberDto`, not `FamilymemberDto`.
  - Always suffix response DTOs with `Dto` and request DTOs with `Request`.

- **Services Pattern:** 
  - Services should contain business logic and interact with repositories. They are typically defined as interfaces in `service/` and implemented in `service/impl/`. Use constructor injection for dependencies. Keep methods focused and cohesive.
  - Service methods should use DTOs for input/output, not entities.
  - Service methods should be named clearly to indicate their purpose (e.g., `createXxx`, `updateXxx`, `getById`, `getByYyy`, `listAll`, `deleteById`).
  - Methods that retrieve multiple records should return as `PageResponse<T>` for pagination support.
  - Use `@Transactional` annotations appropriately for methods that modify data.
  - For `listAll` or `getAll` methods, it should be flexible for the service to accept filtering parameters (e.g., `name`, `status`) and acts as a central method to call other private methods for specific filters, the default being to return all records if no filters are provided or defaulted to `@PageableDefault` in the controller.

#### Pagination Pattern (Recommended)

- Internally: Use Spring Data's `Pageable` and `Page<T>` for efficient DB queries and sorting.
- Externally: Expose a custom wrapper `PageResponse<T>` in API payloads to decouple from Spring types and keep responses consistent with `ApiResponse<T>`. Use the utility class `PageResponseMapper` to convert `Page<T>` to `PageResponse<T>` in services.

Example `PageResponse` DTO

```java
package com.famihealth.family_health_management.dto.response.common;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PageResponse<T> {
    private List<T> items;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;
}
```

Repository

```java
Page<Role> findByNameContainingIgnoreCase(String name, Pageable pageable);
```

Service

```java
PageResponse<RoleDto> getAll(String name, Pageable pageable);
```

Controller

```java
@GetMapping
public ResponseEntity<ApiResponse<PageResponse<RoleDto>>> getAll(
    @RequestParam(required = false) String name,
    @PageableDefault(size = 20, sort = "name") Pageable pageable) {

    PageResponse<RoleDto> pageResponse = roleService.getAll(name, pageable);
    return ResponseEntity.ok(ApiResponse.success("OK", pageResponse));
}
```

- **Mappers Pattern:**
  - Define mappers as interfaces in `mapper/` with `@Mapper` annotation.
  - Use MapStruct for automatic code generation. Use annotations to improve mapping.
  - Inject mappers into services and use them for entity↔DTO conversions.
  - A mapper of a single entity will include all mapping to other Dtos types (i.e a `FamilyMemberMapper` will include mapping methods for `FamilyMemberDetailDto`, `FamilyMemberSummaryDto`).
  Example:
    ```java
    @Mapper(componentModel = "spring")
    public interface XxxMapper {
        xxxDto toDto(Xxx entity);
        Xxx toEntity(xxxDto dto);
        void updateEntityFromDto(xxxDto dto, @MappingTarget Xxx entity);

        // Additional mapping methods for different DTO types
        XxxDetailDto toDetailDto(Xxx entity);
        XxxSummaryDto toSummaryDto(Xxx entity);

    }
    ```

- Persistence: Keep entities simple with JPA annotations; repositories extend `JpaRepository`. Use explicit `@Table(name = "...")` when plural/snake case differs from class name (see `DoctorProfile.java`). Define relationships with appropriate JPA annotations (`@OneToMany`, `@ManyToOne`, etc.). Do not use @validation annotations in entity classes; use them in request DTOs instead.

- **Controllers Pattern:** 
  - Handle HTTP requests and responses. Use `@RestController` and `@RequestMapping` annotations.
  - Validate incoming requests with `@Valid` and appropriate validation annotations in request DTOs.
  - Methods name should clearly indicate the action (e.g., `create`, `updateById`, `getById`, `getAll`, `deleteById`).
  - Parameter binding: Use `@PathVariable` for IDs in the URL path, `@RequestParam` for query parameters, and `@RequestBody` for request payloads. Use `@PageableDefault` for `pagable` parameters.
  - Wrap responses in `ApiResponse<T>`. Handle exceptions globally with `@ControllerAdvice`. 
  - Controllers should be thin, delegating business logic to services. 
  - Controller will use `ApiResponse<T>` as the standard response wrapper.

Example: (How a master table controller should look like)

```java
@GetMapping("/{id}")
public ResponseEntity<ApiResponse<HealthStatsTypeDto>> getById(@PathVariable Integer id) {
    HealthStatsTypeDto dto = healthStatsTypeService.getById(id);
    return ResponseEntity.ok(ApiResponse.success("OK", dto));
}

@GetMapping
public ResponseEntity<ApiResponse<PageResponse<HealthStatsTypeDto>>> getAll(
    @RequestParam(required = false) String name,
    @PageableDefault(size = 20, sort = "name") Pageable pageable) {

    PageResponse<HealthStatsTypeDto> pageResponse = healthStatsTypeService.getAll(name, pageable);
    return ResponseEntity.ok(ApiResponse.success("OK", pageResponse));
}
```

- Exceptions: Use custom exceptions for specific error scenarios (e.g., `ResourceNotFoundException`, `UnauthorizedException`). Handle exceptions globally with `@RestControllerAdvice` and return meaningful error responses. (Has implemented `GlobalExceptionHandler.java` in `com.famihealth.family_health_management.exception`).
- Security: For now, use RBAC with Spring Security. No need for JWT yet. Use `@PreAuthorize` annotations in controllers/services to enforce role-based access control.

### Main Services to Implement ### (focus on forms so that the backend knows what to implement)
1. User Management (CRUD, roles, permissions)
- This is admin only service.
- Frontend forms needed:
  - User List (with filters, pagination)
  - Create User Form: (no Oauth2)
    - Username
    - Password
    - Email
    - Roles (select 1 from multi-select)
    - If Doctor Role, then extend the main form to include:
      - License Number
      - Upload Certificate (file upload, will use Cloudinary later)
  - Edit User Form: Same as Create User Form, include Doctor Profile if Doctor but, has lock account option.
  - View User Detail Page: Show user info, include Doctor Profile if Doctor.
2. Role Management (CRUD, permissions)
- This is admin only service.
- Frontend forms needed:
  - Role List (with filters, pagination)
  - Create Role Form:
    - Role Name
    - Description
    - Permissions (select multiple from multi-select)
  - Edit Role Form: Same as Create Role Form.
  - View Role Detail Page: Show role info + list of permissions.
  - Delete Role Action (with confirmation modal).
3. Static/Master data Management (Read-only master data)
- Includes: Facilities, Drugs, Relationships to Creator, Vaccines, Health Stats Types, Permissions...
- This is admin only service.
- Basic CRUD only.
4. Doctor Verification Management (CRUD, status updates)
- This is admin only service.
- Frontend forms needed:
  - Doctor Verification List (with filters, pagination)
  - View Doctor Verification Detail Page: Show doctor verification info + approve/reject buttons.



### Later Expansion ### (do not implement now, just for future reference)

- Implement OAuth2 for authentication. (RBAC is used for authorization.)
- Cloudinary for file uploads (e.g., profile pictures, medical documents).
