# 🏥 Family Health Management System

A full-stack **Family Health Management Web Application** built for university J2EE coursework using **Spring Boot (Maven)** for the backend and **ReactJS (TailwindCSS + Ant Design)** for the frontend.

This system helps families manage their members’ **medical records**, **vaccinations**, **appointments**, and **health statistics**, while allowing **doctors** to collaborate with families and **admins** to manage users and master data.

---

## 🧩 Project Architecture

- **Architecture**: Layered + Client–Server (Monolithic)
- **Backend**: Spring Boot (Maven)
  - Layers: Controller → Service → Repository → Entity (Model)
  - JPA/Hibernate ORM for database interaction
  - DTO + Mapper (MapStruct) to prevent N+1 queries and improve performance
- **Frontend**: ReactJS + TailwindCSS + Ant Design
  - Component-based UI
  - Axios for API communication
- **Database**: MySQL  
  Schema defined in [`famihealth-management.sql`](./docs/famihealth-management.sql)

---

## 🧑‍💻 Roles and Permissions

The system defines **four main roles** with distinct permissions:

| Role | Description | Key Permissions |
|------|--------------|----------------|
| **Admin** | System administrator who manages all users and master data. | - Manage user accounts (create, edit, lock/unlock) <br> - Verify doctors <br> - Manage master tables (vaccines, drugs, relationships, facilities, etc.) |
| **Doctor (GP)** | Licensed doctor who can link with families to provide care and access family medical records. | - View and update family medical records <br> - Write diagnoses, treatments, prescriptions <br> - Schedule and complete appointments |
| **Family Creator** | The user who creates and manages a family account. Acts as family admin. | - Add/remove family members <br> - Grant/revoke doctor access <br> - Schedule appointments <br> - View and update family health records |
| **Family Member** | An individual within the family added by the family creator. | - View personal medical records, vaccination history, and health stats |

---

## 📂 Key Database Entities

| Table | Description |
|--------|--------------|
| `users` | Stores all system accounts linked to a `role_id`. |
| `roles`, `permissions`, `role_permissions` | Manage RBAC (role-based access control). |
| `families`, `family_members`, `family_access` | Handle family grouping and access control. |
| `doctor_profiles`, `doctor_verifications` | Manage doctor registration and admin verification. |
| `appointments` | Schedule, cancel, or complete medical visits. |
| `medical_records`, `prescriptions`, `prescription_items`, `medical_documents` | Store and organize treatment data. |
| `vaccines`, `vaccination_records` | Manage immunization history. |
| `health_stats_types`, `health_stats` | Record and track family members' health metrics. |
| `facilities` | Master table for hospitals or clinics. |
| `drugs` | Master drug list for prescriptions. |
| `relationships_to_creator` | Defines relationships (father, mother, child, etc.). |
| `password_reset_tokens`, `family_invite_codes` | Handle user authentication utilities and invites. |

---

## 🚀 Features Summary

### 👨‍👩‍👧 Family Management

- Create and manage family groups
- Invite members using unique family codes
- Manage relationships between members

### 🩺 Health Records

- Add and update medical records, prescriptions, and attached files
- Manage allergy and vaccination history
- Track personal health stats (height, weight, blood pressure, etc.)

### 🧑‍⚕️ Doctor Collaboration

- Family creator grants access to a doctor
- Doctor can update diagnoses, add follow-ups, or prescribe medication
- Appointment system for scheduling visits

### ⚙️ Admin Management

- Manage all users (lock/unlock, assign roles)
- Approve/reject doctor verification requests
- Update master data tables (vaccines, drugs, facilities)
