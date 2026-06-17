import type { Cert } from '../components/sections/Certifications.astro';

/**
 * Cloud certifications shown on the homepage.
 *
 * One file, one purpose. To add a cert: append an object below, save.
 * Empty array → the entire "Cloud & certifications" section is hidden
 * (per CLAUDE.md: real data only, no stubs in production).
 *
 * Required: provider, title, earned ('YYYY' or 'YYYY-MM').
 * Optional: expires ('YYYY' or 'YYYY-MM') → past today flips the badge.
 *           url → makes the whole card a verification link (Credly etc.).
 *
 * Provider options: 'aws' | 'gcp' | 'azure' | 'hashicorp' | 'cncf' | 'cka' | 'other'
 */
export const certifications: Cert[] = [
  {
    provider: 'aws',
    title: 'Cloud Practitioner',
    // CONFIRM(steve): the CV cites 'AWS Certified Cloud Practitioner' but
    // doesn't include a specific month. '2024' is a year-only placeholder
    // based on your AWS-employment window. Drop in the actual month if you
    // have it (e.g. '2024-03') and the badge will tighten up; same for the
    // expires field if your real cert window differs.
    earned: '2024',
    expires: '2027',
    // url: 'https://www.credly.com/badges/...',  // add when you have the Credly link
  },
];
