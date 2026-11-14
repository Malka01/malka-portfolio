'use client';


import '../../../public/medicare360.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Users,
  Activity,
  FlaskConical,
  Pill,
  ReceiptText,
  BarChart3,
  Building2,
  UserCog,
  Clock,
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Users,
    title: 'Patient Management',
    desc: 'Central patient records, appointment history, and clinical notes.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Management',
    desc: 'Specialty, branch, schedule, and consultation fee management.',
  },
  {
    icon: Calendar,
    title: 'Online Booking',
    desc: 'Patients search doctors and book appointment slots in real time.',
  },
  {
    icon: Clock,
    title: 'Appointment Workflow',
    desc: 'Pending → Confirmed → Checked-in → In-progress → Completed.',
  },
  {
    icon: Activity,
    title: 'Reception & Queue',
    desc: 'Daily queue numbers and live consultation status for staff.',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory Module',
    desc: 'Lab request tracking with dummy results for demonstration.',
  },
  {
    icon: Pill,
    title: 'Pharmacy Inventory',
    desc: 'Medicine stock, expiry warnings, and low-stock alerts.',
  },
  {
    icon: ReceiptText,
    title: 'Billing & Invoices',
    desc: 'Printable invoices for consultations, lab, and pharmacy items.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    desc: 'Appointment trends, revenue, and branch performance reports.',
  },
  {
    icon: Building2,
    title: 'Multi-Branch',
    desc: 'Manage Colombo, Kandy, Galle, and Negombo branches in one system.',
  },
  {
    icon: UserCog,
    title: 'Role-Based Access',
    desc: 'Seven roles from super admin to pharmacist — each with correct scope.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit & Security',
    desc: 'JWT auth, hashed passwords, audit logs, and rate limiting.',
  },
];

const ROLES = [
  { name: 'Super Admin', tone: 'role-super' },
  { name: 'Admin', tone: 'role-admin' },
  { name: 'Doctor', tone: 'role-doctor' },
  { name: 'Receptionist', tone: 'role-reception' },
  { name: 'Patient', tone: 'role-patient' },
  { name: 'Pharmacist', tone: 'role-pharma' },
  { name: 'Lab Staff', tone: 'role-lab' },
];

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'General Medicine',
];

