#!/usr/bin/env python3
"""
extract.py — Convert ANZNN_2026_Data_Dictionary.pdf into structured data.

Two stages:
  Stage 1: PDF → raw page objects (section, field title, raw text per page)
  Stage 2: Page objects → field records → output files (MDX + JSON)

Usage: python extract.py
"""

import json
import logging
import os
import re
import pdfplumber

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

PDF_PATH = "ANZNN_2026_Data_Dictionary.pdf"
FIRST_CONTENT_PAGE = 16          # 1-indexed; pages before this are front matter
OUTPUT_CONTENT_DIR = "content"
OUTPUT_DATA_DIR = "data"

KNOWN_KEYS = [
    "ANZNN label",
    "Admin status",
    "Version number",
    "Metadata type",
    "Data element type",            # appears on page 16 variant
    "Definition",
    "Context",
    "Data type",
    "Datatype",                     # alternate spelling seen in PDF
    "Field size",
    "Format",
    "Data domain",
    "Verification rules",
    "Guide for use",
    "Related metadata",
    "Source organisation",
    "Source documents",             # plural variant
    "Source document",              # singular variant seen in some pages
    "Comments",
]

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def extract_text_lines(page):
    """Return a list of {'y', 'x0', 'text'} dicts — one per visual line."""
    chars = page.chars
    if not chars:
        return []

    # Group characters into lines by vertical position (tolerance 2pt)
    buckets = {}
    tolerance = 2.0
    for ch in chars:
        y = ch["top"]
        matched = None
        for by in buckets:
            if abs(y - by) <= tolerance:
                matched = by
                break
        if matched is not None:
            buckets[matched].append(ch)
        else:
            buckets[y] = [ch]

    lines = []
    for y in sorted(buckets):
        row = sorted(buckets[y], key=lambda c: c["x0"])
        text = "".join(c["text"] for c in row).strip()
        if text:
            x0 = min(c["x0"] for c in row)
            lines.append({"y": y, "x0": x0, "text": text})
    return lines


def detect_section(lines):
    """Return the section header string or None.

    Section header sits at y ≈ 25.3. For normal pages it's on the left
    (x0 ≈ 56) or right (x0 ≥ 400), but appendix pages may centre it.
    Accept any x0 for text at the right y-position.
    """
    for line in lines:
        if 20 <= line["y"] <= 32:
            return line["text"]
    return None


def detect_field_title(lines):
    """Return (is_new_field, field_title) for the page.

    A new field starts when there is an ALL-CAPS line at y ≈ 67, x0 ≈ 56.
    Multi-line titles continue onto y ≈ 85 with the same x0 and caps.
    """
    title_parts = []
    for line in lines:
        if 62 <= line["y"] <= 90 and 50 <= line["x0"] <= 65:
            text = line["text"]
            # ALL-CAPS check — ignore very short fragments
            if text.isupper() and len(text) > 2:
                title_parts.append(text)

    if title_parts:
        return True, " ".join(title_parts)
    return False, None


# ---------------------------------------------------------------------------
# Stage 1 — PDF → raw page objects
# ---------------------------------------------------------------------------

def stage1_extract_pages(pdf_path):
    """Read every content page and return a list of page-object dicts."""
    pages = []

    with pdfplumber.open(pdf_path) as pdf:
        total = len(pdf.pages)
        log.info("PDF has %d pages; content starts at page %d", total, FIRST_CONTENT_PAGE)

        for idx in range(FIRST_CONTENT_PAGE - 1, total):
            page = pdf.pages[idx]
            page_num = idx + 1

            lines = extract_text_lines(page)
            if not lines:
                log.warning("Page %d: no text found, skipping", page_num)
                continue

            section = detect_section(lines)
            is_new_field, field_title = detect_field_title(lines)
            raw_text = page.extract_text() or ""

            pages.append({
                "page_num": page_num,
                "section": section,
                "is_new_field": is_new_field,
                "field_title": field_title,
                "raw_text": raw_text,
            })

    log.info("Stage 1 complete: %d content pages extracted", len(pages))
    return pages


# ---------------------------------------------------------------------------
# Stage 2 helpers
# ---------------------------------------------------------------------------

# Normalised key names — maps PDF variants to canonical names
KEY_ALIASES = {
    "Datatype": "Data type",
    "Data element type": "Metadata type",
    "Source document": "Source documents",   # normalise singular → plural
}

