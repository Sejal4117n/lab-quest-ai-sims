
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SiteHeader from '@/components/layout/SiteHeader';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Lightbulb, 
  Thermometer,
  Timer,
  Droplets,
  Activity,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ExperimentData {
  lightIntensity: number;
  distance: number;
  temperature: number;
  bubbleCount: number;
  duration: number;
  rate: number;
}

const BiologyPhotosynthesis = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [duration, setDuration] = useState(60); // seconds
  const [lightIntensity, setLightIntensity] = useState(50);
  const [lightDistance, setLightDistance] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [bubbleCount, setBubbleCount] = useState(0);
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const [experimentData, setExperimentData] = useState<ExperimentData[]>([]);
  const [hypothesis, setHypothesis] = useState('');
  const [observations, setObservations] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Welcome to the photosynthesis experiment! We'll observe how light affects oxygen production in aquatic plants.",
    "Set up your experiment by adjusting the light intensity and distance. The plant needs light for photosynthesis.",
    "Start the timer and watch as the plant produces oxygen bubbles. Count them carefully!",
    "Record your observations and try different light conditions to see how they affect the rate.",
    "Analyze your data in the graph to understand the relationship between light and photosynthesis rate."
  ];

  // Calculate bubble production rate based on conditions
  const calculateBubbleRate = () => {
    const baseRate = 0.5; // bubbles per second at optimal conditions
    const lightFactor = lightIntensity / 100;
    const distanceFactor = Math.max(0.1, (100 - lightDistance) / 100);
    const tempFactor = temperature > 30 ? 0.8 : temperature < 15 ? 0.3 : 1;
    
    return baseRate * lightFactor * distanceFactor * tempFactor;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeElapsed < duration) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Generate bubbles based on conditions
          const rate = calculateBubbleRate();
          if (Math.random() < rate) {
            setBubbleCount(prevCount => prevCount + 1);
            
            // Add visual bubble
            const newBubble = {
              id: Date.now() + Math.random(),
              x: 45 + Math.random() * 10, // Near the plant
              y: 80,
              opacity: 1
            };
            
            setBubbles(prevBubbles => [...prevBubbles, newBubble]);
          }
          
          if (newTime >= duration) {
            setIsRunning(false);
            recordExperiment();
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeElapsed, duration, lightIntensity, lightDistance, temperature]);

  // Animate bubbles
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setBubbles(prevBubbles => 
        prevBubbles
          .map(bubble => ({
            ...bubble,
            y: bubble.y - 2,
            opacity: bubble.opacity - 0.02
          }))
          .filter(bubble => bubble.opacity > 0 && bubble.y > 0)
      );
    }, 100);
    
    return () => clearInterval(animationInterval);
  }, []);

  const recordExperiment = () => {
    const rate = bubbleCount / (duration / 60); // bubbles per minute
    const newData: ExperimentData = {
      lightIntensity,
      distance: lightDistance,
      temperature,
      bubbleCount,
      duration,
      rate
    };
    
    setExperimentData(prev => [...prev, newData]);
    
    if (voiceEnabled) {
      speak(`Experiment completed! You recorded ${bubbleCount} bubbles in ${duration} seconds, giving a rate of ${rate.toFixed(1)} bubbles per minute.`);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startExperiment = () => {
    setIsRunning(true);
    setCurrentStep(2);
    if (voiceEnabled) {
      speak("Starting photosynthesis measurement. Watch for oxygen bubbles!");
    }
  };

  const stopExperiment = () => {
    setIsRunning(false);
    if (timeElapsed > 0) {
      recordExperiment();
    }
  };

  const resetExperiment = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setBubbleCount(0);
    setBubbles([]);
    setCurrentStep(0);
  };

  const getLightColor = () => {
    if (lightIntensity < 30) return '#FFE5B4'; // Dim yellow
    if (lightIntensity < 70) return '#FFFF99'; // Medium yellow
    return '#FFFF00'; // Bright yellow
  };

  const getPlantColor = () => {
    const healthFactor = (lightIntensity * (100 - lightDistance) * (temperature > 15 ? 1 : 0.5)) / 10000;
    const greenIntensity = Math.min(255, 100 + healthFactor * 155);
    return `rgb(0, ${greenIntensity}, 0)`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
      <SiteHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/biology">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Biology Lab
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌱 Photosynthesis in Aquatic Plants
          </h1>
          <p className="text-gray-600">
            Investigate how light intensity affects the rate of oxygen production in aquatic plants
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Experiment Setup */}
          <div className="lg:col-span-2 space-y-6">
            {/* Virtual Lab */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Virtual Aquatic Plant Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg overflow-hidden">
                  {/* Light source */}
                  <div 
                    className="absolute w-12 h-12 rounded-full border-2 border-yellow-400 flex items-center justify-center"
                    style={{
                      top: '10px',
                      left: `${lightDistance}%`,
                      backgroundColor: getLightColor(),
                      boxShadow: `0 0 ${lightIntensity}px ${getLightColor()}`
                    }}
                  >
                    <Lightbulb className="h-6 w-6 text-yellow-800" />
                  </div>

                  {/* Light beam */}
                  <div 
                    className="absolute opacity-30"
                    style={{
                      top: '60px',
                      left: `${lightDistance}%`,
                      width: '2px',
                      height: '200px',
                      backgroundColor: getLightColor(),
                      boxShadow: `0 0 ${lightIntensity/2}px ${getLightColor()}`
                    }}
                  />

                  {/* Beaker */}
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-32 h-48 border-4 border-gray-300 bg-blue-100 rounded-b-lg">
                    {/* Water */}
                    <div className="w-full h-5/6 bg-blue-200 rounded-b-lg relative">
                      {/* Plant */}
                      <div 
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-24 rounded-t-full"
                        style={{ backgroundColor: getPlantColor() }}
                      >
                        {/* Plant leaves */}
                        <div className="absolute top-2 left-1 w-3 h-6 bg-green-400 rounded-full transform -rotate-12"></div>
                        <div className="absolute top-4 right-1 w-3 h-6 bg-green-400 rounded-full transform rotate-12"></div>
                        <div className="absolute top-8 left-0 w-4 h-6 bg-green-400 rounded-full transform -rotate-6"></div>
                      </div>

                      {/* Bubbles */}
                      {bubbles.map(bubble => (
                        <div
                          key={bubble.id}
                          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                          style={{
                            left: `${bubble.x}%`,
                            bottom: `${bubble.y}%`,
                            opacity: bubble.opacity
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Sodium bicarbonate label */}
                    <div className="absolute -top-8 left-0 text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      NaHCO₃ solution
                    </div>
                  </div>

                  {/* Bubble counter display */}
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
                    <div className="text-sm font-medium text-gray-700">Oxygen Bubbles</div>
                    <div className="text-2xl font-bold text-blue-600">{bubbleCount}</div>
                  </div>

                  {/* Timer display */}
                  <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
                    <div className="text-sm font-medium text-gray-700">Time</div>
                    <div className="text-xl font-bold text-green-600">
                      {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                    </div>
                    <Progress value={(timeElapsed / duration) * 100} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Experiment Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4" />
                      Light Intensity: {lightIntensity}%
                    </Label>
                    <Slider
                      value={[lightIntensity]}
                      onValueChange={(value) => setLightIntensity(value[0])}
                      max={100}
                      step={10}
                      disabled={isRunning}
                    />
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Light Distance: {lightDistance}%</Label>
                    <Slider
                      value={[lightDistance]}
                      onValueChange={(value) => setLightDistance(value[0])}
                      max={90}
                      min={10}
                      step={10}
                      disabled={isRunning}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature (°C)
                    </Label>
                    <Input
                      type="number"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      min={10}
                      max={40}
                      disabled={isRunning}
                    />
                  </div>
                  
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Timer className="h-4 w-4" />
                      Duration (seconds)
                    </Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min={30}
                      max={300}
                      disabled={isRunning}
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <Button
                      onClick={voiceEnabled ? () => setVoiceEnabled(false) : () => setVoiceEnabled(true)}
                      variant="outline"
                      size="icon"
                    >
                      {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={isRunning ? stopExperiment : startExperiment}
                    disabled={timeElapsed >= duration && !isRunning}
                    className="flex-1"
                  >
                    {isRunning ? (
                      <><Pause className="h-4 w-4 mr-2" /> Stop</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Start Experiment</>
                    )}
                  </Button>
                  
                  <Button onClick={resetExperiment} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data & Analysis */}
          <div className="space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Science Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {steps[currentStep]}
                  </p>
                  {voiceEnabled && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => speak(steps[currentStep])}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Play Audio
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hypothesis */}
            <Card>
              <CardHeader>
                <CardTitle>Hypothesis</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your hypothesis about how light intensity will affect photosynthesis rate..."
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Data Table */}
            {experimentData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Experiment Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Light %</th>
                          <th className="text-left p-2">Bubbles/min</th>
                        </tr>
                      </thead>
                      <tbody>
                        {experimentData.map((data, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{data.lightIntensity}%</td>
                            <td className="p-2">{data.rate.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Graph */}
            {experimentData.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photosynthesis Rate vs Light Intensity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      rate: {
                        label: "Bubbles per minute",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-48"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={experimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="lightIntensity" 
                          label={{ value: 'Light Intensity (%)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Bubbles/min', angle: -90, position: 'insideLeft' }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="var(--color-rate)" 
                          strokeWidth={2}
                          dot={{ fill: "var(--color-rate)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* Observations */}
            <Card>
              <CardHeader>
                <CardTitle>Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Record your observations about bubble production, plant behavior, etc..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Conclusion */}
            {experimentData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Conclusion</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What can you conclude about the relationship between light and photosynthesis?"
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BiologyPhotosynthesis;
