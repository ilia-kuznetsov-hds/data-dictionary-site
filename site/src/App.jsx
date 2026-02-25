import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import HomePage from './HomePage';
import FieldPage from './FieldPage';
import fieldsData from '../../data/fields.json';
import sectionsData from '../../data/sections.json';

export default function App() {
  const [reportLinks, setReportLinks] = useState({});

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
    <div className="app-layout">
      <Sidebar fields={fieldsData} sections={sectionsData} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage fields={fieldsData} sections={sectionsData} />} />
          <Route
            path="/fields/:fieldId"
            element={<FieldPage fields={fieldsData} reportLinks={reportLinks} />}
          />
        </Routes>
      </main>
    </div>
  );
}
