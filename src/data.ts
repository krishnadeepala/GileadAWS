export type Phase =
  | "Readiness"
  | "Preparation"
  | "Prep Scheduled"
  | "Conduct"
  | "Post-Conduct"
  | "Closed";

export const LIFECYCLE: Phase[] = [
  "Readiness",
  "Preparation",
  "Prep Scheduled",
  "Conduct",
  "Post-Conduct",
  "Closed",
];

export type Status =
  | "Draft"
  | "On Track"
  | "At Risk"
  | "In Progress"
  | "Awaiting Response"
  | "Closed";

export type Role =
  | "Super User"
  | "Inspection Lead"
  | "SME"
  | "Inspection Sponsor"
  | "Leadership";

export interface Person {
  name: string;
  role: string;
  email: string;
}

export interface Task {
  id: string;
  description: string;
  owner: string;
  due: string;
  status: "Not Started" | "In Progress" | "Complete" | "Blocked";
}

export interface Checklist {
  category: string;
  tasks: Task[];
}

export interface Inspection {
  id: string;
  name: string;
  region: string;
  country: string;
  site: string;
  type: string;
  phase: Phase;
  status: Status;
  date: string; // inspection date ISO
  updated: string;
  lead: string;
  sponsor: string;
  daysToInspection: number;
  scope: string;
  agency: string;
  gvault: { field: string; value: string }[];
  smes: Person[];
  support: Person[];
  related: { id: string; name: string; relation: string }[];
  checklists: Checklist[];
  audit: { when: string; who: string; action: string }[];
  scribe: { time: string; author: string; note: string }[];
  chat: { time: string; author: string; message: string }[];
}

const p = (name: string, role: string): Person => ({
  name,
  role,
  email: name.toLowerCase().replace(/[^a-z]+/g, ".") + "@gilead.com",
});

const baseChecklists: Checklist[] = [
  {
    category: "Inspection Plan",
    tasks: [
      { id: "IP-001", description: "Confirm inspection scope & objectives", owner: "M. Alvarez", due: "2026-08-24", status: "Complete" },
      { id: "IP-002", description: "Establish front room / back room roles", owner: "M. Alvarez", due: "2026-08-28", status: "In Progress" },
      { id: "IP-003", description: "Draft inspection logistics plan", owner: "R. Kaur", due: "2026-09-02", status: "Not Started" },
    ],
  },
  {
    category: "Agency Request",
    tasks: [
      { id: "AR-014", description: "Log initial agency document request", owner: "T. Osei", due: "2026-08-22", status: "Complete" },
      { id: "AR-015", description: "Assign SME responses to requests", owner: "T. Osei", due: "2026-08-26", status: "In Progress" },
      { id: "AR-016", description: "QC responses before submission", owner: "L. Berg", due: "2026-08-30", status: "Blocked" },
    ],
  },
  {
    category: "Standard Document Checklist",
    tasks: [
      { id: "SD-101", description: "Site master file current & approved", owner: "R. Kaur", due: "2026-08-20", status: "Complete" },
      { id: "SD-102", description: "Quality manual version confirmed", owner: "R. Kaur", due: "2026-08-21", status: "Complete" },
      { id: "SD-103", description: "Training records compiled", owner: "D. Nguyen", due: "2026-08-27", status: "In Progress" },
    ],
  },
  {
    category: "Pre-Inspection Document Request",
    tasks: [
      { id: "PR-207", description: "Prepare organizational charts", owner: "D. Nguyen", due: "2026-08-25", status: "In Progress" },
      { id: "PR-208", description: "Assemble batch record samples", owner: "L. Berg", due: "2026-08-29", status: "Not Started" },
    ],
  },
];

