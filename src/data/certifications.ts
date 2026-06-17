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
    earned: '2022-01',
    expires: '2025-01',
    url: 'https://www.credly.com/badges/3677c024-4cd0-42fd-9b75-7f62228745e0',
  },
];
