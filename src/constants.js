export const GITHUB_URL = 'https://github.com/dood1ebyte/stateguard';
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const CHANGELOG_URL = `${GITHUB_URL}/blob/main/CHANGELOG.md`;
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;
export const DOCS_PATH = '/docs';
export const SUGGEST_PATH = '/suggest';

/* The suggestion form is a Google Form, embedded on /suggest. `embedded=true`
   drops Google's page chrome (but not the form's own title, which is why that
   title is kept short upstream).

   Cross-origin means the iframe can never report its content height, so this is
   measured rather than computed. Measured heights for the current 5 questions:

     iframe ≥768px wide → 1211px   (the form maxes its own content at 640px)
     iframe 520–700px   → 1231px
     iframe 325–400px   → 1271px   (questions wrap, so it grows)

   Google's own suggested height was 1141, which is short at every width and
   produces an inner scrollbar. Taking the tallest case means up to 60px of unused
   white at the bottom on desktop — invisible inside a white card, and far better
   than a nested scroll area on a page that already scrolls.

   Re-measure if questions are added or removed. */
export const SUGGEST_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSf-Bs_hC7trxPATPgjE9OYcYUmtjvK8oC43SEYG_cm6596WIA/viewform';
export const SUGGEST_FORM_EMBED_URL = `${SUGGEST_FORM_URL}?embedded=true`;
export const SUGGEST_FORM_HEIGHT = 1271;