function makeInspection(o: Partial<Inspection> & Pick<Inspection, "id" | "name" | "phase" | "status" | "date" | "daysToInspection">): Inspection {
  return {
    region: "EMEA",
    country: "Ireland",
    site: "Cork Manufacturing",
    type: "Pre-Approval (PAI)",
    updated: "2026-08-18",
    lead: "Maria Alvarez",
    sponsor: "Jonathan Pryce",
    scope: "Full commercial manufacturing & quality systems review across sterile fill-finish operations.",
    agency: "EMA",
    gvault: [
      { field: "Product", value: "Vekluryde 100mg" },
      { field: "Application No.", value: "EU/1/26/1842" },
      { field: "Manufacturing License", value: "MIA-IE-0091" },
      { field: "GxP Classification", value: "GMP" },
    ],
    smes: [p("Rani Kaur", "Quality Assurance"), p("David Nguyen", "Manufacturing"), p("Lena Berg", "Regulatory Affairs"), p("Tomas Osei", "Validation")],
    support: [p("Priya Shah", "Logistics"), p("Carlos Mendez", "IT / Documents")],
    related: [
      { id: "INS-2024-0455", name: "Cork Sterile Line Follow-up", relation: "Predecessor" },
      { id: "INS-2026-0231", name: "Dublin QC Lab Routine GMP", relation: "Same site network" },
    ],
    checklists: baseChecklists,
    audit: [
      { when: "2026-08-18 14:22", who: "Maria Alvarez", action: "Updated inspection phase to Prep Scheduled" },
      { when: "2026-08-16 09:10", who: "Rani Kaur", action: "Added SME assignment to Agency Request checklist" },
      { when: "2026-08-12 16:48", who: "System", action: "Synced 4 fields from G Vault" },
      { when: "2026-08-10 11:03", who: "Maria Alvarez", action: "Created inspection record" },
    ],
    scribe: [
      { time: "09:05", author: "Lena Berg", note: "Opening meeting commenced. Agency introduced two inspectors; scope confirmed as filed." },
      { time: "09:42", author: "Lena Berg", note: "Inspector requested batch record for lot VK-2261. Assigned to D. Nguyen as action." },
      { time: "10:15", author: "Rani Kaur", note: "Discussion on environmental monitoring trends — no observations raised." },
    ],
    chat: [
      { time: "08:58", author: "Maria Alvarez", message: "Back room team, we are live. Route all document requests through the scribe log." },
      { time: "09:44", author: "David Nguyen", message: "Pulling batch record VK-2261 now, ETA 10 minutes." },
      { time: "09:51", author: "Priya Shah", message: "Meeting room B reserved for the afternoon session." },
    ],
    ...o,
  };
}

