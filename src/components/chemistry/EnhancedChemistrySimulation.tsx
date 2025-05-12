
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FlaskConical, TestTube, Info } from "lucide-react";
import ChemicalShelf from './simulation/ChemicalShelf';
import LabBench from './simulation/LabBench';
import ControlPanel from './simulation/ControlPanel';
import ObservationsPanel from './simulation/ObservationsPanel';
import { Chemical, LabSimulationState } from '@/types/experiments';

// Default chemicals
const defaultChemicals: Chemical[] = [
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    type: 'acid',
    color: 'rgba(255, 255, 255, 0.8)',
    concentration: 0.1,
    hazardLevel: 'high',
    hazardLabel: 'Corrosive',
    description: 'Strong acid often used in lab experiments',
    reactions: {
      'naoh': {
        productName: 'Sodium Chloride',
        productFormula: 'NaCl',
        colorChange: 'transparent',
        precipitate: false
      }
    }
  },
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    type: 'base',
    color: 'rgba(255, 255, 255, 0.8)',
    concentration: 0.1,
    hazardLevel: 'high',
    hazardLabel: 'Corrosive',
    description: 'Strong base used in many reactions'
  },
  {
    id: 'phenolphthalein',
    name: 'Phenolphthalein',
    formula: 'C20H14O4',
    type: 'indicator',
    color: 'rgba(255, 255, 255, 0.8)',
    hazardLevel: 'low',
    description: 'pH indicator that turns pink in basic solutions'
  },
  {
    id: 'agno3',
    name: 'Silver Nitrate',
    formula: 'AgNO₃',
    type: 'salt',
    color: 'rgba(255, 255, 255, 0.9)',
    hazardLevel: 'medium',
    description: 'Used in precipitation reactions',
    reactions: {
      'nacl': {
        productName: 'Silver Chloride',
        productFormula: 'AgCl',
        precipitate: true,
        precipitateColor: 'white'
      }
    }
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    type: 'salt',
    color: 'rgba(255, 255, 255, 0.9)',
    hazardLevel: 'low',
    description: 'Table salt'
  },
  {
    id: 'h2o2',
    name: 'Hydrogen Peroxide',
    formula: 'H₂O₂',
    type: 'solvent',
    color: 'rgba(200, 200, 255, 0.2)',
    concentration: 0.03,
    hazardLevel: 'medium',
    hazardLabel: 'Oxidizer',
    description: 'Decomposes into water and oxygen',
    reactions: {
      'mno2': {
        gasProduction: true,
        gasName: 'Oxygen',
        temperatureChange: 5
      }
    }
  },
  {
    id: 'mno2',
    name: 'Manganese Dioxide',
    formula: 'MnO₂',
    type: 'catalyst',
    color: 'rgba(100, 100, 100, 0.8)',
    hazardLevel: 'medium',
    description: 'Catalyst for H₂O₂ decomposition'
  },
  {
    id: 'zn',
    name: 'Zinc',
    formula: 'Zn',
    type: 'metal',
    color: 'rgba(180, 180, 180, 0.9)',
    hazardLevel: 'low',
    description: 'Reactive metal'
  },
  {
    id: 'pb_no3_2',
    name: 'Lead Nitrate',
    formula: 'Pb(NO₃)₂',
    type: 'salt',
    color: 'rgba(255, 255, 255, 0.9)',
    hazardLevel: 'high',
    hazardLabel: 'Toxic',
    description: 'Used in precipitation reactions',
    reactions: {
      'ki': {
        productName: 'Lead Iodide',
        productFormula: 'PbI₂',
        precipitate: true,
        precipitateColor: 'yellow'
      }
    }
  },
  {
    id: 'ki',
    name: 'Potassium Iodide',
    formula: 'KI',
    type: 'salt',
    color: 'rgba(255, 255, 255, 0.9)',
    hazardLevel: 'low',
    description: 'Used in precipitation reactions'
  }
];

// Default glassware setup
const defaultGlassware = [
  {
    id: 'beaker1',
    type: 'beaker' as const,
    capacity: 250,
    contents: [],
    position: { x: 100, y: 350 }
  },
  {
    id: 'test_tube1',
    type: 'test-tube' as const,
    capacity: 50,
    contents: [],
    position: { x: 250, y: 350 }
  },
  {
    id: 'flask1',
    type: 'flask' as const,
    capacity: 150,
    contents: [],
    position: { x: 400, y: 350 }
  }
];

