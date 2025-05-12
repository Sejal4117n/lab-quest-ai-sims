
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TestTube, AlertTriangle, FlaskConical, Beaker } from "lucide-react";
import { Chemical } from '@/types/experiments';

interface ChemicalShelfProps {
  chemicals: Chemical[];
}

const ChemicalShelf: React.FC<ChemicalShelfProps> = ({ chemicals }) => {
  const [chemicalFilter, setChemicalFilter] = useState<string>('all');

  const getFilteredChemicals = () => {
    if (chemicalFilter === 'all') return chemicals;
    return chemicals.filter(chem => chem.type === chemicalFilter);
  };

  const handleDragStart = (e: React.DragEvent, chemical: Chemical) => {
    e.dataTransfer.setData('chemical', JSON.stringify(chemical));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getContainerIcon = (type: string) => {
    switch(type) {
      case 'acid':
        return <TestTube className="w-5 h-5 text-red-500" />;
      case 'base':
        return <Beaker className="w-5 h-5 text-blue-500" />;
      case 'salt':
        return <TestTube className="w-5 h-5 text-purple-500" />;
      case 'metal':
        return <Beaker className="w-5 h-5 text-gray-500" />;
      case 'indicator':
        return <TestTube className="w-5 h-5 text-amber-500" />;
      case 'catalyst':
        return <FlaskConical className="w-5 h-5 text-green-500" />;
      default:
        return <TestTube className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4 h-full">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TestTube className="h-5 w-5" />
        Chemical Shelf
      </h3>
      
      <div className="flex items-center gap-2 pb-2 overflow-x-auto">
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'all' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('all')}
        >
          All
        </Badge>
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'acid' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('acid')}
        >
          Acids
        </Badge>
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'base' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('base')}
        >
          Bases
        </Badge>
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'salt' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('salt')}
        >
          Salts
        </Badge>
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'metal' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('metal')}
        >
          Metals
        </Badge>
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'indicator' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('indicator')}
        >
          Indicators
        </Badge>
        <Badge
          className={`cursor-pointer ${chemicalFilter === 'catalyst' ? 'bg-purple-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          onClick={() => setChemicalFilter('catalyst')}
        >
          Catalysts
        </Badge>
      </div>
      
      <ScrollArea className="h-[480px] pr-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {getFilteredChemicals().map(chemical => (
            <div
              key={chemical.id}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-grab transition-colors"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, chemical)}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Test Tube Container with Liquid */}
                <div className="relative w-12 h-20 flex items-center justify-center">
                  {/* Test tube outline */}
                  <div className="absolute w-7 h-16 rounded-b-full border-2 border-gray-300"></div>
                  {/* Test tube liquid */}
                  <div 
                    className="absolute bottom-0 w-6 h-12 rounded-b-full transition-all duration-300" 
                    style={{ backgroundColor: chemical.color }}
                  ></div>
                  {/* Test tube top rim */}
                  <div className="absolute top-0 w-10 h-1.5 bg-gray-300 rounded-t-md"></div>
                  
                  {/* Chemical type icon overlay */}
                  <div className="absolute top-[-10px] right-[-10px]">
                    {getContainerIcon(chemical.type)}
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-sm font-medium">{chemical.name}</h4>
                  <p className="text-xs text-gray-500 font-mono">{chemical.formula}</p>
                  
                  <div className="flex justify-center mt-1 flex-wrap gap-1">
                    {chemical.hazardLevel === 'high' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1 border-red-400 text-red-700">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        {chemical.hazardLabel || 'High Hazard'}
                      </Badge>
                    )}
                    {chemical.hazardLevel === 'medium' && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1 border-amber-400 text-amber-700">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        {chemical.hazardLabel || 'Caution'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChemicalShelf;
