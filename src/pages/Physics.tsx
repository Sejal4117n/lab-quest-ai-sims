import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PhysicsHeader from '@/components/physics/PhysicsHeader';
import ExperimentCard from '@/components/physics/ExperimentCard';
import ProgressTracker from '@/components/physics/ProgressTracker';
import PhysicsFooter from '@/components/physics/PhysicsFooter';
import PhysicsChatBot from '@/components/physics/PhysicsChatBot';
import { experiments } from '@/data/physicsExperiments';
import { useToast } from "@/hooks/use-toast";
import { Rocket, Target, ChartBar } from 'lucide-react';

const Physics = () => {
  const { toast } = useToast();
  // Track completed experiments (would connect to user data in a real app)
  const [completedExperiments, setCompletedExperiments] = useState<string[]>([]);
  
  // Convert experiments data for display
  const experimentsList = Object.entries(experiments).map(([id, data]) => ({
    id,
    title: data.title,
    description: data.description,
    difficulty: data.difficulty,
    duration: data.duration,
    completed: completedExperiments.includes(id)
  }));
  
  // Featured experiment - we'll highlight the projectile simulation
  const featuredExperiment = experimentsList.find(exp => exp.id === 'projectile');
  
  // Other experiments
  const otherExperiments = experimentsList.filter(exp => exp.id !== 'projectile');
  
  // Check if we've unlocked bonus challenges
  const showBonusChallenge = completedExperiments.length >= 3;
  
  // Show toast for unlock (would be triggered when a third experiment is completed)
  React.useEffect(() => {
    if (completedExperiments.length === 3) {
      toast({
        title: "🎉 Bonus Challenge Unlocked!",
        description: "You've completed 3 experiments! Try the Quantum Physics challenge.",
      });
    }
  }, [completedExperiments.length, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <PhysicsHeader />
        
        {/* Featured Experiment Section */}
        {featuredExperiment && (
          <Card className="mb-10 overflow-hidden hover:shadow-lg transition-shadow border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-start md:items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-4">
                  <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="text-2xl font-bold dark:text-gray-50">
                      {featuredExperiment.title}
                    </h3>
                    <span className="ml-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium rounded px-2 py-1">
                      NEW
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
                    Explore statistical distributions in projectile motion with our interactive simulation. 
                    Launch projectiles with various sample sizes and see how the Central Limit Theorem works in practice!
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                      <Link to={`/physics/${featuredExperiment.id}`}>
                        Start Experiment
                      </Link>
                    </Button>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Target className="w-4 h-4" />
                      <span>{featuredExperiment.difficulty}</span>
                      <span className="mx-1">•</span>
                      <span>{featuredExperiment.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex space-x-2">
                <ChartBar className="w-12 h-12 text-blue-400 dark:text-blue-500" />
                <Target className="w-12 h-12 text-purple-400 dark:text-purple-500" />
                <Rocket className="w-12 h-12 text-green-400 dark:text-green-500" />
              </div>
            </div>
          </Card>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-blue-600 rounded-full"></span>
              Available Experiments
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {otherExperiments.map((experiment) => (
                <ExperimentCard
                  key={experiment.id}
                  {...experiment}
                  image="/placeholder.svg"
                />
              ))}
              
              {showBonusChallenge && (
                <div className="col-span-full bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 text-white shadow-glow animate-pulse-badge mt-4">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span className="text-cyan-300">✨</span> Bonus Challenge Unlocked!
                  </h3>
                  <p className="mb-4">You've completed enough experiments to access advanced physics challenges.</p>
                  <button className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-md transition-colors">
                    Explore Quantum Physics
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-blue-600 rounded-full"></span>
              Your Progress
            </h2>
            <div className="space-y-6">
              <ProgressTracker 
                completedExperiments={completedExperiments.length} 
                totalExperiments={Object.keys(experiments).length} 
              />
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Did You Know?</h3>
                <p className="text-sm text-gray-700">
                  The Central Limit Theorem states that when independent random variables 
                  are added, their properly normalized sum tends toward a normal distribution, 
                  even if the original variables are not normally distributed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <PhysicsFooter />
      <PhysicsChatBot />
    </div>
  );
};

export default Physics;
