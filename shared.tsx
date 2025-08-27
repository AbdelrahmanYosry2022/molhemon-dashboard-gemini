import React, { useState, useContext, createContext, useEffect, useRef } from 'react';

export const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    projects: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    team: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    clients: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>,
    payments: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    milestones: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
    docs: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    deliverables: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
    duplicate: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
    reports: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    portfolio: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
    services: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 2.47 2.47 2.47M12 22.56l-2.47-2.47M3.44 11H1M22.56 12H20M12 2.44V1M11 20h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 7.5a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 12 7.5z"></path></svg>,
    assets: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>,
    landmark: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg>,
    arrowLeft: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    arrowRight: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
    sparkle: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73L12 3z"></path></svg>,
    sun: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
    moon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
    view: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    delete: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
    list: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    grid: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    add: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    exportCsv: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    search: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    download: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    filePdf: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M10 15.5v-5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z"></path><path d="M15 15.5h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1v4z"></path></svg>,
    fileDoc: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M12 12h-2a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h2"></path></svg>,
    fileSheet: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6h-2"></path><path d="M10 12v6"></path><path d="M16 12v6h2"></path><path d="M18 12v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path></svg>,
    fileGeneric: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>,
    user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    logout: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
};

export const homeCards = [
    { id: 'projects', title: 'إدارة المشاريع', description: 'تنظيم وتنفيذ المشاريع بمرونة، تتبع المهام والمواعيد والميزانيات.', icon: icons.projects, badgeText: 'جديد', badgeType: 'new', keyword: 'المشاريع' },
    { id: 'team', title: 'إدارة فريق العمل', description: 'إدارة الفريق وتوزيع المهام ومتابعة الأداء بسهولة.', icon: icons.team, badgeText: 'قريباً', badgeType: 'soon', keyword: 'الفريق' },
    { id: 'clients', title: 'قاعدة بيانات العملاء', description: 'تخزين ومتابعة بيانات العملاء والعقود وسجل التواصل.', icon: icons.clients, badgeText: 'قريباً', badgeType: 'soon', keyword: 'العملاء' },
    { id: 'finance', title: 'الحسابات المالية', description: 'إدارة الإيرادات والمصروفات وتقارير الرصيد والمستحقات.', icon: icons.payments, badgeText: 'جديد', badgeType: 'new', keyword: 'المالية' },
    { id: 'docs', title: 'المستندات والعقود', description: 'رفع وتنظيم المستندات والعقود مع صلاحيات وبحث سريع.', icon: icons.docs, badgeText: 'قريباً', badgeType: 'soon', keyword: 'المستندات' },
    { id: 'reports', title: 'التقارير والإحصائيات', description: 'لوحات وتقارير فورية لقياس الأداء والميزانيات.', icon: icons.reports, badgeText: 'قريباً', badgeType: 'soon', keyword: 'التقارير' },
    { id: 'portfolio', title: 'حافظة الأعمال', description: 'عرض أعمالك المنجزة والحالية بصفة احترافية.', icon: icons.portfolio, badgeText: 'قريباً', badgeType: 'soon', keyword: 'الأعمال' },
    { id: 'services', title: 'إدارة الخدمات', description: 'تعريف وتسعير خدماتك وإدارتها للعملاء.', icon: icons.services, badgeText: 'قريباً', badgeType: 'soon', keyword: 'الخدمات' },
    { id: 'assets', title: 'إدارة الأصول', description: 'تتبع الأصول المادية والرقمية وصيانتها.', icon: icons.assets, badgeText: 'قريباً', badgeType: 'soon', keyword: 'الأصول' },
];

