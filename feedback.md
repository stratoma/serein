# Serein website feedback

## Feedback 1: Product-page copy and content system

**Status: Implemented and verified in source**

Applied the requested Serein voice across the shared product content and the collection, product-detail, and discovery-set pages.

- Reframed descriptions around sensory specificity, restrained editorial language, and considered small-batch care.
- Updated product stories, texture notes, use guidance, image captions, collection language, and cart confirmations.
- Kept the $22 product pricing intact while improving the surrounding value language; no overt luxury claims or unsupported product claims were added.
- Standardized brand references in changed copy as `Serein`.

**Verification:** `corepack pnpm@10.11.1 --filter @workspace/serein run typecheck` and the production Vite build both passed on 2026-09-18. The build retains the existing large-chunk advisory only.

## Feedback 2: Product-page content system and scent territories

**Status: In progress. Sections 1 and 2 are complete and verified, except for confirmed size data.**

The source brief has been organized into the following implementation order. Each item is intentionally self-contained and will be marked in progress, verified, or blocked here as we work through it.

- [x] **1. Content-model foundation** *(complete and verified)*
  - Expand the shared product data to support `product_sensory_intro`, size, fragrance description and notes, ritual scene/instructions/closing, featured ingredients, full ingredients, details, and the internal emotional territory.
  - Add global controlled content for `brand_name = "Serein"` and the craftsmanship statement.
  - Define the four scent territories: M+M, Supple Oud, Lithe Bloom, and future Restore.

- [x] **2. Above-the-fold purchase module** *(complete and verified; size display awaits source data)*
  - Reorder the individual product page to: product name, sensory introduction, price, size, and Add to Cart.
  - Keep secondary storytelling below the primary purchase action.
  - Present price clearly and without promotional framing.

- [ ] **3. The Scent section**
  - Replace the generic scent-notes treatment with `The Scent`.
  - Render a concise fragrance composition that moves through the notes, followed by concise notes.
  - Use top, heart, and base groups only when reliable structured data is available.

- [ ] **4. Scent-specific composition copy**
  - Write and review M+M, Supple Oud, and Lithe Bloom against their assigned emotional territories.
  - Add Restore's lavender-and-amber direction to the content model for its future product page, without creating or merchandising an unavailable product.

- [ ] **5. The Ritual section**
  - Replace generic use guidance with `The Ritual`.
  - Render each scent's scene, application instruction, and closing feeling.
  - Ensure each ritual is specific to its fragrance rather than a reusable body-care template.

- [ ] **6. Craftsmanship module**
  - Add a restrained `Made with Intention` section from the approved global statement.
  - Avoid rustic-maker language and avoid repeating “small batch” throughout a page.

- [ ] **7. Ingredient hierarchy**
  - Add `Inside the Formula` with three to five understandable hero ingredients and restrained, factual formulation roles.
  - Place the complete INCI disclosure in a quieter `Full Ingredients` section below it.

- [ ] **8. Details and product claims**
  - Add a restrained `Details` section for only factual, approved claims.
  - Limit claims to four or five; do not introduce unsupported badges or “clean,” medical, or chemical-free claims.

- [ ] **9. Product-page narrative order and related products**
  - Arrange pages as desire, experience, understanding, then proof: purchase module, scent, ritual, formula, ingredients, craftsmanship, details, and related products.
  - Review Morrow Trio and collection links for consistency with this sequence.

- [ ] **10. Brand-name and microcopy consistency**
  - Audit `SEREIN` code and copy references; retain all caps only as a deliberate editorial treatment.
  - Standardize the site-wide purchase CTA to one phrase and align unavailable, scent, size, and quantity labels.

- [ ] **11. Editorial cleanup**
  - Audit customer-facing marketing copy for em dashes, prohibited generic-luxury phrases, unsupported claims, and repetitive AI-like phrasing.
  - Revise only the affected language, preserving factual product information and the existing visual design.

- [ ] **12. QA, validation, and feedback closeout**
  - Run typecheck and production build.
  - Verify desktop and mobile product-page order, purchase action visibility, and content rendering for each current scent.
  - Complete the final product-page test from the brief and record verification or any remaining blockers here.

**Next section:** 3. The Scent section.

**Known data boundary:** Product sizes, full INCI ingredient disclosures, and substantiated details/claims were not present in the existing source. Their fields are intentionally `null` or empty until confirmed, rather than being invented.

**Section 1 verification:** Typecheck and production Vite build passed on 2026-09-18. The build retains the existing large JavaScript chunk advisory.

**Section 2 verification:** The product hero now presents product name, sensory introduction, price, and Add to Cart before secondary storytelling. No verified product volume exists in the repository, so the size line will render once that source data is supplied. Typecheck and production build passed on 2026-09-18.
