
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rocket, Target, Play, Pause, ArrowRight, Trash, Gauge, Crosshair, RotateCw, RotateCcw, Info } from 'lucide-react';
import { ChartContainer } from '../ui/chart';
import { calculateProjectileDistance, generateSamples } from '@/utils/physics/projectileUtils';
import ProjectileCanvas from './ProjectileCanvas';
import HistogramChart from './HistogramChart';

// Launcher configurations with different velocities (mean and standard deviation)
const LAUNCHERS = [
  { id: 1, name: "Launcher 1", velocityMean: 20, velocityStdDev: 0.5, color: "#FF6B6B" },
  { id: 2, name: "Launcher 2", velocityMean: 22, velocityStdDev: 1.0, color: "#4ECDC4" },
  { id: 3, name: "Launcher 3", velocityMean: 18, velocityStdDev: 0.2, color: "#FFD166" },
  { id: 4, name: "Launcher 4", velocityMean: 25, velocityStdDev: 1.5, color: "#6A0572" },
  { id: 5, name: "Launcher 5", velocityMean: 19, velocityStdDev: 0.8, color: "#1A535C" },
  { id: 6, name: "Launcher 6", velocityMean: 21, velocityStdDev: 0.4, color: "#F9C80E" },
];

const SAMPLE_SIZES = [2, 5, 15, 40];
const BIN_WIDTHS = [0.1, 0.2, 0.5, 1.0];
const LAUNCH_ANGLE = 45; // degrees

type SimulationData = {
  [key: number]: number[]; // sampleSize -> distances array
};