export const projectsData = [
    { 
        id: 1, 
        title: "هوية د. باسم عليوة", 
        client: "باسم عليوة", 
        budget: 15000, 
        paid: 10000, 
        startDate: "2024-05-01", 
        endDate: "2024-07-30", 
        progress: 65, 
        status: "نشط", 
        description: "وصف كامل لمشروع الهوية البصرية للدكتور باسم عليوة، يشمل الأهداف، الجمهور المستهدف، والمتطلبات الفنية، بالإضافة إلى تصميم الشعارات والمواد التسويقية.", 
        teamMembers: [
            { id: 1, member: { name: 'أحمد محمود', initials: 'AM' }, role: 'مصمم رئيسي', status: 'نشط', joinDate: '2024-05-01', hourlyRate: null, allocatedHours: 80 },
            { id: 2, member: { name: 'فاطمة الزهراء', initials: 'FZ' }, role: 'مديرة المشروع', status: 'نشط', joinDate: '2024-05-01', hourlyRate: 250, allocatedHours: 40 },
        ],
        payments: [
            { id: 1, date: '2024-05-01', type: 'دفعة مقدمة', item: 'الدفعة الأولى من العقد', status: 'مدفوع', amount: 7500, method: 'تحويل بنكي' },
            { id: 2, date: '2024-06-15', type: 'دفعة مرحلية', item: 'بعد تسليم الشعار', status: 'مدفوع', amount: 2500, method: 'نقداً' },
        ],
        milestones: [
            { id: 1, title: 'البحث وجمع المتطلبات', startDate: '2024-05-01', endDate: '2024-05-10', status: 'مكتمل', progress: 100 },
            { id: 2, title: 'تصميم الشعار الأولي', startDate: '2024-05-11', endDate: '2024-05-25', status: 'قيد التنفيذ', progress: 70 },
            { id: 3, title: 'تصميم الهوية البصرية الكاملة', startDate: '2024-05-26', endDate: '2024-06-30', status: 'لم تبدأ', progress: 0 },
        ],
        deliverables: [
            { id: 1, title: 'تصميم الشعار النهائي (3 نماذج)', responsible: { name: 'أحمد محمود', initials: 'AM' }, dueDate: '2024-06-15', type: 'تصميم شعار', status: 'مقبول', cost: 2500, currency: 'ج.م', links: ['logo_final.pdf'] },
            { id: 2, title: 'تصميم بطاقة العمل', responsible: { name: 'أحمد محمود', initials: 'AM' }, dueDate: '2024-06-20', type: 'تصميم مطبوعات', status: 'قيد المراجعة', cost: 500, currency: 'ج.م', links: [] },
            { id: 3, title: 'دليل الهوية البصرية', responsible: { name: 'أحمد محمود', initials: 'AM' }, dueDate: '2024-06-30', type: 'كتاب تصميم', status: 'قيد الإعداد', cost: 1500, currency: 'ج.م', links: [] },
        ],
        files: [
            { id: 1, name: 'Project Brief.pdf', type: 'pdf', description: 'The initial project brief and requirements.', uploadDate: '2024-05-01', uploadedBy: { name: 'فاطمة الزهراء', initials: 'FZ' } },
            { id: 2, name: 'Account Passwords.xlsx', type: 'sheet', description: 'Login credentials for related accounts.', uploadDate: '2024-05-02', uploadedBy: { name: 'فاطمة الزهراء', initials: 'FZ' } },
        ],
        contracts: [
            { id: 1, name: 'Main Service Agreement', status: 'ساري', signDate: '2024-04-30', endDate: '2025-04-30' },
            { id: 2, name: 'Non-Disclosure Agreement', status: 'ساري', signDate: '2024-04-30', endDate: '2026-04-30' },
        ]
    },
    { 
        id: 2, 
        title: "تطوير متجر إلكتروني لـ 'موضة'", 
        client: "موضة", 
        budget: 35000, 
        paid: 35000, 
        startDate: "2024-03-15", 
        endDate: "2024-06-20", 
        progress: 100, 
        status: "مكتمل", 
        description: "مشروع تطوير متجر إلكتروني متكامل باستخدام أحدث التقنيات، مع التركيز على تجربة المستخدم وسهولة الدفع.", 
        teamMembers: [
            { id: 1, member: { name: 'علي حسن', initials: 'AH' }, role: 'مطور الواجهة الأمامية', status: 'مكتمل', joinDate: '2024-03-15', hourlyRate: 300, allocatedHours: 120 },
            { id: 2, member: { name: 'سارة عبدالله', initials: 'SA' }, role: 'مطور الواجهة الخلفية', status: 'مكتمل', joinDate: '2024-03-15', hourlyRate: 350, allocatedHours: 100 },
        ],
        payments: [
             { id: 1, date: '2024-03-15', type: 'دفعة مقدمة', item: 'الدفعة الأولى', status: 'مدفوع', amount: 17500, method: 'تحويل بنكي' },
             { id: 2, date: '2024-06-20', type: 'دفعة نهائية', item: 'عند التسليم', status: 'مدفوع', amount: 17500, method: 'تحويل بنكي' },
        ],
        milestones: [
            { id: 1, title: 'تصميم الواجهات', startDate: '2024-03-15', endDate: '2024-04-10', status: 'مكتمل', progress: 100 },
            { id: 2, title: 'تطوير الواجهة الأمامية والخلفية', startDate: '2024-04-11', endDate: '2024-06-10', status: 'مكتمل', progress: 100 },
            { id: 3, title: 'الاختبار والنشر', startDate: '2024-06-11', endDate: '2024-06-20', status: 'مكتمل', progress: 100 },
        ],
        deliverables: [],
        files: [],
        contracts: [],
    },
    { 
        id: 3, 
        title: "حملة تسويقية لمطعم 'ذوق'", 
        client: "مطعم ذوق", 
        budget: 8000, 
        paid: 2000, 
        startDate: "2024-06-10", 
        endDate: "2024-08-10", 
        progress: 10, 
        status: "مخطط له", 
        description: "إطلاق حملة تسويقية رقمية لزيادة الوعي بالعلامة التجارية وزيادة المبيعات للمطعم.", 
        teamMembers: [{ id: 1, member: { name: 'خالد وليد', initials: 'KW' }, role: 'خبير تسويق رقمي', status: 'نشط', joinDate: '2024-06-10', hourlyRate: null, allocatedHours: null }],
        payments: [
            { id: 1, date: '2024-06-10', type: 'دفعة مقدمة', item: 'تأمين الحملة', status: 'مدفوع', amount: 2000, method: 'نقداً' },
            { id: 2, date: '2024-07-10', type: 'دفعة مرحلية', item: 'منتصف الحملة', status: 'معلق', amount: 4000, method: 'نقداً' },
        ],
        milestones: [
            { id: 1, title: 'وضع استراتيجية الحملة', startDate: '2024-06-10', endDate: '2024-06-20', status: 'قيد التنفيذ', progress: 20 },
        ],
        deliverables: [],
        files: [],
        contracts: [],
    },
    { 
        id: 4, 
        title: "إنتاج فيديو إعلاني لمنتج 'زين'", 
        client: "شركة زين", 
        budget: 22000, 
        paid: 18000, 
        startDate: "2024-04-20", 
        endDate: "2024-07-15", 
        progress: 80, 
        status: "نشط", 
        description: "إنتاج فيديو إعلاني عالي الجودة لعرض مميزات منتج 'زين' الجديد.", 
        teamMembers: [
            { id: 1, member: { name: 'مريم طارق', initials: 'MT' }, role: 'منتجة', status: 'نشط', joinDate: '2024-04-20', hourlyRate: null, allocatedHours: null },
            { id: 2, member: { name: 'يوسف أيمن', initials: 'YA' }, role: 'مخرج', status: 'معلق', joinDate: '2024-04-20', hourlyRate: null, allocatedHours: null }
        ],
        payments: [],
        milestones: [],
        deliverables: [],
        files: [],
        contracts: [],
    },
    { 
        id: 5, 
        title: "إعادة تصميم موقع 'عقاراتي'", 
        client: "عقاراتي", 
        budget: 12000, 
        paid: 5000, 
        startDate: "2024-02-01", 
        endDate: "2024-05-30", 
        progress: 40, 
        status: "متوقف", 
        description: "إعادة تصميم شاملة للموقع الإلكتروني لتحسين تجربة المستخدم وتحديث الهوية البصرية للشركة.", 
        teamMembers: [{ id: 1, member: { name: 'عمر شريف', initials: 'OS' }, role: 'مصمم UI/UX', status: 'مكتمل', joinDate: '2024-02-01', hourlyRate: 150, allocatedHours: 60 }],
        payments: [],
        milestones: [],
        deliverables: [],
        files: [],
        contracts: [],
    },
];

