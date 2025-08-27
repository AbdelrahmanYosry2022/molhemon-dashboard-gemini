/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { DashboardHomePage } from './DashboardHomePage';
import { ProjectsOverviewPage } from './ProjectsOverviewPage';
import { ProjectDashboard } from './ProjectDashboard';
import { FinanceDashboardPage } from './FinanceDashboard';
import { ComingSoonPage } from './ComingSoonPage';
import { homeCards } from './shared';
import { ThemeContext } from './shared';

const App = () => {
    const [page, setPage] = useState<string>(() => {
        try { return localStorage.getItem('app:page') || 'dashboard'; } catch { return 'dashboard'; }
    });
    const [selectedProject, setSelectedProject] = useState<any>(() => {
        try {
            const saved = localStorage.getItem('app:selectedProject');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(`${theme}-theme`);
    }, [theme]);

    // Persist current page and selected project
    useEffect(() => {
        try {
            localStorage.setItem('app:page', page);
            if (selectedProject) localStorage.setItem('app:selectedProject', JSON.stringify(selectedProject));
            else localStorage.removeItem('app:selectedProject');
        } catch {}
    }, [page, selectedProject]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const handleNavigate = (cardId) => {
        const card = homeCards.find(c => c.id === cardId);
        if (!card) return;

        if (card.badgeType === 'new') {
            if (card.id === 'projects') {
                setPage('projectsOverview');
            } else if (card.id === 'finance') {
                setPage('financeDashboard');
            }
        } else {
            setPage('comingSoon');
        }
    };
    
    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setPage('projectDashboard');
    };

    const handleBackToProjects = () => {
        setSelectedProject(null);
        setPage('projectsOverview');
    };

    const handleBackToHome = () => {
        setSelectedProject(null);
        setPage('dashboard');
    };

    const renderPage = () => {
        switch (page) {
            case 'projectsOverview':
                return <ProjectsOverviewPage onProjectSelect={handleProjectSelect} onBackToHome={handleBackToHome} />;
            case 'projectDashboard':
                return <ProjectDashboard project={selectedProject} onBack={handleBackToProjects} />;
            case 'financeDashboard':
                 return <FinanceDashboardPage onBackToHome={handleBackToHome} />;
            case 'comingSoon':
                return <ComingSoonPage onBackToHome={handleBackToHome} />;
            case 'dashboard':
            default:
                return <DashboardHomePage onNavigate={handleNavigate} />;
        }
    };
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div id="app-container">
              {renderPage()}
            </div>
        </ThemeContext.Provider>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}