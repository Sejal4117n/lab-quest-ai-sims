
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import SiteHeader from '@/components/layout/SiteHeader';
import QuizLauncher from '@/components/quiz/QuizLauncher';

const Quiz = () => {
  const { subject } = useParams();
  const [searchParams] = useSearchParams();
  const experiment = searchParams.get('experiment');

  const validSubject = subject && ['biology', 'chemistry', 'physics'].includes(subject) 
    ? subject as 'biology' | 'chemistry' | 'physics'
    : 'mixed';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <SiteHeader />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Science Quiz Challenge
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your knowledge with our comprehensive science quiz
          </p>
        </div>
        
        <QuizLauncher 
          subject={validSubject}
          experimentName={experiment || undefined}
          className="max-w-4xl mx-auto"
        />
      </main>
      
      <footer className="bg-white dark:bg-gray-900 py-6 border-t dark:border-gray-800">
        <div className="container text-center text-gray-500 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Science Lab AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Quiz;