export const inspections: Inspection[] = [
  makeInspection({ id: "INS-2026-0148", name: "Cork Sterile Fill-Finish PAI", phase: "Prep Scheduled", status: "On Track", date: "2026-09-18", daysToInspection: 30, region: "EMEA", country: "Ireland", site: "Cork Manufacturing", type: "Pre-Approval (PAI)", lead: "Maria Alvarez", updated: "2026-08-18" }),
  makeInspection({ id: "INS-2026-0151", name: "Foster City API Routine GMP", phase: "Preparation", status: "At Risk", date: "2026-10-06", daysToInspection: 48, region: "AMERICAS", country: "United States", site: "Foster City API", type: "Routine GMP", lead: "Grace Lee", sponsor: "Alan Whitfield", agency: "FDA", updated: "2026-08-17" }),
  makeInspection({ id: "INS-2026-0139", name: "Singapore Packaging Pre-Approval", phase: "Readiness", status: "On Track", date: "2026-11-12", daysToInspection: 85, region: "APAC", country: "Singapore", site: "Tuas Packaging", type: "Pre-Approval (PAI)", lead: "Wei Chen", sponsor: "Jonathan Pryce", agency: "HSA", updated: "2026-08-15" }),
  makeInspection({ id: "INS-2026-0122", name: "Dublin QC Lab GMP Surveillance", phase: "Conduct", status: "In Progress", date: "2026-08-19", daysToInspection: 0, region: "EMEA", country: "Ireland", site: "Dublin QC Lab", type: "Surveillance", lead: "Sean Murphy", agency: "HPRA", updated: "2026-08-19" }),
  makeInspection({ id: "INS-2026-0110", name: "La Verne Oral Solids For-Cause", phase: "Post-Conduct", status: "Awaiting Response", date: "2026-07-28", daysToInspection: -22, region: "AMERICAS", country: "United States", site: "La Verne", type: "For-Cause", lead: "Grace Lee", agency: "FDA", updated: "2026-08-14" }),
  makeInspection({ id: "INS-2026-0098", name: "Toronto Distribution GDP Audit", phase: "Preparation", status: "On Track", date: "2026-09-30", daysToInspection: 42, region: "AMERICAS", country: "Canada", site: "Toronto DC", type: "GDP", lead: "Isabelle Roy", agency: "Health Canada", updated: "2026-08-13" }),
  makeInspection({ id: "INS-2026-0087", name: "Seoul Biologics Pre-Approval", phase: "Readiness", status: "On Track", date: "2026-12-02", daysToInspection: 105, region: "APAC", country: "South Korea", site: "Seoul Biologics", type: "Pre-Approval (PAI)", lead: "Wei Chen", agency: "MFDS", updated: "2026-08-12" }),
  makeInspection({ id: "INS-2026-0074", name: "Milan Warehouse GDP Routine", phase: "Prep Scheduled", status: "On Track", date: "2026-09-08", daysToInspection: 20, region: "EMEA", country: "Italy", site: "Milan DC", type: "GDP", lead: "Marco Bianchi", agency: "AIFA", updated: "2026-08-11" }),
  makeInspection({ id: "INS-2026-0061", name: "Osaka Sterile Line Surveillance", phase: "Preparation", status: "At Risk", date: "2026-10-20", daysToInspection: 62, region: "APAC", country: "Japan", site: "Osaka Sterile", type: "Surveillance", lead: "Yuki Tanaka", agency: "PMDA", updated: "2026-08-09" }),
  makeInspection({ id: "INS-2026-0055", name: "Cork QC Lab Routine GMP", phase: "Conduct", status: "In Progress", date: "2026-08-19", daysToInspection: 0, region: "EMEA", country: "Ireland", site: "Cork Manufacturing", type: "Routine GMP", lead: "Maria Alvarez", agency: "HPRA", updated: "2026-08-19" }),
  makeInspection({ id: "INS-2026-0041", name: "Raleigh API Pre-Approval", phase: "Readiness", status: "On Track", date: "2026-11-25", daysToInspection: 98, region: "AMERICAS", country: "United States", site: "Raleigh API", type: "Pre-Approval (PAI)", lead: "Grace Lee", agency: "FDA", updated: "2026-08-08" }),
  makeInspection({ id: "INS-2025-0912", name: "Cork Warehouse GDP (2025)", phase: "Closed", status: "Closed", date: "2025-11-14", daysToInspection: -279, region: "EMEA", country: "Ireland", site: "Cork Manufacturing", type: "GDP", lead: "Maria Alvarez", agency: "HPRA", updated: "2025-12-02" }),
  makeInspection({ id: "INS-2025-0844", name: "Foster City Biologics PAI (2025)", phase: "Closed", status: "Closed", date: "2025-09-03", daysToInspection: -351, region: "AMERICAS", country: "United States", site: "Foster City API", type: "Pre-Approval (PAI)", lead: "Grace Lee", agency: "FDA", updated: "2025-10-01" }),
];

export const REGIONS = ["EMEA", "AMERICAS", "APAC"];
export const COUNTRIES = [...new Set(inspections.map((i) => i.country))].sort();
export const SITES = [...new Set(inspections.map((i) => i.site))].sort();
export const TYPES = [...new Set(inspections.map((i) => i.type))].sort();

export const kappas = [
  { id: "K-2026-0031", finding: "EM data trend not investigated within SOP timeframe", severity: "Major", owner: "Rani Kaur", due: "2026-09-05", status: "Open" },
  { id: "K-2026-0032", finding: "Cleaning validation report missing final QA signature", severity: "Minor", owner: "David Nguyen", due: "2026-09-12", status: "In Progress" },
  { id: "K-2026-0033", finding: "Training matrix not reflecting revised SOP-QA-114", severity: "Minor", owner: "Lena Berg", due: "2026-08-30", status: "Open" },
];
