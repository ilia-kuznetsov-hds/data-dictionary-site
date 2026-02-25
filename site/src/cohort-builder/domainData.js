/* ============================================================
   ANZNN Cohort Builder — Domain & Field Configuration
   ============================================================ */

// Field types:
//   yes-no-unknown  → 3 radio buttons: Yes / No / Unknown
//   yes-no          → 2 radio buttons: Yes / No
//   multi-select    → checkbox list (options array required)
//   single-select   → <select> dropdown (options array required)
//   numeric-range   → min / max number inputs (min/max props optional)
//   date-range      → from / to date inputs
//   text-search     → free text input

export const PROGRAM_DATA_DOMAINS = {
  registration: {
    label: 'Registration',
    category: 'program',
    fields: [
      { id: 'hospital', label: 'Hospital', type: 'text-search' },
      { id: 'baby_code', label: 'BabyCODE', type: 'text-search' },
      { id: 'transport_id', label: 'TransportID', type: 'text-search' },
    ],
  },
  maternal: {
    label: 'Maternal',
    category: 'program',
    fields: [
      { id: 'maternal_age', label: 'Maternal age', type: 'numeric-range', min: 10, max: 60 },
      { id: 'previous_preterm', label: 'Previous preterm birth', type: 'yes-no-unknown' },
      { id: 'previous_perinatal_death', label: 'Previous perinatal death', type: 'yes-no-unknown' },
      {
        id: 'assisted_conception', label: 'Assisted conception', type: 'multi-select',
        options: ['None', 'Hyperovulation', 'IVF', 'Other', 'Unknown'],
      },
      {
        id: 'ethnicity_mother', label: 'Ethnicity of mother', type: 'multi-select',
        options: ['Aboriginal', 'Asian', 'Caucasian', 'Maori', 'Pacific Islander', 'Other', 'Unknown'],
      },
      {
        id: 'indigenous_status_mother', label: 'Indigenous status of mother', type: 'multi-select',
        options: ['Aboriginal', 'Torres Strait Islander', 'Both', 'Neither', 'Unknown'],
      },
      { id: 'maternal_postcode', label: 'Maternal postcode', type: 'text-search' },
      {
        id: 'source_of_referral', label: 'Source of referral', type: 'multi-select',
        options: ['Self', 'General practitioner', 'Specialist', 'Hospital', 'Other', 'Unknown'],
      },
    ],
  },
};