# Ordered list of canonical keys (used for parsing and display)
CANONICAL_KEYS = [
    "ANZNN label",
    "Admin status",
    "Version number",
    "Metadata type",
    "Definition",
    "Context",
    "Data type",
    "Field size",
    "Format",
    "Data domain",
    "Verification rules",
    "Guide for use",
    "Related metadata",
    "Source organisation",
    "Source documents",
    "Comments",
]

# Regex for coded data-domain lines: number or uppercase code, then label
DATA_DOMAIN_RE = re.compile(r"^(-?\d+|[A-Z]+)\s+(.+)")


def make_field_id(title):
    """Turn a field title into a URL-friendly slug.

    Example: 'PRESENTING ANTENATAL PROBLEM' → 'presenting-antenatal-problem'
    """
    slug = title.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def group_pages_into_chunks(pages):
    """Group consecutive pages into field chunks.

    A new chunk starts whenever is_new_field is True.
    Continuation pages are appended to the current chunk.
    """
    chunks = []
    current = None

    for page in pages:
        if page["is_new_field"]:
            if current is not None:
                chunks.append(current)
            current = {
                "field_title": page["field_title"],
                "section": page["section"],
                "source_page": page["page_num"],
                "pages": [page],
            }
        else:
            if current is None:
                log.warning(
                    "Page %d is continuation but no field started yet, skipping",
                    page["page_num"],
                )
                continue
            current["pages"].append(page)

    if current is not None:
        chunks.append(current)

    return chunks


def parse_key_value_text(raw_text):
    """Parse key: value pairs from the raw text of a field (possibly multi-page).

    Returns a dict keyed by canonical key name.  Multi-line values are joined.
    """
    attrs = {}
    current_key = None
    current_lines = []

    for line in raw_text.split("\n"):
        stripped = line.strip()
        if not stripped:
            continue

        # Try to match a known key at the start of the line
        matched_key = None
        for key in KNOWN_KEYS:
            if stripped.startswith(key + ":"):
                matched_key = key
                break

        if matched_key:
            # Save previous key
            if current_key:
                canonical = KEY_ALIASES.get(current_key, current_key)
                attrs[canonical] = " ".join(current_lines).strip()

            current_key = matched_key
            value_part = stripped[len(matched_key) + 1 :].strip()
            current_lines = [value_part] if value_part else []
        else:
            # Continuation of current value
            if current_key:
                current_lines.append(stripped)

    # Save last key
    if current_key:
        canonical = KEY_ALIASES.get(current_key, current_key)
        attrs[canonical] = " ".join(current_lines).strip()

    return attrs


def parse_data_domain(raw_text):
    """Extract the Data domain section and parse coded values.

    Returns a list of {code, label} dicts.  Non-matching lines are kept
    as free-text entries with code = None.
    """
    # Find the Data domain section within the raw text
    lines = raw_text.split("\n")
    in_domain = False
    domain_lines = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        if stripped.startswith("Data domain:"):
            in_domain = True
            after = stripped[len("Data domain:"):].strip()
            if after:
                domain_lines.append(after)
            continue

        if in_domain:
            # Stop at the next known key
            is_next_key = False
            for key in KNOWN_KEYS:
                if stripped.startswith(key + ":") and key != "Data domain":
                    is_next_key = True
                    break
            if is_next_key:
                break
            domain_lines.append(stripped)

    # Parse each line — continuation lines (no leading code) are appended
    # to the previous entry's label.
    result = []
    for dl in domain_lines:
        m = DATA_DOMAIN_RE.match(dl)
        if m:
            code_str = m.group(1)
            label_str = m.group(2).strip()

            # Heuristic: if previous entry's label ends mid-sentence
            # (e.g. ends with a preposition, conjunction, or no period)
            # and the current "code" is a number that doesn't look like a
            # real data code, treat this as a continuation.
            if result and result[-1]["code"] is not None:
                prev_label = result[-1]["label"]
                # Previous label ends with a word suggesting continuation
                trailing = prev_label.rstrip().split()[-1].lower() if prev_label.strip() else ""
                mid_sentence_markers = {
                    "from", "the", "a", "an", "and", "or", "of", "to",
                    "in", "at", "by", "for", "with", "is", "are", "was",
                }
                if trailing in mid_sentence_markers:
                    result[-1]["label"] += " " + dl.strip()
                    continue

            result.append({"code": code_str, "label": label_str})
        else:
            # Could be a continuation of the previous coded entry,
            # or a free-text domain entry.
            if result and result[-1]["code"] is not None:
                # Append to previous entry's label
                result[-1]["label"] += " " + dl.strip()
            else:
                # Free-text domain entry (e.g. "Valid establishment code.")
                if dl.strip():
                    result.append({"code": None, "label": dl.strip()})

    return result


