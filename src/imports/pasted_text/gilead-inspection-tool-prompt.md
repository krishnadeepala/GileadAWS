Yes. I would make the Figma Make prompt **structured and explicit about the scope, personas, lifecycle, responsive behavior, and what should NOT be invented**. Since the BA specifically asked for a simple UI, the prompt should also prevent Figma Make from turning this into an overloaded enterprise dashboard.

Here is the refined prompt you can directly paste into **Figma Make**:

---

## Figma Make Prompt — Gilead Inspection Tool

Create a complete responsive UX/UI flow for a **Gilead Inspection Tool** based strictly on the approved BRD, workshop discussions, and requirements provided.

The solution will be developed as a **React-based AWS frontend**, so design the screens as a practical production-ready web application that can be implemented in React. **Do not design it like Power Apps or a traditional SharePoint application.**

### 1. Overall Design Direction

Create a **clean, simple, enterprise-grade inspection management application** for Gilead.

The primary UX principle is:

> **Show users only the information they need for their role and the current inspection stage. Avoid information overload.**

Use a modern, spacious interface with clear hierarchy, strong readability, consistent spacing, compact tables, meaningful status indicators, and minimal decorative elements.

Do not introduce unnecessary dashboards, charts, statistics, cards, navigation items, or widgets unless they are explicitly supported by the requirements.

---

### 2. Gilead Visual Style Guide

Follow the previously provided Gilead style guide consistently across **all screens and components**.

Primary colors:

* **Gilead Red:** `#C50F3C`
* **White:** `#FFFFFF`
* **Black:** `#1E1E1E`
* **Gilead Gray:** `#54565B`
* **Stone:** `#C6CAC6`

Use Gilead Red primarily for:

* Primary CTAs
* Important actions
* Selected states
* Key Gilead branding

Do **not** use Gilead Red as a generic negative/error color.

Use appropriate neutral/semantic colors for:

* Success
* Warning
* Error
* Informational states

Maintain the same typography, font weight, border treatment, spacing, buttons, inputs, dropdowns, tables, badges and interaction patterns throughout the application.

---

# 3. Application Personas

Design the solution around the personas identified in the requirements:

### Super User

* Central inspection team
* Can create and manage inspection records
* Can edit metadata
* Can manage inspection lifecycle
* Can manage SMEs and inspection-related information
* Has visibility of all inspection records

### Inspection Management Group

* Can add/update inspection metadata
* Access depends on assigned permissions

### Inspection Lead

* Assigned to an inspection
* Can access assigned inspection
* Can manage SMEs/tasks and inspection preparation
* Can edit permitted metadata

### SME

* Subject Matter Expert
* Should only see inspections/tasks to which they are assigned
* Receives task-related notifications
* Works primarily on assigned checklist/task items

### Inspection Sponsor

* Associated with an inspection
* Primarily read-only access
* Can view relevant inspection information

### Leadership

* Primarily view-only
* Needs high-level inspection visibility and reporting/dashboard access

### Front Room / Back Room Users

Treat Front Room and Back Room as **working contexts/features**, not separate personas unless explicitly required by the BRD.

### Scribing

Scribe is a **feature**, not a persona.

---

# 4. Inspection Lifecycle

The complete application should clearly represent the inspection lifecycle:

**Readiness → Preparation → Prep Scheduled → Conduct → Post-Conduct → Closed**

The current lifecycle stage must always be clearly visible when the user enters an inspection record.

Use a clear lifecycle/progress component in the **Inspection View / Inspection Detail** experience.

---

# 5. Required Application Flow

Create the complete flow, including the following major screens.

## A. Super User Dashboard / Inspection Portfolio

Create a simple dashboard containing:

### Header

* Gilead branding
* Inspection Tool / Inspection Command Center
* Global search
* Notifications
* Logged-in user
* User role such as "Super User"

### Primary actions

* Create Inspection
* Manage Templates
* Reports & Dashboards

### Upcoming Scheduled Inspections

Add a **very compact horizontal information strip** above the filters:

**Upcoming Scheduled Inspections**

* Next 30 Days — number
* Next 60 Days — number
* Next 90 Days — number
* View All

Do not use a large calendar widget or large cards.

### Inspection Portfolio Table

Use a clean tabular layout with:

* Inspection ID
* Inspection Name
* Country / Site
* Inspection Type
* Phase
* Status
* Inspection Date
* Lead
* Last Updated
* Actions

Actions should include:

* View
* Edit

### Filters

Provide:

* Region
* Country
* Inspection Type
* Phase
* Status
* Site
* Search
* Additional Filters where required

