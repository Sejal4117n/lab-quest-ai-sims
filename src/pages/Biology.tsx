import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SiteHeader from '@/components/layout/SiteHeader';
import ChatBotMentor from '@/components/ChatBotMentor';
import { Bookmark, Clock, Microscope, CheckCircle2, Beaker, Zap } from 'lucide-react';

const Biology = () => {
  const [completedExperiments, setCompletedExperiments] = useState<string[]>([]);

  // Simulate loading completed experiments from storage
  useEffect(() => {
    // In a real app, this would come from a database or localStorage
    // Removed 'onion-cells' from completed experiments
    const mockCompletedExperiments = ['osmosis'];
    setCompletedExperiments(mockCompletedExperiments);
  }, []);

  const experiments = [
    {
      id: 'photosynthesis',
      title: 'Photosynthesis in Aquatic Plants',
      description: 'Measure the rate of photosynthesis by counting oxygen bubbles produced by aquatic plants under different light conditions.',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      image: '/placeholder.svg',
      path: '/biology/photosynthesis'
    },
    {
      id: 'osmosis',
      title: 'Observing Osmosis in a Potato',
      description: 'Explore how water moves across cell membranes by observing changes in potato slices placed in different salt concentrations.',
      difficulty: 'Beginner',
      duration: '30 minutes',
      image: '/placeholder.svg',
      path: '/biology/osmosis'
    },
    {
      id: 'blood-groups',
      title: 'Blood Group Identification',
      description: 'Learn how to identify different blood groups (A, B, AB, O, Rh+ and Rh-) by simulating the agglutination reaction with antibodies.',
      difficulty: 'Intermediate',
      duration: '25 minutes',
      image: '/placeholder.svg',
      path: '/biology/blood-groups'
    },
    {
      id: 'catalase',
      title: 'Effect of Temperature on Catalase Activity',
      description: 'Investigate how temperature affects enzyme activity by observing catalase breaking down hydrogen peroxide into water and oxygen.',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      image: '/placeholder.svg',
      path: '/biology/catalase'
    },
    {
      id: 'pollen-germination',
      title: 'Pollen Germination on Stigma',
      description: 'Visualize and interact with the process of pollen grain germination on a flower stigma using microscope and SEM views.',
      difficulty: 'Intermediate',
      duration: '30 minutes',
      image: '/placeholder.svg',
      path: '/biology/pollen-germination'
    }
  ];

  const isExperimentCompleted = (experimentId: string) => 
    completedExperiments.includes(experimentId);

  const completionPercentage = 
    Math.round((completedExperiments.length / experiments.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Vibrant Header with science-themed background */}
      <div 
        className="bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'dna\' patternUnits=\'userSpaceOnUse\' width=\'40\' height=\'40\' patternTransform=\'rotate(45)\'%3E%3Cpath d=\'M 0,20 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0\' fill=\'none\' stroke=\'%2399f6e4\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23dna)\'/%3E%3C/svg%3E")'
        }}
      >
        <SiteHeader />
        
        <div className="container pt-16 pb-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">🔬 Biology Lab</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">Explore Life with Interactive Experiments</p>
            
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/biology/models">
                  <Microscope className="h-4 w-4" />
                  Explore 3D Biology Models
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* DNA helix decoration - absolute positioned */}
        <div className="absolute -bottom-12 left-0 right-0 h-24 opacity-20">
          <div className="w-full h-full bg-repeat-x" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'30\' viewBox=\'0 0 120 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M 0,15 C 40,5 80,25 120,15 L 120,30 L 0,30 Z\' fill=\'%2310b981\'/%3E%3C/svg%3E")',
              backgroundSize: '120px 30px'
            }}>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container py-8">
        {/* Progress Tracker */}
        <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Your Biology Journey</h2>
              <p className="text-gray-600">
                {completedExperiments.length} of {experiments.length} experiments completed
              </p>
            </div>
            
            <div className="w-full md:w-1/2">
              <Progress value={completionPercentage} className="h-3 bg-green-100" />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Advanced</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="font-semibold text-green-800">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Experiments</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((experiment) => {
            const isCompleted = isExperimentCompleted(experiment.id);
            
            return (
              <Card 
                key={experiment.id} 
                className={`overflow-hidden hover:shadow-lg transition-all ${
                  isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                }`}
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={experiment.image} 
                    alt={experiment.title}
                    className="w-16 h-16 opacity-30" 
                  />
                  
                  {/* Completed badge */}
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium rounded-full px-3 py-1 ${
                      experiment.difficulty === 'Beginner' 
                        ? 'bg-blue-100 text-blue-800' 
                        : experiment.difficulty === 'Intermediate'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                    }`}>
                      {experiment.difficulty}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {experiment.duration}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{experiment.title}</h3>
                  <p className="text-gray-600 text-sm">{experiment.description}</p>
                </CardContent>
                
                <CardFooter className="pt-0 flex justify-between">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm"
                    className={isCompleted ? "border-green-500 text-green-700 hover:bg-green-50" : ""}
                  >
                    <Link to={experiment.path}>
                      {isCompleted ? 'Review Experiment' : 'Start Experiment'}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {/* Floating Chat Bot */}
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-[350px]">
          <ChatBotMentor />
        </div>
      </main>
      
      <footer className="bg-white py-8 border-t">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="flex justify-center md:justify-start">
              <Link to="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Microscope className="h-6 w-6 text-lab-green" />
                <span>Science Lab AI</span>
              </Link>
            </div>
            
            <div className="flex justify-center gap-8">
              <Link to="/chemistry" className="flex flex-col items-center gap-2 text-gray-600 hover:text-lab-blue transition-colors">
                <Beaker className="h-6 w-6" />
                <span>Chemistry Lab</span>
              </Link>
              <Link to="/physics" className="flex flex-col items-center gap-2 text-gray-600 hover:text-lab-purple transition-colors">
                <Zap className="h-6 w-6" />
                <span>Physics Lab</span>
              </Link>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700">Your Achievements</p>
                <div className="flex gap-2 mt-2">
                  {completedExperiments.map((expId) => (
                    <div 
                      key={expId}
                      className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center"
                      title={experiments.find(e => e.id === expId)?.title || ''}
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Science Lab AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Biology;
