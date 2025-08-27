import React, { useState } from 'react';
import { icons, projectSidebarLinks, ThemeToggleButton } from './shared';

const ProjectSidebar = ({ onNavigate, activeTab }) => (
    <aside className="project-sidebar">
        <div className="sidebar-header">
            <h2 className="sidebar-logo">Molhemon</h2>
        </div>
        <nav className="nav-list">
            {projectSidebarLinks.map(link => (
                <a 
                    key={link.id} 
                    href="#" 
                    className={`nav-link ${activeTab === link.id ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); onNavigate(link.id); }}
                    aria-current={activeTab === link.id ? 'page' : undefined}
                >
                    {link.icon}
                    <span>{link.title}</span>
                </a>
            ))}
        </nav>
    </aside>
);

const ProjectOverviewTab = ({ project }) => {
    const remaining = project.budget - project.paid;
    const formatCurrency = (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

    return (
        <div className="tab-content">
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-card-title">الميزانية الكلية</span>
                    <span className="stat-card-value">{formatCurrency(project.budget)}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-title">المبلغ المدفوع</span>
                    <span className="stat-card-value">{formatCurrency(project.paid)}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-title">المبلغ المتبقي</span>
                    <span className="stat-card-value">{formatCurrency(remaining)}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-card-title">نسبة الإنجاز</span>
                    <span className="stat-card-value progress-value">{project.progress}%</span>
                </div>
            </div>
            <div className="overview-main-content">
                <div className="content-card project-description">
                    <h3>وصف المشروع</h3>
                    <p>{project.description || 'لا يوجد وصف متاح لهذا المشروع.'}</p>
                </div>
                <div className="content-card team-list">
                    <h3>فريق العمل</h3>
                    {project.teamMembers && project.teamMembers.length > 0 ? (
                        project.teamMembers.map(member => (
                            <div key={member.id} className="team-member">
                                <span className="team-member-name">{member.member.name}</span>
                                <span className="team-member-role">{member.role}</span>
                            </div>
                        ))
                    ) : (
                        <p>لم يتم تعيين فريق عمل.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const getPaymentStatusClass = (status) => {
    switch (status) {
        case 'مدفوع': return 'payment-status-paid';
        case 'معلق': return 'payment-status-pending';
        case 'متأخر': return 'payment-status-overdue';
        default: return '';
    }
};

const ProjectPaymentsTab = ({ project }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    const totalRevenue = project.budget;
    const totalPaid = project.paid;
    const dueAmount = project.payments.filter(p => p.status === 'معلق').reduce((acc, p) => acc + p.amount, 0);
    const currentBalance = totalRevenue - totalPaid;

    return (
        <div className="tab-content">
            <div className="secondary-stats-grid">
                <div className="secondary-stat-card">
                    <span className="stat-card-title">إجمالي الإيرادات</span>
                    <span className="stat-card-value">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="secondary-stat-card">
                    <span className="stat-card-title">إجمالي المدفوعات</span>
                    <span className="stat-card-value">{formatCurrency(totalPaid)}</span>
                </div>
                <div className="secondary-stat-card">
                    <span className="stat-card-title">الرصيد الحالي</span>
                    <span className="stat-card-value">{formatCurrency(currentBalance)}</span>
                </div>
                <div className="secondary-stat-card">
                    <span className="stat-card-title">المبلغ المستحق</span>
                    <span className="stat-card-value">{formatCurrency(dueAmount)}</span>
                </div>
            </div>
            <div className="content-card">
                <div className="filter-bar">
                    <div className="search-input">
                        {icons.search}
                        <input type="text" placeholder="البحث في البنود أو الملاحظات..." />
                    </div>
                    <div className="filter-controls">
                        <input type="date" className="date-filter" />
                        <span>-</span>
                        <input type="date" className="date-filter" />
                        <select>
                            <option>جميع الحالات</option>
                            <option>مدفوع</option>
                            <option>معلق</option>
                        </select>
                        <button className="control-button icon-button" title="تصدير CSV">{icons.exportCsv}</button>
                        <button className="control-button primary-action">{icons.add} إضافة نفقة</button>
                    </div>
                </div>
                <div className="table-container payments-table-container">
                     <table className="projects-table">
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>النوع</th>
                                <th>البند/ملاحظات</th>
                                <th>الحالة</th>
                                <th>المبلغ</th>
                                <th>طريقة الدفع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(project.payments && project.payments.length > 0) ? project.payments.map(payment => (
                                <tr key={payment.id}>
                                    <td>{payment.date}</td>
                                    <td>{payment.type}</td>
                                    <td>{payment.item}</td>
                                    <td><span className={`status-badge ${getPaymentStatusClass(payment.status)}`}>{payment.status}</span></td>
                                    <td>{formatCurrency(payment.amount)}</td>
                                    <td>{payment.method}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="empty-table-message">لا توجد مدفوعات مسجلة.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const getMilestoneStatusClass = (status) => {
    switch (status) {
        case 'مكتمل': return 'milestone-status-completed';
        case 'قيد التنفيذ': return 'milestone-status-in-progress';
        case 'لم تبدأ': return 'milestone-status-not-started';
        default: return '';
    }
}

const ProjectMilestonesTab = ({ project }) => {
    return (
        <div className="tab-content milestones-tab-content">
            <div className="content-card">
                 <h3>مراحل المشروع</h3>
                 <div className="milestones-list">
                    {(project.milestones && project.milestones.length > 0) ? project.milestones.map(milestone => (
                        <div className="milestone-item" key={milestone.id}>
                            <div className="milestone-info">
                                <span className="milestone-title">{milestone.title}</span>
                                <span className="milestone-date">{milestone.startDate} &rarr; {milestone.endDate}</span>
                            </div>
                            <div className="milestone-status-progress">
                                <span className={`status-badge ${getMilestoneStatusClass(milestone.status)}`}>{milestone.status}</span>
                                <div className="progress-bar-container">
                                    <div className="progress-track">
                                        <div className="progress-bar" style={{ width: `${milestone.progress}%` }}></div>
                                    </div>
                                    <span>{milestone.progress}%</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="empty-table-message">لم يتم تحديد مراحل لهذا المشروع.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

const getDeliverableStatusClass = (status) => {
    switch(status) {
        case 'قيد الإعداد': return 'deliverable-status-progress';
        case 'قيد المراجعة': return 'deliverable-status-review';
        case 'مقبول': return 'deliverable-status-approved';
        case 'مرفوض': return 'deliverable-status-rejected';
        default: return '';
    }
};

const ProjectDeliverablesTab = ({ project }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);

    return (
        <div className="tab-content">
            <div className="content-card">
                <div className="tab-header">
                    <h3>المخرجات</h3>
                    <button className="control-button primary-action">{icons.add} إضافة مخرج</button>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>العنوان</th>
                                <th>المسؤول</th>
                                <th>تاريخ التسليم</th>
                                <th>النوع</th>
                                <th>الحالة</th>
                                <th>التكلفة</th>
                                <th>روابط/ملفات</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(project.deliverables && project.deliverables.length > 0) ? project.deliverables.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td>
                                        <div className="member-cell">
                                            <div className="avatar">{item.responsible.initials}</div>
                                            <span>{item.responsible.name}</span>
                                        </div>
                                    </td>
                                    <td>{item.dueDate}</td>
                                    <td>{item.type}</td>
                                    <td><span className={`status-badge ${getDeliverableStatusClass(item.status)}`}>{item.status}</span></td>
                                    <td>{formatCurrency(item.cost)}</td>
                                    <td>{item.links.length > 0 ? <a href="#">{item.links[0]}</a> : '—'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-button" title="تكرار">{icons.duplicate}</button>
                                            <button className="action-button" title="تعديل">{icons.edit}</button>
                                            <button className="action-button action-delete" title="حذف">{icons.delete}</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="empty-table-message">لا توجد مخرجات مسجلة.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const getTeamMemberStatusClass = (status) => {
    switch(status) {
        case 'نشط': return 'team-status-active';
        case 'مكتمل': return 'team-status-completed';
        case 'معلق': return 'team-status-suspended';
        default: return '';
    }
}

const ProjectTeamTab = ({ project }) => {
    const formatCurrency = (amount) => amount ? new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount) : '—';
    
    return (
        <div className="tab-content">
            <div className="content-card">
                 <div className="tab-header">
                    <h3>فريق العمل</h3>
                    <button className="control-button primary-action">{icons.add} إضافة عضو</button>
                </div>
                 <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>العضو</th>
                                <th>دوره في المشروع</th>
                                <th>حالة في المشروع</th>
                                <th>تاريخ الانضمام</th>
                                <th>معدل الساعة</th>
                                <th>الساعات المخصصة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                             {(project.teamMembers && project.teamMembers.length > 0) ? project.teamMembers.map(member => (
                                <tr key={member.id}>
                                    <td>
                                        <div className="member-cell">
                                            <div className="avatar">{member.member.initials}</div>
                                            <span>{member.member.name}</span>
                                        </div>
                                    </td>
                                    <td>{member.role}</td>
                                    <td><span className={`status-badge ${getTeamMemberStatusClass(member.status)}`}>{member.status}</span></td>
                                    <td>{member.joinDate}</td>
                                    <td>{formatCurrency(member.hourlyRate)}</td>
                                    <td>{member.allocatedHours || '—'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-button" title="تكرار">{icons.duplicate}</button>
                                            <button className="action-button" title="تعديل">{icons.edit}</button>
                                            <button className="action-button action-delete" title="حذف">{icons.delete}</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="empty-table-message">لم يتم تعيين فريق عمل.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const getFileIcon = (type) => {
    switch(type) {
        case 'pdf': return icons.filePdf;
        case 'doc':
        case 'docx': return icons.fileDoc;
        case 'xls':
        case 'xlsx': return icons.fileSheet;
        default: return icons.fileGeneric;
    }
}

const getContractStatusClass = (status) => {
    switch(status) {
        case 'ساري': return 'contract-status-active';
        case 'منتهي': return 'contract-status-expired';
        case 'قيد المراجعة': return 'contract-status-review';
        default: return '';
    }
}

const ProjectFilesTab = ({ project }) => {
    return (
        <div className="tab-content files-tab-content">
            <div className="content-card">
                <div className="tab-header">
                    <h3>ملفات المشروع</h3>
                    <button className="control-button primary-action">{icons.add} إضافة ملف</button>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>اسم الملف</th>
                                <th>الوصف</th>
                                <th>تاريخ الرفع</th>
                                <th>تم الرفع بواسطة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(project.files && project.files.length > 0) ? project.files.map(file => (
                                <tr key={file.id}>
                                    <td>
                                        <div className="file-cell">
                                            <div className="file-icon">{getFileIcon(file.type)}</div>
                                            <span>{file.name}</span>
                                        </div>
                                    </td>
                                    <td>{file.description}</td>
                                    <td>{file.uploadDate}</td>
                                    <td>
                                         <div className="member-cell">
                                            <div className="avatar">{file.uploadedBy.initials}</div>
                                            <span>{file.uploadedBy.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-button" title="تحميل">{icons.download}</button>
                                            <button className="action-button" title="تعديل">{icons.edit}</button>
                                            <button className="action-button action-delete" title="حذف">{icons.delete}</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} className="empty-table-message">لا توجد ملفات مرفقة.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="content-card">
                <div className="tab-header">
                    <h3>العقود والاتفاقيات</h3>
                    <button className="control-button primary-action">{icons.add} إضافة عقد</button>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>اسم العقد</th>
                                <th>الحالة</th>
                                <th>تاريخ التوقيع</th>
                                <th>تاريخ الانتهاء</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                             {(project.contracts && project.contracts.length > 0) ? project.contracts.map(contract => (
                                <tr key={contract.id}>
                                    <td>{contract.name}</td>
                                    <td><span className={`status-badge ${getContractStatusClass(contract.status)}`}>{contract.status}</span></td>
                                    <td>{contract.signDate}</td>
                                    <td>{contract.endDate}</td>
                                     <td>
                                        <div className="action-buttons">
                                            <button className="action-button" title="عرض">{icons.view}</button>
                                            <button className="action-button" title="تعديل">{icons.edit}</button>
                                            <button className="action-button action-delete" title="حذف">{icons.delete}</button>
                                        </div>
                                    </td>
                                </tr>
                             )) : (
                                 <tr><td colSpan={5} className="empty-table-message">لا توجد عقود مسجلة.</td></tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const ProjectDashboard = ({ project, onBack }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch(activeTab) {
            case 'overview':
                return <ProjectOverviewTab project={project} />;
            case 'payments':
                return <ProjectPaymentsTab project={project} />;
            case 'milestones':
                return <ProjectMilestonesTab project={project} />;
            case 'deliverables':
                return <ProjectDeliverablesTab project={project} />;
            case 'team':
                return <ProjectTeamTab project={project} />;
            case 'files':
                return <ProjectFilesTab project={project} />;
            default:
                return <div className="tab-content"><p>محتوى القسم: {activeTab}</p></div>;
        }
    };

    return (
        <div className="project-dashboard-layout">
            <ProjectSidebar onNavigate={setActiveTab} activeTab={activeTab} />
            <main className="project-content">
                <header className="page-header project-dashboard-header">
                    <h1 className="main-heading">{project.title}</h1>
                    <div className="header-actions">
                         <button onClick={onBack} className="icon-action-button" title="العودة للمشاريع">{icons.arrowRight}</button>
                         <ThemeToggleButton />
                    </div>
                </header>
                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