Support pagination with:

**10 rows per page**

Do not add unnecessary KPI cards such as:

* Total inspections
* At-risk counts
* Readiness percentages
* Progress charts
* "Needs Your Attention"

Keep the dashboard focused on the inspection table.

---

# 6. Upcoming Scheduled Inspections — View All

When the user clicks **View All**, create a dedicated screen showing upcoming inspections.

Allow filtering by:

* Date range
* Region
* Country
* Inspection Type
* Site
* Phase
* Lead

Provide a clear tabular view and allow the user to open the relevant inspection record.

---

# 7. Create Inspection

Create a complete Create Inspection flow.

Include only fields supported by the BRD/requirements.

Organize information logically rather than displaying one extremely long form.

Consider sections such as:

### Basic Inspection Information

* Inspection type
* Inspection name/reference
* Country
* Site/location
* Relevant inspection metadata

### Inspection Team

* Inspection Lead
* Support Team
* SMEs where applicable
* Sponsors

### Inspection Schedule

* Relevant inspection dates
* Other required scheduling information

### Additional Metadata

Include the remaining approved inspection metadata.

Clearly distinguish:

**System-entered / user-editable fields**

from

**G Vault-sourced fields**

Do not invent additional business fields that are not supported by the requirements.

Provide:

* Save
* Cancel
* Create Inspection

---

# 8. Edit Inspection

Create an Edit Inspection screen based on the same inspection information structure.

Clearly distinguish:

### Editable information

Fields that the user can modify.

### G Vault information

Fields received from G Vault must be:

* Read-only
* Clearly labelled as G Vault sourced
* Visually differentiated from editable fields

Include areas for:

* Inspection metadata
* Inspection Lead
* SMEs
* Sponsors
* Support Team
* Inspection-related information
* Related inspections
* Inspection lifecycle
* Supporting information

Do not allow users to edit G Vault-controlled information.

---

# 9. View Inspection

Create a comprehensive but clean Inspection Detail / View screen.

At the top show:

### Inspection Header

* Inspection ID
* Inspection Name
* Inspection Type
* Site / Country
* Inspection Lead
* Inspection Date
* Current Status

### Lifecycle

Clearly show:

**Readiness → Preparation → Prep Scheduled → Conduct → Post-Conduct → Closed**

Highlight the current stage.

For Prep Scheduled, provide an appropriate countdown such as:

**30 days to inspection**

When the inspection reaches the inspection date, provide:

**Move to In Progress**

where applicable.

---

# 10. Inspection Detail Sections

Within the View Inspection experience, organize information into logical sections.

Include:

### Inspection Information

General inspection metadata.

### G Vault

G Vault-sourced information.

Clearly indicate:

**Read Only — From G Vault**

### SMEs

Show SMEs assigned to relevant inspection tasks.

### Related Inspections

Show related inspection records where applicable.

### Inspection Lifecycle

Show lifecycle progress and stage information.

### Supporting Information

Provide relevant inspection supporting information.

### Checklists / Tasks

Provide a clear checklist navigation structure.

Known checklist categories include:

* Inspection Plan
* Agency Request
* Standard Document Checklist
* Pre-Inspection Document Request

Additional checklist categories may exist, so design the component to scale to approximately 10–15 categories.

Each checklist should support a structured task table containing information such as:

* Task / Checklist ID
* Description
* Owner / SME
* Status

The exact fields should follow the BRD.

---

# 11. Documents / Folder Structure

Provide access to the inspection's generated folder/document structure where applicable.

Documents should be connected to:

* Inspection
* Checklist
* Task
* Request

Do not create a generic document-management module unrelated to an inspection.

---

# 12. Scribe

Scribe is an inspection-level feature.

It should be accessible **inside the relevant inspection record**, not as a primary application navigation item.

Create a Scribe experience that supports:

* Real-time inspection notes
* Multiple scribes where required
* Date/time context
* Notes associated with the inspection
* Relevant tasks/actions created from the notes

Respect the requirement that inspection sessions are manually documented and not recorded.

---

# 13. Chat

Do not create Chat as a standalone primary navigation item.

Chat should be contextual to the inspection.

Within an inspection record, provide access to relevant inspection communication where required.

The UI should make it clear:

**Which inspection / team / context the conversation belongs to.**

---

# 14. Daily Debrief

Provide Daily Debrief within the inspection context.

Support the concept of:

* Daily inspection summary
* Scribe notes
* Tasks/actions created during the day
* Summary communication

The system should support the requirement for an automatically generated daily summary email.

