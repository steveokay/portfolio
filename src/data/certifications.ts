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
 */
export const certifications: Cert[] = [
  // TODO(steve): drop in your AWS Certified Cloud Practitioner once you have
  // the `earned` date (YYYY-MM). Example template — uncomment and fill in:
  //
  // {
  //   provider: 'aws',
  //   title: 'Cloud Practitioner',
  //   earned: '2024-XX',                            // ← required
  //   // expires: '2027-XX',                        // optional
  //   // url: 'https://www.credly.com/badges/...',  // optional
  // },
];
