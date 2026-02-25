import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import HomePage from './HomePage';
import FieldPage from './FieldPage';
import fieldsData from '../../data/fields.json';
import sectionsData from '../../data/sections.json';

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar fields={fieldsData} sections={sectionsData} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage fields={fieldsData} sections={sectionsData} />} />
          <Route path="/fields/:fieldId" element={<FieldPage fields={fieldsData} />} />
        </Routes>
      </main>
    </div>
  );
}