def parse_data_domain_from_combined(combined_text):
    """Like parse_data_domain but works on already-combined multi-page text."""
    return parse_data_domain(combined_text)


# ---------------------------------------------------------------------------
# Normalise sections
# ---------------------------------------------------------------------------

# Some section names have variants across pages; map to canonical form.
SECTION_NORMALISATIONS = {
    "Appendix A: Minor congenital malformations": "Appendix A: Minor congenital anomalies",
}


def normalise_section(name):
    """Return canonical section name."""
    if name is None:
        return None
    return SECTION_NORMALISATIONS.get(name, name)


# ---------------------------------------------------------------------------
# Stage 2 — page objects → field records → output files
# ---------------------------------------------------------------------------

def stage2_build_fields(pages):
    """Group pages into fields, parse attributes, and write output files."""

    # --- 2a. Group pages into chunks ---
    chunks = group_pages_into_chunks(pages)
    log.info("Grouped into %d field chunks", len(chunks))

    # --- 2b. Parse each chunk into a field record ---
    fields = {}         # field_id → record
    sections_ordered = []  # ordered unique section list

    for chunk in chunks:
        title = chunk["field_title"]
        if not title:
            log.warning("Chunk starting at page %d has no title, skipping", chunk["source_page"])
            continue

        field_id = make_field_id(title)
        if not field_id:
            log.warning("Could not generate field_id for '%s', skipping", title)
            continue

        # Handle duplicate field_ids (shouldn't happen, but be safe)
        if field_id in fields:
            log.warning("Duplicate field_id '%s' at page %d (first was page %d)",
                        field_id, chunk["source_page"], fields[field_id]["source_page"])
            field_id = f"{field_id}-{chunk['source_page']}"

        # Combine raw text from all pages in this chunk
        combined_text = "\n".join(p["raw_text"] for p in chunk["pages"])

        # Remove the section header line and field title from the text
        # (they're metadata, not body content)
        clean_lines = []
        for line in combined_text.split("\n"):
            stripped = line.strip()
            # Skip section header lines and the field title itself
            if stripped == title:
                continue
            # Skip page footers like "ANZNN 2026 Data Dictionary   123"
            if re.match(r"^ANZNN\s+\d{4}\s+Data Dictionary\s+\d+$", stripped):
                continue
            clean_lines.append(line)
        combined_text = "\n".join(clean_lines)

        # Parse attributes
        attrs = parse_key_value_text(combined_text)

        # Parse data domain specially (from the combined text, not attrs value)
        data_domain = parse_data_domain_from_combined(combined_text)

        # Normalise section
        section = normalise_section(chunk["section"])
        if section and section not in sections_ordered:
            sections_ordered.append(section)

        # Build the field record
        record = {
            "field_id": field_id,
            "label": title.title(),  # "MATERNAL AGE" → "Maternal Age"
            "section": section or "Unknown",
            "source_page": chunk["source_page"],
        }

        # Copy parsed attributes into the record
        for key in CANONICAL_KEYS:
            if key in attrs and key != "Data domain":
                record[key.lower().replace(" ", "_")] = attrs[key]

        # Add data domain as structured data
        if data_domain:
            record["data_domain"] = data_domain
        elif "Data domain" in attrs:
            # Fallback: just the raw text if no coded values parsed
            record["data_domain_text"] = attrs["Data domain"]

        fields[field_id] = record

    log.info("Parsed %d fields across %d sections", len(fields), len(sections_ordered))

    # --- 2c. Write output files ---
    write_outputs(fields, sections_ordered)

    return fields, sections_ordered


# ---------------------------------------------------------------------------
# Output writers
# ---------------------------------------------------------------------------

