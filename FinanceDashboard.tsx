import React, { useState } from 'react';
import { icons, financeData, financeSidebarLinks, ThemeToggleButton } from './shared';

const FinanceSidebar = ({ onNavigate, activeTab }) => (
    <aside className="project-sidebar">
        <div className="sidebar-header">
            <h2 className="sidebar-logo">Molhemon</h2>
        </div>
        <nav className="nav-list">
            {financeSidebarLinks.map(link => (
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

const FinanceOverviewTab = () => {
    const formatCurrency = (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    
    return (
        <div className="tab-content">
             <div className="kpi-stats-grid">
                <div className="kpi-card">
                    <span className="kpi-card-title">إجمالي الإيرادات</span>
                    <span className="kpi-card-value">{formatCurrency(financeData.kpis.totalRevenue)}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-card-title">إجمالي المصروفات</span>
                    <span className="kpi-card-value expense">{formatCurrency(financeData.kpis.totalExpenses)}</span>
                </div>
                 <div className="kpi-card">
                    <span className="kpi-card-title">صافي الربح</span>
                    <span className="kpi-card-value profit">{formatCurrency(financeData.kpis.netProfit)}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-card-title">المبالغ المستحقة</span>
                    <span className="kpi-card-value due">{formatCurrency(financeData.kpis.dueAmount)}</span>
                </div>
            </div>

            <div className="content-card" style={{marginBottom: '2rem'}}>
                <div className="tab-header">
                    <h3>الإيرادات مقابل المصروفات</h3>
                </div>
                <div className="chart-container">
                    <p>Chart Placeholder</p>
                </div>
            </div>

            <div className="content-card">
                 <div className="tab-header">
                    <h3>أحدث المعاملات</h3>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>الوصف</th>
                                <th>الفئة</th>
                                <th>المبلغ</th>
                                <th>طريقة الدفع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financeData.incomeExpenses.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>{tx.description}</td>
                                    <td>{tx.category}</td>
                                    <td className={tx.amount > 0 ? 'transaction-type-income' : 'transaction-type-expense'}>{formatCurrency(tx.amount)}</td>
                                    <td>{tx.paymentMethod}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const getInvoiceStatusClass = (status) => {
    switch(status) {
        case 'مدفوعة': return 'invoice-status-paid';
        case 'مرسلة': return 'invoice-status-sent';
        case 'متأخرة': return 'invoice-status-overdue';
        default: return '';
    }
};

const FinanceInvoicesTab = () => {
    const formatCurrency = (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    return (
        <div className="tab-content">
            <div className="content-card">
                <div className="tab-header">
                    <h3>الفواتير</h3>
                    <button className="control-button primary-action">{icons.add} إنشاء فاتورة جديدة</button>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>رقم الفاتورة</th>
                                <th>العميل</th>
                                <th>المبلغ</th>
                                <th>تاريخ الإصدار</th>
                                <th>تاريخ الاستحقاق</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financeData.invoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td>{invoice.invoiceNumber}</td>
                                    <td>{invoice.client}</td>
                                    <td>{formatCurrency(invoice.amount)}</td>
                                    <td>{invoice.issueDate}</td>
                                    <td>{invoice.dueDate}</td>
                                    <td><span className={`status-badge ${getInvoiceStatusClass(invoice.status)}`}>{invoice.status}</span></td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="action-button" title="إرسال">{icons.arrowRight}</button>
                                            <button className="action-button" title="تعديل">{icons.edit}</button>
                                            <button className="action-button" title="عرض">{icons.view}</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FinanceIncomeExpensesTab = () => {
    const formatCurrency = (amount) => new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
    return (
        <div className="tab-content">
            <div className="content-card">
                 <div className="tab-header">
                    <h3>الإيرادات والمصروفات</h3>
                    <button className="control-button primary-action">{icons.add} إضافة مصروف جديد</button>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>الوصف</th>
                                <th>التصنيف</th>
                                <th>المبلغ</th>
                                <th>طريقة الدفع</th>
                            </tr>
                        </thead>
                        <tbody>
                             {financeData.incomeExpenses.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>{tx.description}</td>
                                    <td>{tx.category}</td>
                                    <td className={tx.amount > 0 ? 'transaction-type-income' : 'transaction-type-expense'}>{formatCurrency(tx.amount)}</td>
                                    <td>{tx.paymentMethod}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FinanceTreasuryTab = () => {
    const formatCurrency = (amount, currency = 'EGP') => new Intl.NumberFormat('ar-EG', { style: 'currency', currency }).format(amount);
    const totalBalance = financeData.treasury.accounts.filter(a => a.currency !== 'USD').reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="tab-content">
            <div className="treasury-summary-bar">
                <span>إجمالي الأرصدة (EGP)</span>
                <span className="summary-balance">{formatCurrency(totalBalance)}</span>
            </div>
            <div className="treasury-accounts-grid">
                {financeData.treasury.accounts.map(account => (
                    <div className="treasury-account-card" key={account.id}>
                        <span className="account-name">{account.name}</span>
                        <span className="account-balance">{formatCurrency(account.balance, account.currency)}</span>
                    </div>
                ))}
            </div>
            <div className="content-card">
                <div className="tab-header">
                    <h3>سجل التحويلات</h3>
                </div>
                <div className="table-container">
                    <table className="projects-table">
                        <thead>
                            <tr>
                                <th>من</th>
                                <th>إلى</th>
                                <th>المبلغ</th>
                                <th>التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financeData.treasury.transfers.map(t => (
                                <tr key={t.id}>
                                    <td>{t.from}</td>
                                    <td>{t.to}</td>
                                    <td>{formatCurrency(t.amount)}</td>
                                    <td>{t.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const FinanceDashboardPage = ({ onBackToHome }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch(activeTab) {
            case 'invoices': return <FinanceInvoicesTab />;
            case 'incomeExpenses': return <FinanceIncomeExpensesTab />;
            case 'treasury': return <FinanceTreasuryTab />;
            case 'overview':
            default:
                return <FinanceOverviewTab />;
        }
    };
    
    return (
        <div className="finance-dashboard-layout">
            <FinanceSidebar onNavigate={setActiveTab} activeTab={activeTab} />
            <main className="finance-content">
                <header className="page-header">
                    <h1 className="main-heading">الحسابات المالية</h1>
                    <div className="header-actions">
                        <button onClick={onBackToHome} className="icon-action-button" title="العودة للرئيسية">{icons.dashboard}</button>
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