export default function MediCare360Page() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/medicare360/health')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setHealth(data);
      })
      .catch(() => {
        if (!cancelled) setHealthError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mc360-page">
      {/* ─── Top bar ─── */}
      <header className="mc360-topbar">
        <div className="mc360-container mc360-topbar-inner">
          <Link href="/medicare360" className="mc360-logo">
            <span className="mc360-logo-mark">
              <Stethoscope size={18} strokeWidth={2.4} />
            </span>
            <span className="mc360-logo-text">
              MediCare<strong>360</strong>
            </span>
          </Link>

          <nav className="mc360-nav">
            <Link href="/">Portfolio</Link>
            <Link href="/medicare360#features">Features</Link>
            <Link href="/medicare360#roles">Roles</Link>
            <Link href="/medicare360#status">Status</Link>
          </nav>

          <div className="mc360-topbar-actions">
            <Link href="/medicare360#status" className="mc360-status-pill">
              <span className="mc360-status-dot" />
              {health ? 'API online' : healthError ? 'API offline' : 'Checking…'}
            </Link>
          </div>
        </div>
        <div className="mc360-topbar-actions">
  <Link href="/medicare360#status" className="mc360-status-pill">
    <span className="mc360-status-dot" />
    {health ? 'API online' : healthError ? 'API offline' : 'Checking…'}
  </Link>
  <Link href="/medicare360/login" className="mc360-btn mc360-btn-primary">
    Sign in
  </Link>
</div>
      </header>

      {/* ─── Hero ─── */}
      <section className="mc360-hero">
        <div className="mc360-container">
          <div className="mc360-hero-badge">
            <AlertCircle size={14} />
            Demo · Portfolio Project
          </div>
          <Link href="/medicare360/login" className="mc360-btn mc360-btn-ghost">
            Sign in to demo
            </Link>

          <h1 className="mc360-hero-title">
            Healthcare Management &<br />
            <em>Digital Appointment Platform</em>
          </h1>

          <p className="mc360-hero-sub">
            A portfolio demonstration of a modern healthcare digital
            platform — patient management, doctor portals, online booking,
            reception queue, pharmacy, laboratory, and analytics.
          </p>

          <div className="mc360-hero-actions">
            <Link href="/medicare360#booking" className="mc360-btn mc360-btn-primary">
              Book an Appointment
              <ArrowRight size={16} />
            </Link>
            <Link href="/medicare360#features" className="mc360-btn mc360-btn-ghost">
              Explore Platform
            </Link>
          </div>

          <div className="mc360-hero-meta">
            <div className="mc360-hero-meta-item">
              <ShieldCheck size={16} />
              JWT + RBAC architecture
            </div>
            <div className="mc360-hero-meta-item">
              <FlaskConical size={16} />
              MongoDB + Mongoose (Phase 2)
            </div>
            <div className="mc360-hero-meta-item">
              <Users size={16} />
              7 user roles
            </div>
          </div>
        </div>
      </section>

      {/* ─── Search preview (visual only in Phase 1) ─── */}
      <section id="booking" className="mc360-search">
        <div className="mc360-container">
          <div className="mc360-search-card">
            <div className="mc360-search-head">
              <Search size={18} />
              <h2>Find a Doctor</h2>
              <p>Search by specialty, branch, or availability.</p>
            </div>

            <div className="mc360-search-grid">
              <div className="mc360-search-field">
                <label>Specialty</label>
                <div className="mc360-search-fake">
                  <span>Select specialty…</span>
                </div>
              </div>

              <div className="mc360-search-field">
                <label>Branch</label>
                <div className="mc360-search-fake">
                  <MapPin size={14} />
                  <span>All branches</span>
                </div>
              </div>

              <div className="mc360-search-field">
                <label>Date</label>
                <div className="mc360-search-fake">
                  <Calendar size={14} />
                  <span>Any day</span>
                </div>
              </div>

              <button className="mc360-btn mc360-btn-primary mc360-search-btn" disabled>
                Search
              </button>
            </div>

            <p className="mc360-search-note">
              Interactive booking is implemented in Phase 5 — this is a visual preview.
            </p>

            <div className="mc360-specialties">
              {SPECIALTIES.map((s) => (
                <span key={s} className="mc360-specialty-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="mc360-features">
        <div className="mc360-container">
          <div className="mc360-section-head">
            <span className="mc360-eyebrow">Platform Features</span>
            <h2 className="mc360-heading">
              Everything a modern healthcare platform needs
            </h2>
            <p className="mc360-section-sub">
              Twelve integrated modules covering the full operational
              lifecycle of a multi-branch healthcare organisation.
            </p>
          </div>

          <div className="mc360-features-grid">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title} className="mc360-feature-card">
                  <div className="mc360-feature-icon">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Roles ─── */}
      <section id="roles" className="mc360-roles">
        <div className="mc360-container">
          <div className="mc360-section-head">
            <span className="mc360-eyebrow">Role-Based Access</span>
            <h2 className="mc360-heading">Seven roles. Seven experiences.</h2>
            <p className="mc360-section-sub">
              Each role sees only what it needs — from super admin to lab
              staff. Enforced at the API and UI layers.
            </p>
          </div>

          <div className="mc360-roles-grid">
            {ROLES.map((r) => (
              <div key={r.name} className={`mc360-role-chip ${r.tone}`}>
                <span className="mc360-role-dot" />
                {r.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Status / backend health ─── */}
      <section id="status" className="mc360-status">
        <div className="mc360-container">
          <div className="mc360-section-head">
            <span className="mc360-eyebrow">Backend Status</span>
            <h2 className="mc360-heading">Live API health check</h2>
            <p className="mc360-section-sub">
              This page fetches live status from the demo backend. As each
              phase ships, more services report as online.
            </p>
          </div>

          <div className="mc360-status-grid">
            <div className="mc360-status-card">
              <div className="mc360-status-card-head">
                <span className="mc360-status-label">API</span>
                <span className="mc360-status-state online">
                  {health?.services?.api === 'online' ? 'online' : 'unknown'}
                </span>
              </div>
              <div className="mc360-status-url">
                GET /api/medicare360/health
              </div>
            </div>

            <div className="mc360-status-card">
              <div className="mc360-status-card-head">
                <span className="mc360-status-label">Database</span>
                <span className="mc360-status-state pending">
                  {health?.services?.database === 'connected'
                    ? 'connected'
                    : 'phase 2'}
                </span>
              </div>
              <div className="mc360-status-url">MongoDB · Mongoose</div>
            </div>

            <div className="mc360-status-card">
              <div className="mc360-status-card-head">
                <span className="mc360-status-label">Authentication</span>
                <span className="mc360-status-state pending">
                  {health?.services?.auth === 'configured'
                    ? 'configured'
                    : 'phase 2'}
                </span>
              </div>
              <div className="mc360-status-url">JWT · bcrypt · RBAC</div>
            </div>
            <div className="mc360-status-card">
  <div className="mc360-status-card-head">
    <span className="mc360-status-label">Database</span>
    <span className={`mc360-status-state ${
      health?.services?.database === 'connected' ? 'online' : 'pending'
    }`}>
      {health?.services?.database === 'connected' ? 'connected' : 'not connected'}
    </span>
  </div>
  <div className="mc360-status-url">MongoDB · Mongoose</div>
</div>

<div className="mc360-status-card">
  <div className="mc360-status-card-head">
    <span className="mc360-status-label">Authentication</span>
    <span className={`mc360-status-state ${
      health?.services?.auth === 'configured' ? 'online' : 'pending'
    }`}>
      {health?.services?.auth === 'configured' ? 'configured' : 'not configured'}
    </span>
  </div>
  <div className="mc360-status-url">JWT · bcrypt · RBAC</div>
</div>
          </div>

          {health && (
            <div className="mc360-status-raw">
              <div className="mc360-status-raw-head">
                <span>Raw response</span>
                <span>v{health.version} · phase {health.phase}</span>
              </div>
              <pre>{JSON.stringify(health, null, 2)}</pre>
            </div>
          )}

          {healthError && (
            <div className="mc360-status-error">
              Could not reach the API. Check that the dev server is running.
            </div>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="mc360-footer">
        <div className="mc360-container mc360-footer-inner">
          <div>
            <strong>MediCare360</strong> — Demo portfolio project.
          </div>
          <div className="mc360-footer-note">
            Not affiliated with any real hospital or healthcare provider.
          </div>
        </div>
      </footer>
    </div>
  );
}