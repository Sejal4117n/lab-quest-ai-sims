
import React from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import MolaritySimulation from '@/components/chemistry/MolaritySimulation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeakerIcon, TestTube, FlaskConical, ArrowLeftRight } from 'lucide-react';

const ChemistryVirtualLab = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      <SiteHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Interactive Chemistry Simulations</h1>
          <p className="text-muted-foreground mt-2">
            Learn chemistry principles with interactive simulations and explore molarity concepts
          </p>
        </div>
        
        <Tabs defaultValue="molarity" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6 w-full md:w-[400px]">
            <TabsTrigger value="molarity" className="text-base">
              <BeakerIcon className="w-4 h-4 mr-2" />
              Molarity Simulation
            </TabsTrigger>
            <TabsTrigger value="equations" className="text-base">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Equations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="molarity">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-2 rounded-full dark:bg-purple-900/30">
                <BeakerIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Interactive Molarity Simulation</h2>
                <p className="text-muted-foreground">Explore the relationship between solute, volume, and concentration</p>
              </div>
            </div>
            
            <Card className="mb-6">
              <MolaritySimulation />
            </Card>
            
            <Card className="p-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-blue-100 p-2 rounded-full dark:bg-blue-800">
                  <TestTube className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Learning about Molarity</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Molarity (M) is defined as the number of moles of solute dissolved per liter of solution:
                  </p>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-md text-center mb-3 font-mono">
                    Molarity (M) = Moles of solute / Volume of solution (L)
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Use the sliders to explore how changes in the amount of solute or the volume of the solution 
                    affect the concentration. Notice how the color intensity in the beaker and the position of 
                    the indicator on the concentration scale reflect the molarity value.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="equations">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
                <ArrowLeftRight className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Chemical Equations</h2>
                <p className="text-muted-foreground">Build and balance chemical equations (coming soon)</p>
              </div>
            </div>
            
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Chemical Equation Builder</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This feature is coming soon. You'll be able to create and balance chemical equations, 
                  explore reaction types, and visualize molecular changes.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-background py-6 border-t">
        <div className="container text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Science Lab AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ChemistryVirtualLab;
