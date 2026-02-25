function slugifySectionLabel(label) {
  const slug = String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

function ensureUniqueId(baseId, usedIds) {
  const base = baseId || 'section';
  let id = base;
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

function isAppendixField(field) {
  const sectionLabel = (field.section && String(field.section).trim()) || '';
  const fieldLabel = (field.label && String(field.label).trim()) || '';
  const fieldId = (field.field_id && String(field.field_id).trim()) || '';

  return (
    sectionLabel.toLowerCase().startsWith('appendix') ||
    fieldLabel.toLowerCase().startsWith('appendix') ||
    fieldId.toLowerCase().startsWith('appendix-')
  );
}

export function buildDirectorySections(fields, sectionsMeta) {
  const fieldsBySection = new Map();

  for (const field of Object.values(fields ?? {})) {
    if (isAppendixField(field)) {
      continue;
    }

    const sectionLabel = (field.section && String(field.section).trim()) || 'Unknown';
    if (!fieldsBySection.has(sectionLabel)) {
      fieldsBySection.set(sectionLabel, []);
    }
    fieldsBySection.get(sectionLabel).push(field);
  }

  for (const sectionFields of fieldsBySection.values()) {
    sectionFields.sort((a, b) => a.label.localeCompare(b.label));
  }

  const orderedSections = [];
  const seenLabels = new Set();
  const usedIds = new Set();
  const knownSections = [...(sectionsMeta?.sections ?? [])];

  for (const section of knownSections) {
    if (!fieldsBySection.has(section.label) || seenLabels.has(section.label)) {
      continue;
    }

    orderedSections.push({
      id: ensureUniqueId(section.id || slugifySectionLabel(section.label), usedIds),
      label: section.label,
      fields: fieldsBySection.get(section.label),
    });
    seenLabels.add(section.label);
  }

  const remainingLabels = [...fieldsBySection.keys()]
    .filter((label) => !seenLabels.has(label) && !label.toLowerCase().startsWith('appendix'))
    .sort((a, b) => a.localeCompare(b));

  for (const label of remainingLabels) {
    orderedSections.push({
      id: ensureUniqueId(slugifySectionLabel(label), usedIds),
      label,
      fields: fieldsBySection.get(label),
    });
  }

  const sections = orderedSections.map((section) => ({
    ...section,
    fieldCount: section.fields.length,
  }));

  return {
    sections,
    byId: Object.fromEntries(sections.map((section) => [section.id, section])),
  };
}

export function activateTileOnSpace(event) {
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    event.currentTarget.click();
  }
}
