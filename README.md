# LearnSphere — School ERP Platform

> A modern, role-based Enterprise Resource Planning system built for The Learners Academy, Jaipur. LearnSphere digitizes and streamlines every administrative and academic workflow across the school — from student enrollment to parent progress monitoring — through a clean, secure, multi-role platform.

***

## Overview

The Learners Academy has operated entirely on manual, paper-based processes since 1993. LearnSphere replaces that with a centralized digital platform serving four active user roles — **Admin**, **Teacher**, **Staff**, and **Parent** — each with dedicated dashboards, permissions, and workflows.

Students are not active users of the platform. Their records, attendance, and academic progress are managed by teachers and administrators, and monitored by parents.

***

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4 |
| **State Management** | Zustand, TanStack Query |
| **Forms & Validation** | React Hook Form, Zod |
| **Backend** | Fastify, Bun runtime |
| **Auth** | Supabase Auth + JWT (Access + Refresh tokens) |
| **Authorization** | Role-Based Access Control (RBAC) |
| **Database** | PostgreSQL (Supabase) |
| **Caching** | Redis |
| **Dev Tools** | Git/GitHub, Postman, VS Code, Excalidraw |

***

## User Roles

LearnSphere has four active operator roles. Each user logs in with a single email and password and switches between their active identities (a teacher can also be a parent — same credentials, different dashboards).

```
Admin → Full system control. The only role that can create users.
Teacher → Academic management. Marks attendance, records results, manages courses.
Staff → Self-service portal. Applies for leave, views attendance.
Parent → Read-only monitoring. Tracks their child's progress, results, attendance.
```

***

## Features by Role

### 🔐 Authentication (All Roles)
- Email + password login via Supabase Auth
- JWT access tokens (15 min) + refresh tokens (7 days)
- Multi-identity support — one user, multiple roles (e.g., Teacher + Parent)
- Role selection on login if user has more than one identity
- Session persistence with silent token refresh
- Secure logout (clears tokens, ends session)

***

### 🛡️ Admin

The Admin has complete, unrestricted control over the platform. There is one Admin per deployment (the school principal or designated administrator).

#### User & Enrollment Management
- Enroll new students (creates student record, assigns class/section)
- Register new teachers with employee ID, qualification, joining date, subject specialization
- Register new staff members with department and designation
- Register new parents and link them to one or more students
- Assign roles to users (a teacher can also be registered as a parent)
- Deactivate or reactivate any user account
- View complete user directory with filters by role, class, section, status

#### Academic Structure Management
- Create and manage classes (Class 1 through Class 10)
- Create and manage sections (A, B, C) within each class
- Set up academic years (e.g., 2025–26)
- Create class-section combinations per academic year
- Add and manage subjects with name and subject code
- Assign teachers to subjects within specific class sections
- Build and manage timetables per class section

#### Leave Oversight
- View all pending leave applications from teachers and staff
- Approve or reject leave with optional review comments
- View leave history and leave balance summaries for all staff
- Configure leave types (Sick Leave, Casual Leave, Earned Leave) and their annual limits

#### Exam & Result Management
- Create exam records (Unit Test, Mid-Term, Final, Practical, Assignment)
- Set max marks and passing marks per exam
- Oversee result publishing across all classes and subjects
- View school-wide academic performance reports

#### Announcements
- Create school-wide announcements visible to all roles
- Target announcements to specific roles (teachers only, parents only, etc.)
- Set publish date and expiry for announcements
- Deactivate or delete outdated announcements

#### Reports & Analytics
- Enrollment summary (total students, class-wise distribution)
- Attendance summary (school-wide, class-wise, individual)
- Leave report (approved, pending, rejected per staff member)
- Academic performance overview per class/subject
- Teacher workload distribution

#### Meetings
- Schedule parent-teacher meetings (online, with meeting link)
- Assign meetings to a class section
- Add teachers and parents as attendees
- View meeting status (scheduled, completed, cancelled)

***

### 📚 Teacher

Teachers manage academic operations for their assigned class sections and subjects.

#### Dashboard
- Overview of assigned classes and subjects
- Today's timetable
- Pending tasks (attendance not yet marked, results not yet entered)
- Recent announcements

#### Class & Student Management
- View all class sections assigned to them
- View the student roster for each assigned class section
- View individual student profiles (name, roll number, photo, parent contact)

#### Attendance
- Mark daily attendance for students in assigned class sections (Present / Absent / Late / Half Day)
- Edit attendance for the current day before cutoff
- View attendance history for any student in their class
- View attendance summary (monthly, weekly) per class section

#### Exam Results
- Enter marks for exams created by admin (within assigned subjects)
- Add grade and remarks per student per exam
- Publish results when ready (notifies parents automatically)
- View result history per student and per exam

