#!/usr/bin/env python3
"""
Build a field_id -> report page mapping for the ANZNN 2023 annual report.

Usage:
  python link_report.py
"""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

import pdfplumber

REPORT_PDF = Path("Report of the Australian and New Zealand Neonatal Network 2023 excl follow-up.pdf")
OUTPUT = Path("site/public/report_links.json")

# pdfplumber uses 0-indexed pages internally. This range scans report body pages.
SCAN_START = 15
SCAN_END = 75

SECTION_FONT_MIN = 13.5
SECTION_FONT_MAX = 17.5

# Maps report section headings -> one or more field IDs in data/fields.json.
REPORT_SECTION_TO_FIELD_IDS = {
    "Maternal age": ["maternal-age"],
    "Previous antenatal history": ["previous-preterm-birth", "previous-perinatal-death"],
    "Assisted conception": ["assisted-conception-in-this-pregnancy"],
    "Presenting antenatal problem": ["presenting-antenatal-problem"],
    "Antenatal corticosteroid use": ["antenatal-corticosteroids-for-fetal-lung-enhancement"],
    "Magnesium sulphate": [
        "magnesium-sulphate-given-to-mother-within-24-hours-of-birth",
        "magnesium-sulphate-given-to-mother-within-6-hours-of-birth-superseded",
    ],
    "Multiple gestation": ["birth-plurality"],
    "Method of birth": ["method-of-birth"],
    "Place of birth": ["place-of-birth"],
    "Sex of baby": ["sex"],
    "Resuscitation in delivery suite": ["rescuscitation-at-time-of-cord-clamping"],
    "Apgar score at birth": ["apgar-score-at-1-minute", "apgar-score-at-5-minutes"],
    "Admission temperature": ["temperature-on-admission"],
    "Exogenous surfactant": ["exogenous-surfactant"],
    "Type of assisted ventilation": [
        "nasal-cpap",
        "nasal-non-invasive-ventilation",
        "nasal-high-flow",
        "ongoing-mechanical-ventilation",
        "high-frequency-oscillatory-ventilation-hfov",
    ],
    "Respiratory support": [
        "respiratory-support-at-36-weeks-post-menstrual-age",
        "home-oxygen-therapy",
    ],
    "Parenteral nutrition": ["parenteral-nutrition"],
    "Chronic lung disease": ["postnatal-steroids-for-chronic-lung-disease"],
    "Pulmonary air leak": ["air-leak-requiring-drainage"],
    "Neonatal sepsis": ["bacterial-fungal-or-viral-infection-present", "central-line-placed"],
    "Retinopathy of prematurity": [
        "retinopathy-of-prematurity",
        "plus-disease-in-retinopathy-of-prematurity",
        "surgical-therapy-for-retinopathy-of-prematurity",
        "medical-vegf-inhibition-therapy-for-retinopathy-of-prematurity",
    ],
    "Intraventricular haemorrhage": [
        "maximum-grade-of-left-sided-periventricular-haemorrhage",
        "maximum-grade-of-right-sided-periventricular-haemorrhage",
    ],
    "Late cerebral ultrasound": ["cerebral-cysts-left", "cerebral-cysts-right"],
    "Therapeutic hypothermia": [
        "therapeutic-hypothermia",
        "lowest-temperature-recorded-in-first-78-hours",
    ],
    "Necrotising enterocolitis": ["proven-necrotising-enterocolitis"],
    "Neonatal surgery": ["neonatal-major-surgery"],
    "Congenital anomalies": ["presence-of-congenital-anomaly"],
    "Survival": ["died"],
    "Breastfeeding at discharge": [
        "breast-milk-feeding-at-discharge",
        "type-of-milk-feeding-at-discharge",
    ],
    "Transport after birth to a level III NICU": ["source-of-referral-to-registration-hospital"],
}


def find_section_pages(pdf_path: Path) -> dict[str, int]:
    """
    Return heading_text -> first report page number where heading appears.

    We group words by line (top coordinate) so pages with several headings
    (e.g. Maternal age + Previous antenatal history + Assisted conception)
    are captured as distinct headings.
    """
    found: dict[str, int] = {}

    with pdfplumber.open(str(pdf_path)) as pdf:
        for page_idx in range(SCAN_START, min(SCAN_END, len(pdf.pages))):
            page = pdf.pages[page_idx]
            words = page.extract_words(extra_attrs=["size", "fontname"])

            by_line: dict[float, list[tuple[float, str]]] = defaultdict(list)
            for word in words:
                size = float(word.get("size", 0))
                font_name = str(word.get("fontname", ""))
                if not (SECTION_FONT_MIN <= size < SECTION_FONT_MAX):
                    continue
                if "Bold" not in font_name:
                    continue

                top = round(float(word.get("top", 0)), 1)
                x0 = float(word.get("x0", 0))
                by_line[top].append((x0, word["text"]))

            for top in sorted(by_line):
                heading = " ".join(text for _, text in sorted(by_line[top])).strip()
                if heading and heading not in found:
                    found[heading] = page_idx + 1

    return found


def build_links(section_pages: dict[str, int]) -> dict[str, int]:
    """Map field IDs to report page numbers using curated heading mapping."""
    links: dict[str, int] = {}

    for heading, field_ids in REPORT_SECTION_TO_FIELD_IDS.items():
        page = section_pages.get(heading)
        if page is None:
            print(f"WARNING: heading not found in PDF: '{heading}'")
            continue
        for field_id in field_ids:
            links[field_id] = page

    return links


def main() -> None:
    if not REPORT_PDF.exists():
        raise FileNotFoundError(f"Report PDF not found: {REPORT_PDF}")

    section_pages = find_section_pages(REPORT_PDF)
    links = build_links(section_pages)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(links, f, indent=2, sort_keys=True)

    print(f"Wrote {OUTPUT} ({len(links)} field links)")


if __name__ == "__main__":
    main()
