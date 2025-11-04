import { useState } from 'react';
import Navbar from './components/Navbar';
import AnalyzePage from './pages/AnalyzePage';
import ImprovePage from './pages/ImprovePage';
import PlanPage from './pages/PlanPage';
import DashboardPage from './pages/DashboardPage';
import ConnectAccountsPage from './pages/ConnectAccountsPage';
import SiteOverviewPage from './pages/SiteOverviewPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // default tab can be dashboard

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'analyze' && <AnalyzePage />}
      {activeTab === 'improve' && <ImprovePage />}
      {activeTab === 'plan' && <PlanPage />}
      {activeTab === 'connect' && <ConnectAccountsPage />}
      {activeTab === 'overview' && <SiteOverviewPage />}
    </div>
  );
}
