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
import fieldsData from '../../data/fields.json';
import sectionsData from '../../data/sections.json';

export default function App() {
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
