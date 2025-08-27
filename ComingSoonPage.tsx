import React from 'react';
import { icons } from './shared';

export const ComingSoonPage = ({ onBackToHome }) => (
    <div className="page-container coming-soon-container">
        <div className="coming-soon-content">
            <h1 className="main-heading">قريباً...</h1>
            <p className="sub-heading">نعمل حالياً على تطوير هذا القسم. سيكون متاحاً في التحديثات القادمة.</p>
            <button onClick={onBackToHome} className="control-button primary-action">
                {icons.arrowRight}
                <span>العودة للرئيسية</span>
            </button>
        </div>
    </div>
);
