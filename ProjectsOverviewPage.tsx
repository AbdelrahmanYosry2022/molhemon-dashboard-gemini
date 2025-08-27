import React, { useState } from 'react';
import { icons, projectsData, ThemeToggleButton } from './shared';

const getStatusClass = (status) => {
    switch (status) {
        case 'نشط': return 'status-active';
        case 'مكتمل': return 'status-completed';
        case 'مخطط له': return 'status-planned';
        case 'متوقف': return 'status-on-hold';
        default: return '';
    }
};

const ProjectsTable = ({ projects, onProjectSelect }) => (
    <div className="table-container">
        <table className="projects-table">
            <thead>
                <tr>
                    <th>اسم المشروع</th>
                    <th>العميل</th>
                    <th>الميزانية</th>
                    <th>التواريخ</th>
                    <th>التقدم</th>
                    <th>الحالة</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody>
                {projects.map(project => (
                    <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{project.client}</td>
                        <td>{new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(project.budget)}</td>
                        <td>
                            <div className="date-range">
                                <span>{project.startDate}</span>
                                <span>&rarr;</span>
                                <span>{project.endDate}</span>
                            </div>
                        </td>
                        <td>
                            <div className="progress-track">
                                <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
                            </div>
                        </td>
                        <td>
                            <span className={`status-badge ${getStatusClass(project.status)}`}>
                                {project.status}
                            </span>
                        </td>
                        <td>
                            <div className="action-buttons">
                                <button className="action-button" title="عرض" onClick={() => onProjectSelect(project)}>{icons.view}</button>
                                <button className="action-button" title="تعديل">{icons.edit}</button>
                                <button className="action-button action-delete" title="حذف">{icons.delete}</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ProjectCard = ({ project, onProjectSelect }) => (
    <div className="project-card" onClick={() => onProjectSelect(project)}>
        <div className="project-card-header">
            <h3>{project.title}</h3>
            <span className={`status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
        </div>
        <p className="project-card-client">{project.client}</p>
        <div className="progress-bar-container">
             <div className="progress-track">
                <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
            </div>
            <span>{project.progress}%</span>
        </div>
    </div>
);


const ProjectsGrid = ({ projects, onProjectSelect }) => (
    <div className="projects-grid">
        {projects.map(project => (
            <ProjectCard key={project.id} project={project} onProjectSelect={onProjectSelect} />
        ))}
    </div>
);

export const ProjectsOverviewPage = ({ onProjectSelect, onBackToHome }) => {
    const [filter, setFilter] = useState('active'); // 'active' or 'all'
    const [view, setView] = useState('list'); // 'list' or 'grid'

    const filteredProjects = projectsData.filter(p => {
        if (filter === 'active') {
            return p.status === 'نشط' || p.status === 'مخطط له';
        }
        return true; // for 'all'
    });

    return (
        <div className="page-container">
            <header className="page-header">
                 <h1 className="main-heading">إدارة المشاريع</h1>
                 <div className="header-actions">
                     <div className="control-group">
                         <button className={`control-button ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>النشطة والمخطط لها</button>
                         <button className={`control-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>كل المشاريع</button>
                     </div>
                      <div className="control-group">
                         <button className={`control-button icon-button ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="عرض كقائمة">{icons.list}</button>
                         <button className={`control-button icon-button ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="عرض كشبكة">{icons.grid}</button>
                     </div>
                     <button onClick={onBackToHome} className="icon-action-button" title="العودة للرئيسية">{icons.dashboard}</button>
                     <ThemeToggleButton />
                 </div>
            </header>
            <main>
                {view === 'list' 
                    ? <ProjectsTable projects={filteredProjects} onProjectSelect={onProjectSelect} />
                    : <ProjectsGrid projects={filteredProjects} onProjectSelect={onProjectSelect} />
                }
            </main>
        </div>
    );
};
