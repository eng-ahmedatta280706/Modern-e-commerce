import React from 'react';
import { useTranslate } from '../../hooks/userTranslate';

const TopBar: React.FC = () => {
  const { t } = useTranslate();
  return (
    <div className="bg-ink text-white text-xs text-center py-1.5 px-4">
      {t('header.freeShipping')}
    </div>
  );
};

export default TopBar;
