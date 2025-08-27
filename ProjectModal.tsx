import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ProjectStatus = "planned" | "active" | "completed" | "on_hold";

export interface ProjectFormValues {
  name: string;
  startDate?: string;
  endDate?: string;
  status: ProjectStatus;
  budget?: number;
  description?: string;
}

interface ProjectModalProps {
  open: boolean;
  title?: string;
  initialValues?: Partial<ProjectFormValues>;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void | Promise<void>;
  submitting?: boolean;
  error?: string | null;
}

const defaultValues: ProjectFormValues = {
  name: "",
  startDate: "",
  endDate: "",
  status: "planned",
  budget: undefined,
  description: "",
};

export default function ProjectModal({
  open,
  title = "إضافة مشروع جديد",
  initialValues,
  onClose,
  onSubmit,
  submitting = false,
  error = null,
}: ProjectModalProps) {
  const [values, setValues] = useState<ProjectFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValues((v) => ({ ...defaultValues, ...initialValues }));
  }, [initialValues, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstInputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleField =
    <K extends keyof ProjectFormValues>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val =
        key === "budget" ? (e.target.value === "" ? undefined : Number(e.target.value)) : e.target.value;
      setValues((v) => ({ ...v, [key]: val as any }));
    };

  const validate = () => values.name.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...values,
      name: values.name.trim(),
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    });
  };

  const content = (
    <div
      className="modal-backdrop"
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onMouseDown={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      dir="rtl"
    >
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="project-modal-title">{title}</h3>
          <button aria-label="إغلاق" className="icon-action-button" onClick={onClose} type="button" title="إغلاق">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error ? (
              <div
                style={{
                  background: "var(--background-color)",
                  border: `1px solid var(--border-color)`,
                  color: "var(--text-primary)",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                }}
              >
                {error}
              </div>
            ) : null}

            <div className="form-group">
              <label className="form-label">
                <span style={{ color: "#ef4444", marginLeft: 6 }}>*</span>اسم المشروع
              </label>
              <input
                ref={firstInputRef}
                className="form-input"
                placeholder="أدخل اسم المشروع"
                value={values.name}
                onChange={handleField("name")}
                required
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">تاريخ البداية <span style={{ color: "#ef4444" }}>*</span></label>
                <input className="form-input" type="date" value={values.startDate ?? ""} onChange={handleField("startDate")} />
              </div>
              <div className="form-group">
                <label className="form-label">تاريخ الانتهاء</label>
                <input className="form-input" type="date" value={values.endDate ?? ""} onChange={handleField("endDate")} />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">ميزانية المشروع</label>
                <input
                  className="form-input"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={values.budget ?? ""}
                  onChange={handleField("budget")}
                />
              </div>

              <div className="form-group">
                <label className="form-label">حالة المشروع</label>
                <select className="form-input" value={values.status} onChange={handleField("status")}>
                  <option value="planned">مخطط له</option>
                  <option value="active">نشط</option>
                  <option value="completed">مكتمل</option>
                  <option value="on_hold">معلّق</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">وصف المشروع</label>
              <textarea
                className="form-input"
                placeholder="أدخل وصفًا مختصرًا للمشروع"
                rows={4}
                value={values.description ?? ""}
                onChange={handleField("description")}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="control-button" onClick={onClose} disabled={submitting}>
              إلغاء
            </button>
            <button type="submit" className="control-button primary-action" disabled={submitting || !validate()}>
              {submitting ? "جارٍ الحفظ..." : "إضافة المشروع"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}


