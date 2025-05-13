
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Beaker, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SoluteOption {
  name: string;
  color: string;
  maxMolarity: number;
}

const MolaritySimulation: React.FC = () => {
  // Solute options with their colors and max concentration values
  const soluteOptions: SoluteOption[] = [
    { name: "Drink Mix", color: "#e74c3c", maxMolarity: 5.0 },
    { name: "Cobalt(II) Nitrate", color: "#e91e63", maxMolarity: 5.5 },
    { name: "Potassium Permanganate", color: "#9c27b0", maxMolarity: 0.5 },
    { name: "Potassium Dichromate", color: "#ff9800", maxMolarity: 2.0 },
    { name: "Copper Sulfate", color: "#2196f3", maxMolarity: 1.4 },
    { name: "Nickel(II) Chloride", color: "#4caf50", maxMolarity: 4.0 },
  ];

  // State variables
  const [moles, setMoles] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0); // Liters
  const [selectedSolute, setSelectedSolute] = useState<string>("Drink Mix");
  const [showValues, setShowValues] = useState<boolean>(true);
  const [molarity, setMolarity] = useState<number>(1.0); // mol/L

  // Get the current solute data
  const currentSolute = soluteOptions.find(solute => solute.name === selectedSolute) || soluteOptions[0];
  
  // Calculate molarity whenever moles or volume changes
  useEffect(() => {
    const calculatedMolarity = moles / volume;
    setMolarity(calculatedMolarity);
  }, [moles, volume]);

  // Reset all values to default
  const handleReset = () => {
    setMoles(1.0);
    setVolume(1.0);
    setSelectedSolute("Drink Mix");
    setShowValues(true);
  };

  // Calculate the color opacity based on molarity and max molarity
  const getColorOpacity = () => {
    const normalizedOpacity = Math.min(molarity / currentSolute.maxMolarity, 1);
    return normalizedOpacity;
  };

  // Calculate the vertical position of the concentration indicator
  const getConcentrationIndicatorPosition = () => {
    const normalizedPosition = Math.min(molarity / currentSolute.maxMolarity, 1);
    // Convert to percentage for positioning (0% = bottom, 100% = top)
    return `${normalizedPosition * 100}%`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Molarity Simulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Label htmlFor="solute-select">Select Solute</Label>
              <Select 
                value={selectedSolute} 
                onValueChange={setSelectedSolute}
              >
                <SelectTrigger id="solute-select" className="w-full">
                  <SelectValue placeholder="Select a solute" />
                </SelectTrigger>
                <SelectContent>
                  {soluteOptions.map(solute => (
                    <SelectItem key={solute.name} value={solute.name}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: solute.color }}
                        ></div>
                        {solute.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="moles-slider">Solute Amount (moles)</Label>
                {showValues && <span className="text-sm font-medium">{moles.toFixed(2)} mol</span>}
              </div>
              <Slider
                id="moles-slider"
                min={0.1}
                max={5.0}
                step={0.1}
                value={[moles]}
                onValueChange={(value) => setMoles(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>None</span>
                <span>Lots</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="volume-slider">Solution Volume (liters)</Label>
                {showValues && <span className="text-sm font-medium">{volume.toFixed(2)} L</span>}
              </div>
              <Slider
                id="volume-slider" 
                min={0.1}
                max={2.0}
                step={0.1}
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Full</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="show-values" 
                checked={showValues} 
                onCheckedChange={(checked) => setShowValues(checked as boolean)} 
              />
              <label
                htmlFor="show-values"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Values
              </label>
            </div>

            <Button onClick={handleReset} className="w-full">Reset</Button>
          </div>

          {/* Middle column - Beaker visualization */}
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative w-40 h-64 border-2 border-gray-400 rounded-b-lg overflow-hidden">
              {/* Label for beaker */}
              <div className="absolute top-0 left-0 w-full text-center -mt-7">
                <span className="text-sm font-medium">{selectedSolute}</span>
              </div>
              
              {/* Liquid in the beaker */}
              <div 
                className="absolute bottom-0 w-full transition-all duration-500"
                style={{ 
                  height: `${(volume / 2.0) * 100}%`, 
                  backgroundColor: currentSolute.color,
                  opacity: getColorOpacity()
                }}
              ></div>
              
              {/* Markings on the beaker */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-2 h-0.5 bg-gray-400 left-0"
                    style={{ bottom: `${(i / 4) * 100}%` }}
                  >
                    {showValues && (
                      <span className="absolute -left-8 -top-2 text-xs">{(i * 0.5).toFixed(1)}L</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Molarity value below beaker */}
            {showValues && (
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600">Molarity</div>
                <div className="text-xl font-bold">{molarity.toFixed(2)} mol/L</div>
              </div>
            )}
          </div>

          {/* Right column - Concentration indicator */}
          <div className="flex flex-col items-center h-96">
            <div className="text-center mb-2">Concentration</div>
            <div className="relative w-12 h-64 border border-gray-300 rounded">
              {/* Color gradient for concentration */}
              <div 
                className="absolute inset-0 rounded"
                style={{ 
                  background: `linear-gradient(to top, rgba(255,255,255,0.1), ${currentSolute.color})` 
                }}
              ></div>
              
              {/* Molarity scale markings */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute w-full flex items-center justify-between">
                    <div 
                      className="w-2 h-0.5 bg-gray-800" 
                      style={{ 
                        position: 'absolute',
                        right: '100%',
                        top: `${100 - (i * 20)}%` 
                      }}
                    ></div>
                    {showValues && (
                      <span 
                        className="absolute text-xs -left-8" 
                        style={{ top: `${100 - (i * 20)}%`, transform: 'translateY(-50%)' }}
                      >
                        {((i / 5) * currentSolute.maxMolarity).toFixed(1)}
                      </span>
                    )}
                  </div>
                ))}
                <span 
                  className="absolute text-xs -left-8 bottom-0 transform -translate-y-1/2"
                >
                  0
                </span>
              </div>
              
              {/* Concentration indicator */}
              <div 
                className="absolute right-full -mr-3 flex items-center"
                style={{ 
                  bottom: getConcentrationIndicatorPosition(),
                  transform: 'translateY(50%)'
                }}
              >
                <ArrowRight className="h-4 w-4 text-black dark:text-white" />
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-xs">
                <div>High</div>
                <div className="my-20"></div>
                <div>Zero</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MolaritySimulation;