#### Leave Application
- Apply for leave by selecting type, date range, and reason
- View leave application status (Pending / Approved / Rejected)
- View remaining leave balance per leave type
- Cancel pending leave applications

#### Announcements
- View all announcements targeted to teachers or all roles

#### Meetings
- View scheduled parent-teacher meetings they are assigned to
- Access meeting link when meeting is active
- Mark meeting as completed

#### Notifications
- Real-time notifications for: leave approval/rejection, new announcements, upcoming meetings

***

### 🧑‍💼 Staff

Staff members (non-teaching employees) have a focused self-service portal.

#### Dashboard
- Today's attendance status
- Leave balance summary
- Recent announcements

#### Attendance
- View personal attendance history (daily, monthly)
- Filter attendance by date range
- View check-in/check-out times

#### Leave Application
- Apply for leave with type, dates, and reason
- Track status of all submitted applications (Pending / Approved / Rejected)
- View remaining leave balance per leave type
- Cancel pending applications

#### Profile
- View personal profile (name, department, designation, joining date)
- View emergency contact information on record

#### Announcements
- View all announcements targeted to staff or all roles

#### Notifications
- Notifications for: leave status updates, new announcements

***

### 👨‍👩‍👧 Parent

Parents have a read-only monitoring dashboard focused entirely on their child's academic life. Parents do not create or modify any data.

#### Dashboard
- Quick overview of child's current class and section
- Attendance percentage for the current month
- Latest results published
- Upcoming parent-teacher meetings
- Unread announcements

#### Child Progress Monitoring
- If a parent has multiple children enrolled, they can switch between child profiles
- View overall academic standing per semester/term

#### Attendance
- View child's daily attendance history
- Monthly attendance summary with percentage
- Visual highlight of absent days
- Low-attendance alert if attendance drops below threshold (e.g., below 75%)

#### Results
- View results for all published exams, subject-wise
- Marks obtained, max marks, grade, and teacher remarks per exam
- Historical results across all academic terms

#### Meetings
- View scheduled parent-teacher meetings they are invited to
- Access meeting link when the meeting goes live
- View past meeting history

#### Announcements
- View all announcements targeted to parents or all roles

#### Notifications
- Notifications for: new result published, attendance alert, meeting scheduled, new announcements

***

## Data Model Highlights

- **Multi-identity RBAC** — A single `users` record (linked to Supabase Auth) can have multiple `identity` rows, each with a distinct role. This lets one person be both a teacher and a parent without duplicate accounts.
- **Students are records, not users** — Students are managed as data entities (enrollment, attendance, results). They do not log into the platform.
- **Academic year scoping** — Classes, sections, assignments, and results are scoped to an `academic_year` string (e.g., `"2025-26"`), supporting year-over-year data isolation.
- **Normalized relational schema** — All entities are properly normalized (3NF), with foreign key constraints, composite unique keys, and strategic indexes on frequently queried fields.

***

## Security

- All API endpoints protected with JWT authentication middleware
- Every endpoint declares required roles — unauthorized roles receive `403 Forbidden`
- Ownership validation ensures users only access their own data (a parent can only view their own child's records)
- Passwords hashed with bcrypt before storage
- Environment-based configuration (dev / staging / production) with secrets manager
- Protection against XSS, SQL Injection, BOLA, and BFLA
- Feature flags for toggling features across environments at runtime
- Graceful shutdown via SIGTERM/SIGINT signal handling

***

## Project Roadmap

| Phase | Timeline | Scope |
|---|---|---|
| **Training & Design** | Jan–Mar 2026 | Technical training, system design, database schema, API contracts |
| **Core Development** | Mar–Apr 2026 | Project setup, auth system, Admin module, Staff module, Teacher module |
| **Feature Development** | May–Jun 2026 | Parent module, notification system, cross-module integration, API testing |
| **Testing & Delivery** | Jul 2026 | End-to-end testing, performance optimization, deployment, handover |

***

## Local Setup (Coming Soon)

> Full setup documentation will be added once the development phase begins (March–April 2026).

```bash
# Clone the repository
git clone https://github.com/riyanshverma/learnsphere.git

# Install dependencies (Bun)
bun install

# Set up environment variables
cp .env.example .env

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

***

## Organization

**The Learners Academy**
Panchyawala, Jaipur, Rajasthan — Affiliated with RBSE Board
Established 1993 · Motto: *"Be Honest, Be Brave"*

**Internship Project** · Practice School II (PS1102)
**Developer:** Riyansh Verma (2022BTech089)
**Institution:** JK Lakshmipat University, Jaipur
**Duration:** January – July 2026

***

*LearnSphere is an internship project developed as part of Practice School II at JK Lakshmipat University, Jaipur.*
Cookie Policy
This website uses third-party cookies to serve you relevant ads and provide personalisation.