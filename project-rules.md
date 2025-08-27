# Molhemon Dashboard - قواعد وهيكلية المشروع

## 1. مقدمة المشروع

*   **اسم المشروع**: **Molhemon Dashboard**
*   **الهدف**: منصة إدارة شاملة (مشاريع، عملاء، فريق عمل، حسابات وفلوس، أصول، تصوير، تقارير، مستندات).
*   **التكنولوجيا الأساسية**: **Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui**
*   **قاعدة البيانات**: Supabase (Postgres)

---

## 2. هيكل المستودع (Monorepo)

```
molhemon/
├─ apps/
│  └─ dashboard/          ← Next.js (واجهة رئيسية للداشبورد)
├─ packages/
│  ├─ ui/                 ← مكتبة UI مشتركة (shadcn/ui + ثيم + RTL)
│  ├─ lib/                ← utils مشتركة (تنسيقات تواريخ، رفع ملفات…)
│  ├─ auth/               ← مصادقة وصلاحيات
│  └─ config/             ← eslint/tsconfig/tailwind presets
├─ turbo.json
└─ pnpm-workspace.yaml
```

---

## 3. قواعد كتابة الكود (Project Rules)

1.  **TypeScript فقط** (لا يُسمح بـ JS).
2.  **لا inline styles** → Tailwind classes فقط.
3.  **UI components** تنزل من `packages/ui`.
4.  **المنطق (functions, API calls, DB queries)** في `packages/lib` أو `apps/dashboard/server` وليس في مكونات الواجهة.
5.  **Dummy UI components** للداشبورد: أي شاشة جديدة تُبنى أولًا بواجهة فارغة (أزرار/جداول بدون داتا).
6.  **العزل**:
    *   لكل وحدة: `page.tsx` + `loading.tsx` + `error.tsx`.
    *   أي Widget حساس يلف بـ `ErrorBoundary`.
7.  **Forms**: `react-hook-form + zod`.
8.  **Data fetching**: `@tanstack/react-query`.
9.  **DB**: Supabase (Postgres) + Drizzle ORM.
10. **Dates**: dayjs أو luxon.
11. **Notifications**: toaster/sonner.
12. **Auth**: RBAC (Owner, Admin, Manager, Accountant, Editor, Viewer).

---

## 4. وحدات الداشبورد (Parallel Routes)

*   **Projects** (إدارة المشاريع)
*   **Clients** (إدارة العملاء وحساباتهم)
*   **Team** (إدارة الفريلانس/الموظفين)
*   **Finance** (الحسابات والفلوس)
*   **Portfolio** (الأعمال)
*   **Assets** (الأصول)
*   **Calendar** (الكالندر والمواعيد)
*   **Shoots** (مواعيد التصوير)
*   **Reports** (التقارير والإحصائيات)
*   **Docs** (المستندات والعقود)

> كل وحدة: Slot مستقل = تحميل + أخطاء معزولة.

---

## 5. فصل “المخ” عن الواجهة (Backend vs Frontend)

*   **Frontend/UI** (واجهات):
    *   الصفحات تبقى بالاسم العادي عادي (مثال: `projects/page.tsx`).
    *   الكود فيها خاص بالعرض فقط (UI, layout, dummy components).
    *   أي داتا أو منطق لا يُكتب هنا.
*   **Backend/Logic** (مخ):
    *   يُنشأ ملف بنفس اسم الصفحة لكن قبليه كلمة `use` بحروف صغيرة.
    *   يحتوي على الكود الخاص بالمنطق (functions, hooks, data fetching, server actions).
    *   مثال:
        *   الواجهة: `projects/page.tsx`
        *   المنطق: `projects/useProjects.ts`

### مثال عملي

```
src/app/(dashboard)/@projects/page.tsx      ← واجهة عرض المشاريع (UI)
src/app/(dashboard)/@projects/useProjects.ts ← منطق المشاريع (جلب/إضافة/تحديث)
```

*   في `page.tsx` تستورد الـ hook أو الـ function من `useProjects.ts` وتستعملها.
*   كده أي مشكلة في الباك اند مش هتلخبط الكود بتاع الواجهة.
*   بيخلي الكود منظم: أي حد يشوف `use*.ts` يعرف إنه منطق، وأي `page.tsx` يعرف إنه UI.

---

## 6. التطوير والتسليم

*   كل feature يتعمله **Dummy UI أولًا**.
*   بعد كده يتربط بالـ functions من `lib`.
*   أي جزء يبوّظ يضرب لوحده (`error.tsx`).
*   CI/CD عبر Turborepo (يبني apps/packages كلٍ على حدة).
