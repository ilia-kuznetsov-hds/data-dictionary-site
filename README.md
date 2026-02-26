# Interactive Data Dictionary (Prototype)

![ANZNN logo](./assets/2026-02%20anznn%20logo%20nano%20banana.png)


**Live Demo:** [Coming soon](https://example.com)

### Project Description

This project explores a more usable way to work with data dictionaries.

In many organisations, data dictionaries live in static PDFs or Word documents. They’re hard to search, slow to navigate, and disconnected from how data is actually used in reports and analysis. This prototype demonstrates an alternative: a web-first, interactive data dictionary designed for exploration. 

The interface is inspired by Notion-style documentation, with an emphasis on clean typography, generous spacing, and multiple navigation paths. Users can browse fields by section, search directly, or move between dictionary definitions in sidebar. The goal of this project is to reduce cognitive load in navigation patterns inspired by modern documentation tools like Notion.

The project is delivered as a fully working prototype (no login required) and is intended for data stewards, analysts, and hiring managers who need to understand complex datasets quickly. All content was programmatically extracted from an official ANZNN data dictionary source and transformed into a structured, navigable web experience.

<p align="left"> <img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" width="22" /> <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" width="22" /> <img src="https://cdn.simpleicons.org/vite/646CFF" alt="Vite" width="22" /> <img src="https://cdn.simpleicons.org/javascript/F7DF1E" alt="JavaScript" width="22" /> </p>

- **Python**: parses the official ANZNN data dictionary into structured data.
- **React + Vite**: delivers the interactive, searchable web prototype.
- **JavaScript**: handles UI behavior and dictionary-to-report navigation.

### Feature Scope

Users can search and browse the data dictionary in one place, open field-level details (definitions and context), navigate relationships between data elements, and jump directly from dictionary entries to related reports to understand downstream usage. The prototype is fully accessible without login, so teams can use it quickly for onboarding, validation, and day-to-day documentation lookup.


### Repo Map

```text
data-dictionary-site/
├─ extract.py                        # Parse ANZNN 2026 PDF -> structured JSON + MDX
├─ link_report.py                    # Build field_id -> 2023 report page links
├─ ANZNN_2026_Data_Dictionary.pdf    # Source data dictionary
├─ Report ... 2023 ... .pdf          # Source annual report for cross-linking
├─ content/                          # Generated field docs (.mdx, ~245 files)
├─ data/
│  ├─ fields.json                    # Field metadata used by the app
│  └─ sections.json                  # Section/appendix navigation model
├─ assets/                           # Logos and static project images
└─ site/                             # React + Vite frontend
   ├─ package.json                   # Frontend scripts and dependencies
   ├─ public/
   │  └─ report_links.json           # Generated report cross-links
   └─ src/
      ├─ App.jsx                     # App shell, routes, sidebar logic
      ├─ HomePage.jsx / FieldPage.jsx / SectionGalleryPage.jsx / ReportsPage.jsx
      ├─ CohortBuilderPage.jsx
      ├─ cohort-builder/             # Cohort builder components + controls/
      ├─ main.jsx                    # React bootstrap
      ├─ index.css / cohort-builder.css
      └─ fieldDirectoryUtils.js