const ProjectileSimulation: React.FC = () => {
  const { toast } = useToast();
  const [selectedLauncher, setSelectedLauncher] = useState(LAUNCHERS[0]);
  const [selectedSampleSize, setSelectedSampleSize] = useState(SAMPLE_SIZES[0]);
  const [continuousMode, setContinuousMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState<"normal" | "fast">("normal");
  const [binWidth, setBinWidth] = useState(BIN_WIDTHS[1]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData>({});
  const continuousSimulationRef = useRef<NodeJS.Timeout | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  // Initialize simulation data structure
  useEffect(() => {
    const initialData: SimulationData = {};
    SAMPLE_SIZES.forEach(size => {
      initialData[size] = [];
    });
    setSimulationData(initialData);
  }, []);

  // Handle continuous simulation mode
  useEffect(() => {
    if (continuousMode && isSimulating) {
      const delay = simulationSpeed === "normal" ? 1000 : 300;
      continuousSimulationRef.current = setInterval(() => {
        handleLaunchProjectiles();
      }, delay);
    } else if (continuousSimulationRef.current) {
      clearInterval(continuousSimulationRef.current);
      continuousSimulationRef.current = null;
    }

    return () => {
      if (continuousSimulationRef.current) {
        clearInterval(continuousSimulationRef.current);
      }
    };
  }, [continuousMode, isSimulating, simulationSpeed, selectedLauncher, selectedSampleSize]);

  const handleLaunchProjectiles = () => {
    // Generate new sample data for the current launcher and sample size
    const newSamples = generateSamples(
      selectedLauncher.velocityMean,
      selectedLauncher.velocityStdDev,
      LAUNCH_ANGLE,
      selectedSampleSize
    );
    
    // Calculate the mean distance for this sample group
    const meanDistance = newSamples.reduce((a, b) => a + b, 0) / newSamples.length;
    
    // Add to simulation data
    setSimulationData(prevData => ({
      ...prevData,
      [selectedSampleSize]: [...prevData[selectedSampleSize], meanDistance]
    }));

    // Show toast for feedback
    if (!continuousMode) {
      toast({
        title: "Projectiles Launched!",
        description: `Launched ${selectedSampleSize} projectiles with ${selectedLauncher.name}. Mean distance: ${meanDistance.toFixed(2)}m`,
      });
    }
  };

  const handleStartSimulation = () => {
    if (!isSimulating) {
      setIsSimulating(true);
      if (!continuousMode) {
        handleLaunchProjectiles();
      }
    } else {
      setIsSimulating(false);
    }
  };

  const handleReset = () => {
    // Reset all simulation data
    const initialData: SimulationData = {};
    SAMPLE_SIZES.forEach(size => {
      initialData[size] = [];
    });
    setSimulationData(initialData);
    setIsSimulating(false);
    toast({
      title: "Simulation Reset",
      description: "All data has been cleared.",
    });
  };

  const handleClearCurrentData = () => {
    // Clear only the current sample size data
    setSimulationData(prevData => ({
      ...prevData,
      [selectedSampleSize]: []
    }));
    toast({
      title: "Data Cleared",
      description: `Cleared data for sample size ${selectedSampleSize}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Launcher and Sample Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Launcher</label>
                <Select 
                  value={selectedLauncher.id.toString()}
                  onValueChange={(value) => setSelectedLauncher(LAUNCHERS.find(l => l.id.toString() === value) || LAUNCHERS[0])}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: selectedLauncher.color }}
                      ></div>
                      <SelectValue placeholder="Select Launcher" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {LAUNCHERS.map((launcher) => (
                      <SelectItem key={launcher.id} value={launcher.id.toString()}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: launcher.color }}
                          ></div>
                          {launcher.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Sample Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_SIZES.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSampleSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSampleSize(size)}
                      className="text-sm"
                    >
                      n = {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Simulation Mode and Speed */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Launch Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={!continuousMode ? "default" : "outline"}
                    onClick={() => setContinuousMode(false)}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Single
                  </Button>
                  <Button
                    variant={continuousMode ? "default" : "outline"}
                    onClick={() => setContinuousMode(true)}
                    className="flex items-center gap-1"
                  >
                    <RotateCw className="w-4 h-4 mr-1" />
                    Continuous
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Simulation Speed</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={simulationSpeed === "normal" ? "default" : "outline"}
                    onClick={() => setSimulationSpeed("normal")}
                    className="flex items-center gap-1"
                  >
                    <Gauge className="w-4 h-4 mr-1" />
                    Normal
                  </Button>
                  <Button
                    variant={simulationSpeed === "fast" ? "default" : "outline"}
                    onClick={() => setSimulationSpeed("fast")}
                    className="flex items-center gap-1"
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Fast
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Bin Width and Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Histogram Bin Width</label>
                <Select 
                  value={binWidth.toString()}
                  onValueChange={(value) => setBinWidth(parseFloat(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Bin Width" />
                  </SelectTrigger>
                  <SelectContent>
                    {BIN_WIDTHS.map((width) => (
                      <SelectItem key={width} value={width.toString()}>
                        {width} meters
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={isSimulating ? "destructive" : "default"}
                    onClick={handleStartSimulation}
                    className="col-span-1"
                  >
                    {isSimulating && continuousMode ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isSimulating && continuousMode ? "Stop" : "Launch"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearCurrentData}
                    className="col-span-1"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="col-span-1"
                  >
                    Reset All
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend Toggle */}
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center"
            >
              <Info className="w-4 h-4 mr-1" />
              {showLegend ? "Hide Legend" : "Show Legend"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Legend */}
      {showLegend && (
        <Card className="p-4 bg-muted/50">
          <CardContent className="p-0">
            <h3 className="font-medium mb-2">Simulation Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {LAUNCHERS.map(launcher => (
                <div key={launcher.id} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: launcher.color }}
                  ></div>
                  <span>{launcher.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Angle: {LAUNCH_ANGLE}° (fixed) | Gravity: 9.8 m/s²</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projectile Canvas */}
        <Card className="overflow-hidden">
          <CardContent className="p-0 h-[300px]">
            <ProjectileCanvas 
              launcher={selectedLauncher}
              sampleSize={selectedSampleSize}
              launchAngle={LAUNCH_ANGLE}
              simulationData={simulationData[selectedSampleSize]}
              isActive={isSimulating && continuousMode}
            />
          </CardContent>
        </Card>
        
        {/* Histogram */}
        <Card>
          <CardContent className="h-[300px] p-4">
            <HistogramChart
              data={simulationData[selectedSampleSize] || []}
              binWidth={binWidth}
              color={selectedLauncher.color}
              title={`Mean Distances (n=${selectedSampleSize})`}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Mini Histograms Section */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Sample Size Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAMPLE_SIZES.map(size => (
              <div key={size} className="h-[150px]">
                <HistogramChart
                  data={simulationData[size] || []}
                  binWidth={binWidth}
                  color={selectedLauncher.color}
                  title={`n = ${size}`}
                  compact={true}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectileSimulation;