export const financeData = {
    kpis: {
        totalRevenue: 150000,
        totalExpenses: 45000,
        netProfit: 105000,
        dueAmount: 12000,
    },
    incomeExpenses: [
        { id: 1, date: '2024-07-20', description: "دفعة مقدمة من مشروع باسم عليوة", category: 'إيرادات المشروع', amount: 7500, paymentMethod: 'تحويل بنكي' },
        { id: 2, date: '2024-07-18', description: 'اشتراك Adobe Creative Cloud', category: 'اشتراكات برامج', amount: -500, paymentMethod: 'بطاقة ائتمان' },
        { id: 3, date: '2024-07-15', description: "دفعة نهائية من مشروع موضة", category: 'إيرادات المشروع', amount: 17500, paymentMethod: 'تحويل بنكي' },
        { id: 4, date: '2024-07-12', description: 'إعلان فيسبوك لحملة ذوق', category: 'إعلانات ممولة', amount: -2000, paymentMethod: 'بطاقة ائتمان' },
        { id: 6, date: '2024-07-05', description: 'رواتب فريق العمل لشهر يوليو', category: 'رواتب', amount: -15000, paymentMethod: 'تحويل بنكي' },
    ],
    invoices: [
        { id: 1, invoiceNumber: 'INV-001', client: "باسم عليوة", amount: 7500, issueDate: '2024-07-01', dueDate: '2024-07-15', status: 'مدفوعة' },
        { id: 2, invoiceNumber: 'INV-002', client: "موضة", amount: 17500, issueDate: '2024-06-20', dueDate: '2024-07-05', status: 'مدفوعة' },
        { id: 3, invoiceNumber: 'INV-003', client: "مطعم ذوق", amount: 4000, issueDate: '2024-07-10', dueDate: '2024-07-25', status: 'مرسلة' },
        { id: 4, invoiceNumber: 'INV-004', client: "شركة زين", amount: 10000, issueDate: '2024-06-15', dueDate: '2024-06-30', status: 'متأخرة' },
    ],
    treasury: {
        accounts: [
            { id: 1, name: 'خزينة نقدية', balance: 12500 },
            { id: 2, name: 'حساب بنك CIB', balance: 250000 },
            { id: 3, name: 'PayPal', balance: 1500, currency: 'USD' },
        ],
        transfers: [
            { id: 1, from: 'حساب بنك CIB', to: 'خزينة نقدية', amount: 5000, date: '2024-07-10' },
            { id: 2, from: 'PayPal', to: 'حساب بنك CIB', amount: 1000, date: '2024-07-08' },
            { id: 3, from: 'خزينة نقدية', to: 'مصروفات', amount: 800, date: '2024-07-05' },
        ]
    }
};