const EnhancedChemistrySimulation: React.FC = () => {
  const [labState, setLabState] = useState<LabSimulationState>({
    activeExperiment: 'acid-base',
    mode: 'explore',
    glassware: defaultGlassware,
    chemicals: defaultChemicals,
    temperature: 25,
    heaterOn: false,
    timer: 0,
    timerRunning: false,
    ph: 7,
    observations: [],
    procedureStep: 0
  });

  const handleAddChemical = (chemical: Chemical, glasswaredId: string) => {
    setLabState(prev => {
      // Add chemical to the glassware
      const updatedGlassware = prev.glassware.map(glass => {
        if (glass.id === glasswaredId) {
          // Check if container already has this chemical
          const existingChemical = glass.contents.find(c => c.chemicalId === chemical.id);
          
          if (existingChemical) {
            // Increase volume of existing chemical
            return {
              ...glass,
              contents: glass.contents.map(c => 
                c.chemicalId === chemical.id 
                  ? { ...c, volume: Math.min(c.volume + 10, glass.capacity) } 
                  : c
              )
            };
          } else {
            // Add new chemical
            return {
              ...glass,
              contents: [
                ...glass.contents,
                { 
                  chemicalId: chemical.id, 
                  volume: 10, 
                  concentration: chemical.concentration || 1 
                }
              ]
            };
          }
        }
        return glass;
      });
      
      // Check for reactions
      const targetGlassware = updatedGlassware.find(g => g.id === glasswaredId);
      let observations = [...prev.observations];
      let newPh = prev.ph;
      
      if (targetGlassware && targetGlassware.contents.length > 0) {
        // Record the observation
        observations.push(`Added ${chemical.name} to ${targetGlassware.type}`);
        
        // Update pH based on chemicals
        if (chemical.type === 'acid') {
          newPh = Math.max(prev.ph - 1, 0);
          observations.push(`pH decreased to ${newPh}`);
        } else if (chemical.type === 'base') {
          newPh = Math.min(prev.ph + 1, 14);
          observations.push(`pH increased to ${newPh}`);
        }
      }

      return {
        ...prev,
        glassware: updatedGlassware,
        observations,
        ph: newPh
      };
    });
  };

  const handleHeaterToggle = (checked: boolean) => {
    setLabState(prev => ({
      ...prev,
      heaterOn: checked,
      observations: checked 
        ? [...prev.observations, "Turned heater on."] 
        : [...prev.observations, "Turned heater off."]
    }));
  };

  const handleTemperatureChange = (newTemp: number) => {
    setLabState(prev => ({
      ...prev,
      temperature: newTemp,
      observations: [...prev.observations, `Temperature set to ${newTemp}°C`]
    }));
  };

  const handleTimerToggle = () => {
    setLabState(prev => ({
      ...prev,
      timerRunning: !prev.timerRunning,
      observations: !prev.timerRunning 
        ? [...prev.observations, "Started timer."] 
        : [...prev.observations, `Stopped timer at ${formatTime(prev.timer)}.`]
    }));
  };

  const resetExperiment = () => {
    setLabState(prev => ({
      ...prev,
      glassware: defaultGlassware,
      temperature: 25,
      heaterOn: false,
      timer: 0,
      timerRunning: false,
      ph: 7,
      observations: ["Experiment reset."],
      procedureStep: 0
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    let timerIntervalId: NodeJS.Timeout;
    
    if (labState.timerRunning) {
      timerIntervalId = setInterval(() => {
        setLabState(prev => ({
          ...prev,
          timer: prev.timer + 1
        }));
      }, 1000);
    }
    
    return () => {
      if (timerIntervalId) clearInterval(timerIntervalId);
    };
  }, [labState.timerRunning]);

  // Temperature effect when heater is on
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (labState.heaterOn) {
      intervalId = setInterval(() => {
        setLabState(prev => ({
          ...prev,
          temperature: Math.min(prev.temperature + 0.5, 100)
        }));
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [labState.heaterOn]);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel - Chemical Shelf */}
        <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md p-3">
          <ChemicalShelf chemicals={labState.chemicals} />
        </div>
        
        {/* Center Panel - Lab Bench */}
        <div className="col-span-12 md:col-span-6 bg-white rounded-lg shadow-md p-3">
          <div className="h-[500px]">
            <LabBench 
              labState={labState} 
              onAddChemical={handleAddChemical}
              onTemperatureChange={handleTemperatureChange}
            />
          </div>
        </div>
        
        {/* Right Panel - Control Panel */}
        <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md p-3">
          <ControlPanel 
            labState={labState}
            onHeaterToggle={handleHeaterToggle}
            onTimerToggle={handleTimerToggle}
            onExperimentSelect={(exp) => setLabState(prev => ({ ...prev, activeExperiment: exp }))}
            onModeSelect={(mode) => setLabState(prev => ({ ...prev, mode: mode }))}
            onReset={resetExperiment}
          />
        </div>
      </div>
      
      {/* Bottom Panel - Observations */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <ObservationsPanel labState={labState} />
      </div>
      
      {/* Audio elements for sound effects */}
      <audio id="bubbling" src="/sounds/bubbling.mp3" preload="auto"></audio>
      <audio id="explosion" src="/sounds/explosion.mp3" preload="auto"></audio>
      <audio id="fizz" src="/sounds/fizz.mp3" preload="auto"></audio>
      <audio id="pour" src="/sounds/pour.mp3" preload="auto"></audio>
    </div>
  );
};

export default EnhancedChemistrySimulation;
