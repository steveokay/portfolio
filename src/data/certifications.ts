import type { Cert } from '../components/sections/Certifications.astro';

/**
 * Cloud certifications shown on the homepage.
 *
 * One file, one purpose. To add a cert: append an object below, save.
 * Empty array → the entire "Cloud & certifications" section is hidden
 * (per CLAUDE.md: real data only, no stubs in production).
 *
 * Required: provider, title, earned ('YYYY-MM').
 * Optional: expires ('YYYY-MM') → past today flips the badge to 'expired'.
 *           url → makes the whole card a verification link (Credly etc.).
 *
 * Provider options: 'aws' | 'gcp' | 'azure' | 'hashicorp' | 'cncf' | 'cka' | 'other'
 *
 * TODO(steve): replace placeholder entries below with real certifications.
 */
export const certifications: Cert[] = [
  {
    provider: 'aws',
    title: 'Solutions Architect — Professional',
    earned: '2022-04',
    expires: '2025-04',
    // url: 'https://www.credly.com/...',
  },
  {
    provider: 'aws',
    title: 'DevOps Engineer — Professional',
    earned: '2023-02',
    expires: '2026-02',
  },
  {
    provider: 'hashicorp',
    title: 'Terraform Associate',
    earned: '2023-08',
    expires: '2025-08',
  },
  {
    provider: 'cka',
    title: 'CKA — Certified Kubernetes Administrator',
    earned: '2024-01',
    expires: '2027-01',
  },
];