export const projectSidebarLinks = [
    { id: 'overview', title: 'نظرة عامة', icon: icons.dashboard },
    { id: 'payments', title: 'المدفوعات', icon: icons.payments },
    { id: 'milestones', title: 'مراحل العمل', icon: icons.milestones },
    { id: 'deliverables', title: 'المخرجات', icon: icons.deliverables },
    { id: 'team', title: 'فريق العمل', icon: icons.team },
    { id: 'files', title: 'الملفات والعقود', icon: icons.docs },
];

export const financeSidebarLinks = [
    { id: 'overview', title: 'نظرة عامة', icon: icons.dashboard },
    { id: 'invoices', title: 'الفواتير', icon: icons.docs },
    { id: 'incomeExpenses', title: 'الإيرادات والمصروفات', icon: icons.payments },
    { id: 'treasury', title: 'الخزينة', icon: icons.landmark },
];

export const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle theme">
            {theme === 'light' ? icons.moon : icons.sun}
        </button>
    );
};

export const DashboardCard = ({ title, description, icon, badgeText, badgeType, keyword, onClick }) => (
    <div className="dashboard-card" role="button" tabIndex={0} aria-label={`Navigate to ${title}`} onClick={onClick}>
        <div className="card-header">
            <span className={`card-badge ${badgeType === 'new' ? 'badge-new' : 'badge-soon'}`}>{badgeText}</span>
        </div>
        <div className="card-icon">{icon}</div>
        <div className="card-content">
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
        </div>
        <div className="card-arrow">{icons.arrowRight}</div>
        <div className="card-keyword">{keyword}</div>
    </div>
);

export const UserProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);
    
    return (
        <div className="user-profile-dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="icon-action-button user-profile-button" aria-label="User menu">
                <img src="/assets/Screenshot_135.png" alt="User Avatar" />
            </button>
            {isOpen && (
                <div className="user-dropdown-menu">
                    <ul>
                        <li className="dropdown-item">
                            {icons.user}
                            <span>الحساب الشخصي</span>
                        </li>
                        <li className="dropdown-item">
                            {icons.logout}
                            <span>تسجيل الخروج</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};