def write_outputs(fields, sections_ordered):
    """Write content/*.mdx, data/fields.json, and data/sections.json."""

    os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

    # --- fields.json ---
    fields_path = os.path.join(OUTPUT_DATA_DIR, "fields.json")
    with open(fields_path, "w", encoding="utf-8") as f:
        json.dump(fields, f, indent=2, ensure_ascii=False)
    log.info("Wrote %s (%d fields)", fields_path, len(fields))

    # --- sections.json ---
    # Filter out appendix sections for the main navigation
    main_sections = []
    appendix_sections = []
    for s in sections_ordered:
        if s.lower().startswith("appendix"):
            appendix_sections.append(s)
        else:
            main_sections.append(s)

    sections_data = {
        "sections": [
            {"id": make_field_id(s), "label": s}
            for s in main_sections
        ],
        "appendices": [
            {"id": make_field_id(s), "label": s}
            for s in appendix_sections
        ],
    }
    sections_path = os.path.join(OUTPUT_DATA_DIR, "sections.json")
    with open(sections_path, "w", encoding="utf-8") as f:
        json.dump(sections_data, f, indent=2, ensure_ascii=False)
    log.info("Wrote %s (%d sections + %d appendices)",
             sections_path, len(main_sections), len(appendix_sections))

    # --- MDX files ---
    mdx_count = 0
    for field_id, record in fields.items():
        mdx_path = os.path.join(OUTPUT_CONTENT_DIR, f"{field_id}.mdx")
        mdx_content = render_mdx(record)
        with open(mdx_path, "w", encoding="utf-8") as f:
            f.write(mdx_content)
        mdx_count += 1

    log.info("Wrote %d .mdx files to %s/", mdx_count, OUTPUT_CONTENT_DIR)


def render_mdx(record):
    """Render a single field record as an MDX file with YAML frontmatter."""
    lines = []

    # --- YAML frontmatter ---
    lines.append("---")
    lines.append(f"field_id: {record['field_id']}")
    lines.append(f"label: \"{record['label']}\"")
    lines.append(f"section: \"{record['section']}\"")
    if "metadata_type" in record:
        lines.append(f"type: \"{record['metadata_type']}\"")
    lines.append(f"source_page: {record['source_page']}")
    lines.append("---")
    lines.append("")

    # --- Body sections (only render if data exists) ---

    # Definition
    if "definition" in record:
        lines.append("## Definition")
        lines.append("")
        lines.append(record["definition"])
        lines.append("")

    # Context
    if "context" in record:
        lines.append("## Context")
        lines.append("")
        lines.append(record["context"])
        lines.append("")

    # Data Type & Format
    dtype_parts = []
    if "data_type" in record:
        dtype_parts.append(f"**Data type:** {record['data_type']}")
    if "field_size" in record:
        dtype_parts.append(f"**Field size:** {record['field_size']}")
    if "format" in record:
        dtype_parts.append(f"**Format:** {record['format']}")
    if dtype_parts:
        lines.append("## Data Type & Format")
        lines.append("")
        for part in dtype_parts:
            lines.append(part)
            lines.append("")

    # Data Domain
    if "data_domain" in record:
        lines.append("## Data Domain")
        lines.append("")
        lines.append("| Code | Meaning |")
        lines.append("|------|---------|")
        for entry in record["data_domain"]:
            code = entry["code"] if entry["code"] is not None else "—"
            label = entry["label"]
            lines.append(f"| {code} | {label} |")
        lines.append("")
    elif "data_domain_text" in record:
        lines.append("## Data Domain")
        lines.append("")
        lines.append(record["data_domain_text"])
        lines.append("")

    # Guide for Use
    if "guide_for_use" in record:
        lines.append("## Guide for Use")
        lines.append("")
        lines.append(record["guide_for_use"])
        lines.append("")

    # Verification Rules
    if "verification_rules" in record:
        lines.append("## Verification Rules")
        lines.append("")
        lines.append(record["verification_rules"])
        lines.append("")

    # Related Metadata
    if "related_metadata" in record:
        lines.append("## Related Metadata")
        lines.append("")
        lines.append(record["related_metadata"])
        lines.append("")

    # Source Documents
    if "source_documents" in record:
        lines.append("## Source Documents")
        lines.append("")
        lines.append(record["source_documents"])
        lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    pages = stage1_extract_pages(PDF_PATH)

    # Stage 1 summary
    new_fields = [p for p in pages if p["is_new_field"]]
    continuations = [p for p in pages if not p["is_new_field"]]
    log.info("Stage 1: %d pages (%d new fields, %d continuations)",
             len(pages), len(new_fields), len(continuations))

    # Stage 2
    fields, sections = stage2_build_fields(pages)

    # Final summary
    domain_count = sum(1 for f in fields.values() if "data_domain" in f)
    print(f"\n{'='*50}")
    print(f"Extraction Complete")
    print(f"{'='*50}")
    print(f"Fields extracted  : {len(fields)}")
    print(f"Sections          : {len(sections)}")
    print(f"Fields with coded data domains: {domain_count}")
    print(f"Output: {OUTPUT_DATA_DIR}/fields.json, {OUTPUT_DATA_DIR}/sections.json")
    print(f"Output: {OUTPUT_CONTENT_DIR}/*.mdx ({len(fields)} files)")


if __name__ == "__main__":
    main()
