import React, { useEffect } from 'react';
import { icons, homeCards, ThemeToggleButton, DashboardCard, UserProfileDropdown } from './shared';
import { supabase } from './lib/supabase';

export const DashboardHomePage = ({ onNavigate }) => {
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('projects').select('*').limit(1);
      // افتح DevTools وشاهد هذا اللوج للتأكد من الاتصال
      console.log('[supabase:projects:test]', { data, error });
    })();
  }, []);
  return (
    <div className="page-container home-page-container">
      {/* أيقونة الدارك مود على اليسار */}
      <div className="theme-toggle-left">
          <ThemeToggleButton />
      </div>
      {/* صورة البروفايل على اليمين */}
      <div className="user-profile-right">
          <UserProfileDropdown />
      </div>
      <div className="home-content">
        <header className="dashboard-header">
          <button className="cta-button">
              مرحباً، عبدالرحمن <span className="wave-hand" aria-hidden="true">👋🏻</span>
          </button>
          <h1 className="main-heading">ما الذي تريد العمل عليه اليوم؟</h1>
        </header>
        <main>
          <div className="cards-grid">
              {homeCards.map((card) => (
                  <DashboardCard key={card.id} {...card} onClick={() => onNavigate(card.id)} />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};
