import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import HomePage from './HomePage';
import FieldPage from './FieldPage';
import SectionGalleryPage from './SectionGalleryPage';
import GlobalHeader from './GlobalHeader';
import WorkInProgressPage from './WorkInProgressPage';
import ReportsPage from './ReportsPage';
import CohortBuilderPage from './CohortBuilderPage';

export default function App() {
  const [fieldsData, setFieldsData] = useState(null);
  const [sectionsData, setSectionsData] = useState(null);
  const [isDictionaryLoading, setIsDictionaryLoading] = useState(true);
  const [dictionaryError, setDictionaryError] = useState(null);
  const [reportLinks, setReportLinks] = useState({});
  const location = useLocation();
  const isCohortBuilder = location.pathname.startsWith('/cohort-builder');
  const showDictionarySidebar =
    !isCohortBuilder &&
    (location.pathname === '/' ||
    location.pathname.startsWith('/fields/') ||
    location.pathname.startsWith('/sections/'));

  useEffect(() => {
    let isCancelled = false;

    async function loadReportLinks() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}report_links.json`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const links = await response.json();
        if (!isCancelled) {
          setReportLinks(links ?? {});
        }
      } catch {
        if (!isCancelled) {
          setReportLinks({});
        }
      }
    }

    loadReportLinks();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadDictionaryData() {
      try {
        setIsDictionaryLoading(true);
        setDictionaryError(null);

        const [fieldsResponse, sectionsResponse] = await Promise.all([
          fetch('/data/fields.json'),
          fetch('/data/sections.json'),
        ]);

        if (!fieldsResponse.ok) {
          throw new Error(`fields.json HTTP ${fieldsResponse.status}`);
        }
        if (!sectionsResponse.ok) {
          throw new Error(`sections.json HTTP ${sectionsResponse.status}`);
        }

        const [fields, sections] = await Promise.all([
          fieldsResponse.json(),
          sectionsResponse.json(),
        ]);

        if (!isCancelled) {
          setFieldsData(fields);
          setSectionsData(sections);
        }
      } catch (error) {
        if (!isCancelled) {
          setDictionaryError(error instanceof Error ? error.message : 'Failed to load dictionary data.');
        }
      } finally {
        if (!isCancelled) {
          setIsDictionaryLoading(false);
        }
      }
    }

    loadDictionaryData();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (isDictionaryLoading) {
    return (
      <div className="app-shell">
        <GlobalHeader />
        <main className="main-content main-content--full">
          <p>Loading data dictionary...</p>
        </main>
      </div>
    );
  }

  if (dictionaryError || !fieldsData || !sectionsData) {
    return (
      <div className="app-shell">
        <GlobalHeader />
        <main className="main-content main-content--full">
          <h1>Unable to load data dictionary</h1>
          <p>{dictionaryError ?? 'The data files are missing or invalid.'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <GlobalHeader />
      <div className="app-layout">
        {showDictionarySidebar && <Sidebar fields={fieldsData} sections={sectionsData} />}
        <main className={`main-content ${showDictionarySidebar ? '' : isCohortBuilder ? 'main-content--cohort' : 'main-content--full'}`}>
          <Routes>
            <Route path="/" element={<HomePage fields={fieldsData} sections={sectionsData} />} />
            <Route
              path="/sections/:sectionId"
              element={<SectionGalleryPage fields={fieldsData} sections={sectionsData} />}
            />
            <Route
              path="/fields/:fieldId"
              element={<FieldPage fields={fieldsData} reportLinks={reportLinks} />}
            />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/cohort-builder" element={<CohortBuilderPage />} />
            <Route path="/about" element={<WorkInProgressPage title="About" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
