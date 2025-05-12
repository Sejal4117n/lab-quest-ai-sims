
import React from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedChemistrySimulation from '@/components/chemistry/EnhancedChemistrySimulation';
import VirtualChemistryLab from '@/components/chemistry/VirtualChemistryLab';
import { FlaskConical, Beaker, Shield, Info, Atom } from 'lucide-react';

const ChemistryLab = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <SiteHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Chemistry Laboratory</h1>
          <p className="text-muted-foreground mt-2">
            Mix chemicals, build equations, and learn chemistry through hands-on experimentation
          </p>
        </div>
        
        <Tabs defaultValue="interactive" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6 w-full md:w-[400px]">
            <TabsTrigger value="interactive">
              <FlaskConical className="w-4 h-4 mr-2" />
              Interactive Lab
            </TabsTrigger>
            <TabsTrigger value="virtual">
              <Atom className="w-4 h-4 mr-2" />
              Virtual Equations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interactive">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <FlaskConical className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Interactive Chemistry Workbench</h2>
                <p className="text-muted-foreground">Drag chemicals from the shelf to containers, observe realistic reactions</p>
              </div>
            </div>
            
            <Card>
              <EnhancedChemistrySimulation />
            </Card>
          </TabsContent>
          
          <TabsContent value="virtual">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Atom className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Virtual Equation Builder</h2>
                <p className="text-muted-foreground">Build and balance chemical equations, learn about reaction properties</p>
              </div>
            </div>
            
            <Card>
              <VirtualChemistryLab />
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-md p-4 dark:bg-amber-950/20 dark:border-amber-900">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">Safety Reminder</h3>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                While our virtual lab lets you explore chemical reactions safely, always follow proper safety protocols 
                if performing real experiments. Remember to wear appropriate safety gear and follow lab safety guidelines.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-background py-6 border-t">
        <div className="container text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Science Lab AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ChemistryLab;