---

# 15. Post-Conduct / Corrective Actions

Support the Post-Conduct stage.

Show relevant corrective actions / findings (**Kappas**) received from G Vault.

Clearly indicate that:

**Kappas are managed in G Vault and this system reads the information; it does not write back to G Vault.**

---

# 16. Audit Trail

Audit Trail should be available **inside the inspection record**, not as a primary dashboard navigation item.

Show relevant inspection history such as:

* Lifecycle changes
* Metadata changes
* User/action
* Date/time
* Relevant activity

Keep it concise and easy to scan.

---

# 17. Archive

Provide an Archive experience based on inspection records that have reached the Closed state.

Allow Super Users to locate closed/archived inspections using:

* Inspection ID
* Inspection name
* Site
* Country
* Inspection type
* Date
* Other relevant filters

---

# 18. Role-Based Experience

Do not create completely different applications for every persona.

Instead, use the **same core inspection experience with role-based visibility and permissions**.

For example:

### Super User

Sees all inspections.

### Inspection Lead

Sees inspections where they are assigned/access is granted.

### SME

Sees relevant assigned inspections/tasks.

### Sponsor

Primarily read-only inspection access.

### Leadership

Primarily view/reporting-oriented access.

Clearly demonstrate these differences through the UI where appropriate.

---

# 19. Navigation

Keep the application navigation **minimal**.

Do NOT create a large left-side navigation containing:

* Tasks
* Chat
* Scribe
* Risks & Issues
* Documents
* Daily Debrief
* Commitments
* Lessons Learned
* Audit Trail

These are primarily **inspection-contextual features** and should appear inside the relevant inspection record where required.

The dashboard should remain focused on the Inspection Portfolio.

---

# 20. Responsive Design

Design the application for:

### Desktop

Primary design resolution:

**1920px width × auto height**

### Tablet / iPad

Provide responsive layouts for tablet and iPad widths.

### Smaller screens

Ensure:

* Tables become horizontally scrollable or adapt appropriately
* Filters reorganize into responsive layouts
* Buttons remain accessible
* Forms become single-column where required
* Cards/sections stack appropriately
* No content is clipped
* Typography remains readable

The desktop 1920px version should be the **primary design reference**, while tablet/iPad layouts should be responsive adaptations of the same design system.

---

# 21. Interaction / Prototype Expectations

Create realistic prototype interactions for the major flows:

**Dashboard → Create Inspection → Save/Create → Inspection Record**

**Dashboard → View → Inspection Detail**

**Dashboard → Edit → Edit Inspection → Save**

**Dashboard → Upcoming Scheduled Inspections → View All → Inspection**

**Inspection → Lifecycle → Checklist → Task**

**Inspection → SMEs**

**Inspection → G Vault**

**Inspection → Scribe**

**Inspection → Chat**

**Inspection → Supporting Information**

**Inspection → Audit Trail**

Use appropriate hover, focus, selected, disabled, validation and success states.

---

# 22. Important UX Constraints

Keep the overall solution:

* Simple
* Clean
* Enterprise-grade
* Role-based
* Inspection-centric
* Metadata-aware
* Scalable
* React implementation-friendly

**Do not overload screens with information.**

**Do not invent unsupported functionality.**

**Do not create unnecessary dashboard widgets.**

**Do not create unnecessary left navigation.**

**Do not make every feature a separate application-level module.**

Whenever information belongs to a specific inspection, keep it **contextual to that inspection record**.

---

# 23. Deliverable

Create a complete clickable prototype covering the major personas and end-to-end inspection lifecycle.

Organize the Figma file into clear sections:

1. **Design System**
2. **Super User**
3. **Inspection Lead**
4. **SME**
5. **Inspection Sponsor**
6. **Leadership**
7. **Inspection Lifecycle**
8. **Responsive – Tablet / iPad**

Ensure all screens use the **same Gilead design language and reusable components**.

The final output should look like a **real production-ready React enterprise application**, not a conceptual wireframe or Power Apps interface.

---

### One important addition I recommend

When you paste this into Figma Make, **attach the BRD and the latest approved reference mockups/style-guide images as reference material**. Tell Figma Make:

> **“Treat the attached BRD and reference designs as the source of truth. Where information is not explicitly defined, do not invent business requirements; use a neutral UX pattern and flag the area as requiring BA confirmation.”**

That last instruction is particularly important for your project because you are still getting clarification from the BA. It will prevent Figma Make from **inventing fields, workflows, widgets or functionality** that could later deviate from the approved requirement.
