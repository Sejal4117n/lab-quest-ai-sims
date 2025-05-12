
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/layout/SiteHeader';
import { Bookmark, Clock, FlaskConical, Atom, Battery, Zap, Beaker, FlaskRound, TestTube } from 'lucide-react';

const Chemistry = () => {
  const experiments = [
    {
      id: 'catalyst',
      title: 'Catalyst Reaction',
      description: 'Investigate how catalysts increase the rate of chemical reactions without being consumed in the process.',
      difficulty: 'Intermediate',
      duration: '25 minutes',
      image: '/placeholder.svg',
      featured: true,
      icon: <Atom className="w-8 h-8 text-purple-500" />
    },
    {
      id: 'electrolysis',
      title: 'Electrolysis of Water',
      description: 'Split water into hydrogen and oxygen gases by passing an electric current through water.',
      difficulty: 'Intermediate',
      duration: '40 minutes',
      image: '/placeholder.svg',
      featured: true,
      icon: <Battery className="w-8 h-8 text-blue-500" />
    },
    {
      id: 'flame-test',
      title: 'Flame Test',
      description: 'Identify metal ions based on the characteristic color they produce when heated in a flame.',
      difficulty: 'Beginner',
      duration: '25 minutes',
      image: '/placeholder.svg',
      icon: <FlaskConical className="w-8 h-8 text-orange-500" />
    },
    {
      id: 'acid-base',
      title: 'Acid-Base Titration',
      description: 'Determine the concentration of an acid or base by neutralizing it with a standard solution of known concentration.',
      difficulty: 'Intermediate',
      duration: '35 minutes',
      image: '/placeholder.svg'
    },
    {
      id: 'baking-soda',
      title: 'Vinegar and Baking Soda Reaction',
      description: 'Observe an acid-base reaction that produces carbon dioxide gas through the reaction of vinegar with baking soda.',
      difficulty: 'Beginner',
      duration: '20 minutes',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <SiteHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">Chemistry Experiments</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Explore the fascinating world of chemical reactions and transformations</p>
        </div>
        
        {/* Virtual Chemistry Lab Card */}
        <Card className="mb-10 overflow-hidden hover:shadow-lg transition-shadow border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 dark:border-purple-800/50">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <TestTube className="w-8 h-8 text-purple-700 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold mb-1 dark:text-gray-50">Interactive Equation Builder</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Build and balance chemical equations with realistic reactions and explosive effects
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  <Link to="/chemistry/virtual-lab">
                    Build Chemical Equations
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <FlaskRound className="w-12 h-12 text-purple-400 dark:text-purple-500" />
              <FlaskConical className="w-12 h-12 text-blue-400 dark:text-blue-500" />
              <Beaker className="w-12 h-12 text-green-400 dark:text-green-500" />
            </div>
          </div>
        </Card>
        
        {/* Chemistry Lab Card */}
        <Card className="mb-10 overflow-hidden hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800/50 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                <Beaker className="w-8 h-8 text-purple-700 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold mb-1 dark:text-gray-50">Virtual Chemistry Lab</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Experience our interactive lab environment with realistic chemical reactions and experiments
                </p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  <Link to="/chemistry/lab">
                    Enter Virtual Lab
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <FlaskRound className="w-12 h-12 text-purple-400 dark:text-purple-500" />
              <FlaskConical className="w-12 h-12 text-blue-400 dark:text-blue-500" />
              <Beaker className="w-12 h-12 text-green-400 dark:text-green-500" />
            </div>
          </div>
        </Card>
        
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {experiments
            .filter(exp => exp.featured)
            .map((experiment) => (
              <Card key={experiment.id} className="overflow-hidden hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800/30">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    {experiment.icon || (
                      <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                        <FlaskConical className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-xl font-bold mb-1 dark:text-gray-50">{experiment.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium rounded px-2 py-1 mr-2">
                          {experiment.difficulty}
                        </span>
                        <Clock className="h-3 w-3 mr-1" />
                        {experiment.duration}
                      </div>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-bold rounded-full px-3 py-1">
                    Featured
                  </span>
                </div>
                <CardContent className="pt-6">
                  <p className="text-gray-700 dark:text-gray-300">{experiment.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between bg-white dark:bg-transparent">
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                    <Link to={`/chemistry/${experiment.id}`}>
                      Start Experiment
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments
            .filter(exp => !exp.featured)
            .map((experiment) => (
              <Card key={experiment.id} className="overflow-hidden hover:shadow-lg transition-shadow dark:border-gray-800">
                <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {experiment.icon ? (
                    <div className="flex items-center justify-center w-full h-full bg-opacity-10 bg-blue-50 dark:bg-opacity-10 dark:bg-blue-900">
                      {experiment.icon}
                    </div>
                  ) : (
                    <img 
                      src={experiment.image} 
                      alt={experiment.title}
                      className="w-16 h-16 opacity-30" 
                    />
                  )}
                </div>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-lab-blue dark:bg-blue-900 dark:text-blue-200 text-xs font-medium rounded px-2 py-1">
                      {experiment.difficulty}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {experiment.duration}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">{experiment.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{experiment.description}</p>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <Button asChild variant="outline" size="sm" className="dark:border-gray-700 dark:hover:bg-gray-800">
                    <Link to={`/chemistry/${experiment.id}`}>
                      Start Experiment
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 py-6 border-t dark:border-gray-800">
        <div className="container text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Science Lab AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Chemistry;
