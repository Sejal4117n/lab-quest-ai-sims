
import React from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import VirtualChemistryLab from '@/components/chemistry/VirtualChemistryLab';

const VirtualChemistryLabPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <SiteHeader />
      <main className="flex-1 py-6">
        <VirtualChemistryLab />
      </main>
    </div>
  );
};

export default VirtualChemistryLabPage;