export const CLINICAL_DOMAINS = {
  antenatal: {
    label: 'Antenatal',
    category: 'domain',
    fields: [
      { id: 'preterm_labour', label: 'Preterm labour', type: 'yes-no-unknown' },
      { id: 'hypertension_pregnancy', label: 'Hypertension in pregnancy', type: 'yes-no-unknown' },
      { id: 'antepartum_haemorrhage', label: 'Antepartum haemorrhage', type: 'yes-no-unknown' },
      { id: 'suspected_iugr', label: 'Suspected IUGR', type: 'yes-no-unknown' },
      { id: 'fetal_compromise', label: 'Fetal compromise', type: 'yes-no-unknown' },
      { id: 'antenatal_malformation', label: 'Antenatal diagnosis of fetal malformation', type: 'yes-no-unknown' },
      {
        id: 'antenatal_corticosteroids', label: 'Antenatal corticosteroids', type: 'single-select',
        options: ['None', 'Incomplete <24hr', 'Complete', 'Repeat'],
      },
      {
        id: 'presenting_antenatal_problem', label: 'Presenting antenatal problem', type: 'multi-select',
        options: [
          'Preterm labour', 'PPROM', 'Hypertension', 'Antepartum haemorrhage',
          'IUGR', 'Fetal compromise', 'Elective preterm delivery', 'Other',
        ],
      },
      { id: 'systemic_antibiotics_mother', label: 'Systemic antibiotics to mother', type: 'yes-no-unknown' },
      { id: 'magnesium_sulphate', label: 'Magnesium sulphate within 24hr', type: 'yes-no-unknown' },
      { id: 'rupture_of_membranes', label: 'Date of rupture of membranes', type: 'date-range' },
    ],
  },
  baby: {
    label: 'Baby',
    category: 'domain',
    fields: [
      {
        id: 'sex', label: 'Sex', type: 'multi-select',
        options: ['Male', 'Female', 'Unknown', 'Ambiguous'],
      },
      { id: 'date_of_birth', label: 'Date of birth', type: 'date-range' },
      { id: 'admission_date', label: 'Admission date', type: 'date-range' },
      { id: 'birthweight_grams', label: 'Birthweight in grams', type: 'numeric-range', min: 200, max: 8000 },
      { id: 'head_circumference_birth', label: 'Head circumference at birth (cm)', type: 'numeric-range', min: 10, max: 60 },
      { id: 'length_birth', label: 'Length at birth (cm)', type: 'numeric-range', min: 20, max: 70 },
      { id: 'gestational_age_weeks', label: 'Gestational age in weeks', type: 'numeric-range', min: 22, max: 44 },
      { id: 'gestational_age_days', label: 'Gestational age in days', type: 'numeric-range', min: 0, max: 6 },
      {
        id: 'birth_plurality', label: 'Birth plurality', type: 'multi-select',
        options: ['Singleton', 'Twins', 'Triplets', 'Quads', 'Other'],
      },
      {
        id: 'birth_order', label: 'Birth order', type: 'multi-select',
        options: ['1st', '2nd', '3rd', '4th+'],
      },
    ],
  },
  birth: {
    label: 'Birth',
    category: 'domain',
    fields: [
      {
        id: 'place_of_birth', label: 'Place of birth', type: 'multi-select',
        options: ['Non-tertiary', 'Tertiary', 'Home', 'Born before arrival'],
      },
      {
        id: 'method_of_birth', label: 'Method of birth', type: 'multi-select',
        options: ['Vaginal', 'Instrument', 'Caesarean in labour', 'Elective caesarean'],
      },
      {
        id: 'presentation_at_birth', label: 'Presentation at birth', type: 'multi-select',
        options: ['Cephalic', 'Breech', 'Other'],
      },
      { id: 'late_cord_clamping', label: 'Late cord clamping', type: 'yes-no-unknown' },
      { id: 'intubated_resuscitation', label: 'Intubated at resuscitation', type: 'yes-no' },
      { id: 'congenital_anomaly', label: 'Congenital anomaly present', type: 'yes-no-unknown' },
      { id: 'apgar_1min', label: 'Apgar at 1 min', type: 'numeric-range', min: 0, max: 10 },
      { id: 'apgar_5min', label: 'Apgar at 5 min', type: 'numeric-range', min: 0, max: 10 },
      { id: 'temp_on_admission', label: 'Temperature on admission (°C)', type: 'numeric-range', min: 30, max: 42 },
    ],
  },
  hie_screening: {
    label: 'HIE & Screening',
    category: 'domain',
    fields: [
      {
        id: 'hie_diagnosis', label: 'HIE diagnosis', type: 'multi-select',
        options: ['None', 'Mild', 'Moderate', 'Severe'],
      },
      { id: 'clinical_encephalopathy', label: 'Clinical diagnosis of encephalopathy or seizures', type: 'yes-no' },
      { id: 'ippv_10min', label: 'IPPV at 10 minutes', type: 'yes-no' },
      { id: 'anticonvulsant', label: 'Anticonvulsant medication', type: 'yes-no' },
      { id: 'cerebral_mri', label: 'Cerebral MRI performed', type: 'yes-no' },
    ],
  },
  respiratory: {
    label: 'Respiratory',
    category: 'domain',
    fields: [
      {
        id: 'respiratory_diagnosis', label: 'Main respiratory diagnosis', type: 'multi-select',
        options: [
          'Respiratory distress syndrome', 'Transient tachypnoea of newborn',
          'Meconium aspiration syndrome', 'Pulmonary hypertension',
          'Pneumonia', 'Apnoea of prematurity', 'Other', 'None',
        ],
      },
      { id: 'exogenous_surfactant', label: 'Exogenous surfactant', type: 'yes-no' },
      { id: 'surfactant_doses', label: 'Number of surfactant doses', type: 'numeric-range', min: 0, max: 10 },
      { id: 'air_leak_drainage', label: 'Air leak requiring drainage', type: 'yes-no' },
      { id: 'nitric_oxide', label: 'Nitric oxide', type: 'yes-no' },
      { id: 'ecmo', label: 'ECMO', type: 'yes-no' },
    ],
  },
  respiratory_support: {
    label: 'Respiratory Support',
    category: 'domain',
    fields: [
      { id: 'nasal_cpap', label: 'Nasal CPAP', type: 'yes-no' },
      { id: 'nasal_niv', label: 'Nasal non-invasive ventilation', type: 'yes-no' },
      { id: 'nasal_high_flow', label: 'Nasal high flow', type: 'yes-no' },
      { id: 'ongoing_mechanical_ventilation', label: 'Ongoing mechanical ventilation', type: 'yes-no' },
      { id: 'hfov', label: 'HFOV', type: 'yes-no' },
      { id: 'hfjv', label: 'HFJV', type: 'yes-no' },
    ],
  },
  chronic_lung_disease: {
    label: 'Chronic Lung Disease',
    category: 'domain',
    fields: [
      {
        id: 'resp_support_36wks', label: 'Respiratory support at 36 weeks PMA', type: 'multi-select',
        options: ['None', 'Supplemental O2', 'CPAP', 'NIV', 'Mechanical ventilation', 'High flow'],
      },
      { id: 'fio2_36wks', label: 'FiO2 at 36 weeks PMA', type: 'numeric-range', min: 0.21, max: 1.0 },
      {
        id: 'shift_test', label: 'Shift Test result', type: 'multi-select',
        options: ['Pass', 'Fail', 'Not done'],
      },
      { id: 'postnatal_steroids_cld', label: 'Postnatal steroids for CLD', type: 'yes-no' },
      { id: 'home_oxygen', label: 'Home oxygen therapy', type: 'yes-no' },
    ],
  },
  cardiac: {
    label: 'Cardiac',
    category: 'domain',
    fields: [
      { id: 'pharmacological_pda', label: 'Pharmacological treatment of PDA', type: 'yes-no' },
      {
        id: 'first_pda_agent', label: 'First pharmacological agent for PDA', type: 'multi-select',
        options: ['Indomethacin', 'Ibuprofen', 'Paracetamol', 'Other'],
      },
    ],
  },
  nec_infection: {
    label: 'NEC & Infection',
    category: 'domain',
    fields: [
      { id: 'proven_nec', label: 'Proven NEC', type: 'yes-no' },
      { id: 'sip', label: 'Spontaneous intestinal perforation', type: 'yes-no' },
      { id: 'probiotics', label: 'Probiotics', type: 'yes-no' },
      { id: 'early_life_antimicrobials', label: 'Early life antimicrobials', type: 'yes-no' },
      { id: 'infection_present', label: 'Bacterial/fungal/viral infection present', type: 'yes-no' },
      { id: 'organism_name', label: 'Name of organism', type: 'text-search' },
      { id: 'central_line_placed', label: 'Central line placed', type: 'yes-no' },
      {
        id: 'central_line_type', label: 'Type of central line', type: 'multi-select',
        options: ['UVC', 'UAC', 'PICC', 'Percutaneous', 'Surgical', 'Other'],
      },
    ],
  },
  surgery: {
    label: 'Surgery',
    category: 'domain',
    fields: [
      { id: 'major_surgery', label: 'Neonatal major surgery', type: 'yes-no' },
      { id: 'icd10_code', label: 'ICD-10 code', type: 'text-search' },
      { id: 'hospital_of_surgery', label: 'Hospital of surgery', type: 'text-search' },
    ],
  },
  nutrition: {
    label: 'Nutrition',
    category: 'domain',
    fields: [
      { id: 'parenteral_nutrition', label: 'Parenteral nutrition', type: 'yes-no' },
      { id: 'home_gavage_feeding', label: 'Home gavage feeding', type: 'yes-no' },
    ],
  },
  therapeutic_hypothermia: {
    label: 'Therapeutic Hypothermia',
    category: 'domain',
    fields: [
      { id: 'received_hypothermia', label: 'Received therapeutic hypothermia', type: 'yes-no' },
      {
        id: 'non_completion_reason', label: 'Reason for non-completion', type: 'multi-select',
        options: ['Completed', 'Death', 'Side effects', 'Clinical decision', 'Other'],
      },
      { id: 'lowest_temp_78hr', label: 'Lowest temperature in first 78hr (°C)', type: 'numeric-range', min: 30, max: 38 },
      { id: 'hypothermia_initiation_date', label: 'Date of initiation', type: 'date-range' },
    ],
  },
  immunisation_feeding_growth: {
    label: 'Immunisation, Feeding & Growth',
    category: 'domain',
    fields: [
      { id: 'early_breast_milk', label: 'Early breast milk feeding', type: 'yes-no' },
      { id: 'donor_breast_milk', label: 'Donor breast milk', type: 'yes-no' },
      { id: 'breast_milk_at_discharge', label: 'Breast milk feeding at discharge', type: 'yes-no' },
      {
        id: 'milk_type_at_discharge', label: 'Type of milk feeding at discharge', type: 'multi-select',
        options: ['Breast milk only', 'Formula only', 'Mixed', 'Donor breast milk', 'Other'],
      },
      { id: 'weight_36wks', label: 'Weight at 36 weeks PMA (g)', type: 'numeric-range', min: 500, max: 5000 },
      { id: 'head_circ_36wks', label: 'Head circumference at 36 weeks PMA (cm)', type: 'numeric-range', min: 20, max: 45 },
      { id: 'length_36wks', label: 'Length at 36 weeks PMA (cm)', type: 'numeric-range', min: 25, max: 60 },
    ],
  },
  ivh_cranial_ultrasound: {
    label: 'IVH & Cranial Ultrasound',
    category: 'domain',
    fields: [
      {
        id: 'max_grade_left_pvh', label: 'Max grade left PVH', type: 'multi-select',
        options: ['Grade 0', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
      },
      {
        id: 'max_grade_right_pvh', label: 'Max grade right PVH', type: 'multi-select',
        options: ['Grade 0', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
      },
      { id: 'cerebellar_haemorrhage', label: 'Cerebellar haemorrhage', type: 'yes-no' },
      {
        id: 'ventricle_size', label: 'Ventricle size', type: 'multi-select',
        options: ['Normal', 'Borderline', 'Ventriculomegaly', 'Post-haemorrhagic hydrocephalus'],
      },
      { id: 'cerebral_cysts_left', label: 'Cerebral cysts left', type: 'yes-no' },
      { id: 'cerebral_cysts_right', label: 'Cerebral cysts right', type: 'yes-no' },
    ],
  },
  eye_examination: {
    label: 'Eye Examination',
    category: 'domain',
    fields: [
      { id: 'baby_meets_eye_exam_criteria', label: 'Baby meets criteria for eye exam', type: 'yes-no' },
      {
        id: 'rop_stage', label: 'ROP stage', type: 'multi-select',
        options: ['None', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5'],
      },
      { id: 'plus_disease', label: 'Plus disease', type: 'yes-no' },
      { id: 'aggressive_rop', label: 'Aggressive ROP', type: 'yes-no' },
      { id: 'surgical_rop', label: 'Surgical therapy for ROP', type: 'yes-no' },
      { id: 'vegf_rop', label: 'Medical VEGF therapy for ROP', type: 'yes-no' },
    ],
  },
  death: {
    label: 'Death',
    category: 'domain',
    fields: [
      { id: 'died', label: 'Died', type: 'yes-no' },
      { id: 'date_of_death', label: 'Date of death', type: 'date-range' },
      { id: 'post_mortem', label: 'Post mortem performed', type: 'yes-no' },
      { id: 'death_congenital_malformation', label: 'Death due to congenital malformation', type: 'yes-no' },
    ],
  },
  transfer_discharge: {
    label: 'Transfer & Discharge',
    category: 'domain',
    fields: [
      { id: 'transferred', label: 'Transferred to another hospital', type: 'yes-no' },
      { id: 'hospital_of_transfer', label: 'Hospital of transfer', type: 'text-search' },
      {
        id: 'level_of_transfer_unit', label: 'Level of transfer unit', type: 'multi-select',
        options: ['Level II', 'Level III'],
      },
      { id: 'date_of_transfer', label: 'Date of transfer', type: 'date-range' },
      { id: 'discharge_date', label: 'Discharge date', type: 'date-range' },
    ],
  },
};

// Ordered list for the panel display
export const PROGRAM_DATA_LIST = [
  { key: 'registration', label: 'Registration' },
  { key: 'maternal', label: 'Maternal' },
];

export const CLINICAL_DOMAIN_LIST = [
  { key: 'antenatal', label: 'Antenatal' },
  { key: 'baby', label: 'Baby' },
  { key: 'birth', label: 'Birth' },
  { key: 'hie_screening', label: 'HIE & Screening' },
  { key: 'respiratory', label: 'Respiratory' },
  { key: 'respiratory_support', label: 'Respiratory Support' },
  { key: 'chronic_lung_disease', label: 'Chronic Lung Disease' },
  { key: 'cardiac', label: 'Cardiac' },
  { key: 'nec_infection', label: 'NEC & Infection' },
  { key: 'surgery', label: 'Surgery' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'therapeutic_hypothermia', label: 'Therapeutic Hypothermia' },
  { key: 'immunisation_feeding_growth', label: 'Immunisation, Feeding & Growth' },
  { key: 'ivh_cranial_ultrasound', label: 'IVH & Cranial Ultrasound' },
  { key: 'eye_examination', label: 'Eye Examination' },
  { key: 'death', label: 'Death' },
  { key: 'transfer_discharge', label: 'Transfer & Discharge' },
];

export function getDomainConfig(domainKey) {
  return PROGRAM_DATA_DOMAINS[domainKey] ?? CLINICAL_DOMAINS[domainKey] ?? null;
}

// ---- Modifier configurations ----
// Maps field IDs to the modifier controls shown in the Apply Modifiers panel.
// Only fields listed here will have an active "Apply Modifiers" button in the cart.

const HOURS_RANGE   = { id: 'hours',           label: 'Hours range',                 type: 'numeric-range' };
const DATE_INIT     = { id: 'date_initiation',  label: 'Date of initiation',          type: 'date-range'    };
const DATE_FIRST    = { id: 'date_first_given', label: 'Date first given',            type: 'date-range'    };
const DOSES_RANGE   = { id: 'doses',            label: 'Number of doses',             type: 'numeric-range' };
const LOWEST_TEMP   = { id: 'lowest_temp',      label: 'Lowest temperature recorded', type: 'numeric-range' };
const DATE_CULTURE  = { id: 'date_culture',     label: 'Date of culture collection',  type: 'date-range'    };
const DATE_SURGERY  = { id: 'date_surgery',     label: 'Date of surgery',             type: 'date-range'    };
const YEAR_OF_BIRTH = { id: 'year_of_birth',    label: 'Year of birth',               type: 'numeric-range' };

export const FIELD_MODIFIERS = {
  // Respiratory Support
  nasal_cpap:                   [HOURS_RANGE, DATE_INIT],
  nasal_niv:                    [HOURS_RANGE, DATE_INIT],
  nasal_high_flow:              [HOURS_RANGE, DATE_INIT],
  ongoing_mechanical_ventilation:[HOURS_RANGE, DATE_INIT],
  hfov:                         [HOURS_RANGE, DATE_INIT],
  hfjv:                         [HOURS_RANGE, DATE_INIT],
  // Respiratory
  nitric_oxide:                 [HOURS_RANGE, DATE_INIT],
  exogenous_surfactant:         [DOSES_RANGE, DATE_FIRST],
  // Nutrition
  parenteral_nutrition:         [HOURS_RANGE, DATE_INIT],
  // Therapeutic Hypothermia
  received_hypothermia:         [DATE_INIT, LOWEST_TEMP],
  // NEC & Infection
  infection_present:            [DATE_CULTURE],
  // Surgery
  major_surgery:                [DATE_SURGERY],
  // Baby date fields
  date_of_birth:                [YEAR_OF_BIRTH],
  admission_date:               [YEAR_OF_BIRTH],
};
