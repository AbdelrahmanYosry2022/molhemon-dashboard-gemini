import React, { useEffect, useMemo, useState } from 'react';
import { icons, projectsData, ThemeToggleButton } from './shared';
import { supabase } from './lib/supabase';
import ProjectModal, { ProjectFormValues } from './ProjectModal';
import type { Database } from './src/database.types';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getStatusClass = (status) => {
    switch (status) {
        case 'نشط': return 'status-active';
        case 'مكتمل': return 'status-completed';
        case 'مخطط له': return 'status-planned';
        case 'متوقف': return 'status-on-hold';
        default: return '';
    }
};

const DraggableProjectRow = ({ project, onProjectSelect, onProjectEdit, onProjectDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
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
                <div class="action-buttons">
                    <button class="action-button" title="عرض" onClick={() => onProjectSelect(project)}>{icons.view}</button>
                    <button class="action-button" title="تعديل" onClick={() => onProjectEdit(project)}>{icons.edit}</button>
                    <button class="action-button action-delete" title="حذف" onClick={() => onProjectDelete(project)}>{icons.delete}</button>
                </div>
            </td>
            <td className="drag-handle">{icons.dragHandle}</td>
        </tr>
    );
};

const ProjectsTable = ({ projects, onProjectSelect, onProjectEdit, onProjectDelete }) => (
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
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {projects.map(project => (
                        <DraggableProjectRow
                            key={project.id}
                            project={project}
                            onProjectSelect={onProjectSelect}
                            onProjectEdit={onProjectEdit}
                            onProjectDelete={onProjectDelete}
                        />
                    ))}
                </SortableContext>
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
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [remoteProjects, setRemoteProjects] = useState<Array<{
        id: string;
        title: string;
        client: string;
        budget: number;
        startDate: string | null;
        endDate: string | null;
        progress: number;
        status: 'نشط' | 'مكتمل' | 'مخطط له' | 'متوقف';
    }> | null>(null);
    const [loading, setLoading] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        let isCancelled = false;
        async function fetchProjects() {
            setLoading(true);
            const [{ data: proj, error: projErr }, { data: clients, error: clientsErr }] = await Promise.all([
                supabase.from('projects').select('*'),
                supabase.from('clients').select('id, first_name, last_name')
            ]);

            if (isCancelled) return;
            if (projErr || clientsErr || !proj) {
                console.warn('[projects:fetch]', { projErr, clientsErr });
                setRemoteProjects(null);
                setLoading(false);
                return;
            }

            const idToClientName = new Map<string, string>();
            (clients || []).forEach(c => {
                const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
                if (c.id) idToClientName.set(c.id, name || '—');
            });

            const now = new Date();
            const toPercent = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

            const ui = proj.map(p => {
                const start = p.start_date ? new Date(p.start_date) : null;
                const end = p.end_date ? new Date(p.end_date) : null;
                let status: 'نشط' | 'مكتمل' | 'مخطط له' | 'متوقف' = 'مخطط له';
                if (start && end) {
                    if (now > end) status = 'مكتمل';
                    else if (now >= start && now <= end) status = 'نشط';
                    else status = 'مخطط له';
                } else if (start && now >= start) {
                    status = 'نشط';
                }

                let progress = 0;
                if (start && end) {
                    const totalMs = end.getTime() - start.getTime();
                    const doneMs = now.getTime() - start.getTime();
                    if (totalMs > 0) progress = toPercent((doneMs / totalMs) * 100);
                }

                return {
                    id: p.id,
                    title: p.name,
                    client: p.client_id ? (idToClientName.get(p.client_id) || '—') : '—',
                    budget: (p.total_price ?? p.total ?? 0) as number,
                    startDate: p.start_date,
                    endDate: p.end_date,
                    progress,
                    status
                };
            });

            setRemoteProjects(ui);
            setLoading(false);
        }

        fetchProjects();
        return () => {
            isCancelled = true;
        };
    }, []);

    const sourceProjects = useMemo(() => {
        if (remoteProjects && remoteProjects.length > 0) return remoteProjects;
        // fallback على الداتا المحلية إذا مفيش بيانات
        return projectsData.map(p => ({
            id: String(p.id),
            title: p.title,
            client: p.client,
            budget: p.budget,
            startDate: p.startDate,
            endDate: p.endDate,
            progress: p.progress,
            status: p.status as any
        }));
    }, [remoteProjects]);

    const filteredProjects = sourceProjects.filter(p => {
        if (filter === 'active') {
            return p.status === 'نشط' || p.status === 'مخطط له';
        }
        return true; // for 'all'
    });

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setRemoteProjects((items) => {
                if (!items) return null;
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleProjectEdit = (project) => {
        setEditingProject(project);
        setIsEditOpen(true);
    };

    const handleProjectDelete = async (project) => {
        if (window.confirm(`هل أنت متأكد من حذف المشروع "${project.title}"؟`)) {
            try {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                    .eq('id', project.id);
                
                if (error) throw error;
                
                // إزالة المشروع من القائمة المحلية
                setRemoteProjects(prev => prev ? prev.filter(p => p.id !== project.id) : null);
                console.log('تم حذف المشروع:', project);
            } catch (e) {
                console.warn('[projects:delete]', e);
                alert('تعذر حذف المشروع.');
            }
        }
    };

    const handleUpdateProject = async (values: ProjectFormValues) => {
        if (!editingProject) return;
        
        setErrorMsg(null);
        const budgetNum = Number(values.budget || 0);
        setSaving(true);
        try {
            const payload: any = {
                name: values.name.trim(),
                start_date: values.startDate || null,
                end_date: values.endDate || null,
                total_price: budgetNum,
                total: budgetNum,
                currency: 'EGP'
            };
            const { data, error } = await supabase
                .from('projects')
                .update(payload)
                .eq('id', editingProject.id)
                .select('*')
                .single();
            if (error) throw error;

            // تحديث المشروع في القائمة المحلية
            const now = new Date();
            const start = data.start_date ? new Date(data.start_date) : null;
            let status: 'نشط' | 'مكتمل' | 'مخطط له' | 'متوقف' = ((): any => {
                switch (values.status) {
                    case 'active': return 'نشط';
                    case 'completed': return 'مكتمل';
                    case 'on_hold': return 'متوقف';
                    default: return start && now >= start ? 'نشط' : 'مخطط له';
                }
            })();
            const updatedProject = {
                id: data.id,
                title: data.name,
                client: editingProject.client,
                budget: budgetNum,
                startDate: data.start_date,
                endDate: data.end_date,
                progress: editingProject.progress,
                status
            };
            setRemoteProjects(prev => prev ? prev.map(p => p.id === editingProject.id ? updatedProject : p) : [updatedProject]);
            setIsEditOpen(false);
            setEditingProject(null);
        } catch (e) {
            console.warn('[projects:update]', e);
            setErrorMsg('تعذر تحديث المشروع.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProject = async (values: ProjectFormValues) => {
        setErrorMsg(null);
        const budgetNum = Number(values.budget || 0);
        setSaving(true);
        try {
            const payload: any = {
                name: values.name.trim(),
                start_date: values.startDate || null,
                end_date: values.endDate || null,
                total_price: budgetNum,
                total: budgetNum,
                currency: 'EGP'
            };
            const { data, error } = await supabase
                .from('projects')
                .insert(payload)
                .select('*')
                .single();
            if (error) throw error;

            // أضف للمصدر الحالي بدون إعادة تحميل
            const now = new Date();
            const start = data.start_date ? new Date(data.start_date) : null;
            let status: 'نشط' | 'مكتمل' | 'مخطط له' | 'متوقف' = ((): any => {
                switch (values.status) {
                    case 'active': return 'نشط';
                    case 'completed': return 'مكتمل';
                    case 'on_hold': return 'متوقف';
                    default: return start && now >= start ? 'نشط' : 'مخطط له';
                }
            })();
            const uiProject = {
                id: data.id,
                title: data.name,
                client: '—',
                budget: budgetNum,
                startDate: data.start_date,
                endDate: data.end_date,
                progress: 0,
                status
            };
            setRemoteProjects(prev => (prev ? [uiProject, ...prev] : [uiProject]));
            setIsAddOpen(false);
        } catch (e) {
            console.warn('[projects:add]', e);
            setErrorMsg('تعذر حفظ المشروع.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-container projects-page">
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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    {view === 'list'
                        ? <ProjectsTable
                            projects={filteredProjects}
                            onProjectSelect={onProjectSelect}
                            onProjectEdit={handleProjectEdit}
                            onProjectDelete={handleProjectDelete}
                        />
                        : <ProjectsGrid projects={filteredProjects} onProjectSelect={onProjectSelect} />
                    }
                </DndContext>
                <div className="add-project-container">
                    <button className="fab-add-project" aria-label="إضافة مشروع" onClick={() => setIsAddOpen(true)}>
                        <span className="fab-icon">{icons.add}</span>
                        <span className="fab-label">إضافة مشروع</span>
                    </button>
                </div>

                <ProjectModal
                    open={isAddOpen}
                    title="إضافة مشروع جديد"
                    onClose={() => !saving && setIsAddOpen(false)}
                    submitting={saving}
                    error={errorMsg}
                    onSubmit={handleSaveProject}
                />

                <ProjectModal
                    open={isEditOpen}
                    title="تعديل المشروع"
                    onClose={() => !saving && setIsEditOpen(false)}
                    submitting={saving}
                    error={errorMsg}
                    onSubmit={handleUpdateProject}
                    initialValues={editingProject ? {
                        name: editingProject.title,
                        startDate: editingProject.startDate,
                        endDate: editingProject.endDate,
                        budget: editingProject.budget?.toString() || '',
                        status: editingProject.status === 'نشط' ? 'active' : 
                               editingProject.status === 'مكتمل' ? 'completed' : 
                               editingProject.status === 'متوقف' ? 'on_hold' : 'planned'
                    } : undefined}
                />
            </main>
        </div>
    );
};
