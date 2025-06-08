
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trophy, Clock, Target, Brain, Zap } from 'lucide-react';
import QuizModule from './QuizModule';
import { QuizResult } from '@/data/quizQuestions';

interface QuizLauncherProps {
  subject?: 'biology' | 'chemistry' | 'physics' | 'mixed';
  experimentName?: string;
  className?: string;
}

const QuizLauncher: React.FC<QuizLauncherProps> = ({ 
  subject = 'mixed',
  experimentName,
  className = ''
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  const handleQuizComplete = (result: QuizResult) => {
    setLastResult(result);
    // Here you could also save to localStorage or send to backend
    localStorage.setItem(`quiz_result_${Date.now()}`, JSON.stringify(result));
  };

  const getSubjectInfo = () => {
    switch (subject) {
      case 'biology':
        return {
          icon: '🔬',
          name: 'Biology',
          color: 'bg-green-50 border-green-200',
          questions: 10
        };
      case 'chemistry':
        return {
          icon: '⚗️',
          name: 'Chemistry',
          color: 'bg-blue-50 border-blue-200',
          questions: 10
        };
      case 'physics':
        return {
          icon: '⚛️',
          name: 'Physics',
          color: 'bg-purple-50 border-purple-200',
          questions: 10
        };
      default:
        return {
          icon: '📚',
          name: 'Mixed Science',
          color: 'bg-gradient-to-r from-green-50 to-purple-50 border-purple-200',
          questions: 30
        };
    }
  };

  if (showQuiz) {
    return (
      <div className={`${className} space-y-4`}>
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setShowQuiz(false)}
            variant="outline"
            size="sm"
          >
            ← Back to {experimentName || 'Experiments'}
          </Button>
        </div>
        <QuizModule 
          subject={subject}
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  const subjectInfo = getSubjectInfo();

  return (
    <Card className={`${className} ${subjectInfo.color} border-2`}>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <span className="text-3xl">{subjectInfo.icon}</span>
          Take the Test
        </CardTitle>
        <p className="text-gray-600">
          {experimentName 
            ? `Test your understanding of the ${experimentName} experiment and related ${subjectInfo.name.toLowerCase()} concepts.`
            : `Challenge yourself with ${subjectInfo.questions} questions covering ${subjectInfo.name.toLowerCase()} experiments.`
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quiz Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-sm font-medium">{subjectInfo.questions} Questions</div>
            <div className="text-xs text-gray-500">MCQ Format</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Clock className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-sm font-medium">Timed</div>
            <div className="text-xs text-gray-500">Track Progress</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-sm font-medium">Badges</div>
            <div className="text-xs text-gray-500">Earn Rewards</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Brain className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-sm font-medium">Smart</div>
            <div className="text-xs text-gray-500">Instant Feedback</div>
          </div>
        </div>

        {/* Last Result (if available) */}
        {lastResult && (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Last Result</h4>
              <Badge variant="outline">
                {Math.round((lastResult.correctAnswers / lastResult.totalQuestions) * 100)}%
              </Badge>
            </div>
            <div className="text-sm text-gray-600">
              {lastResult.correctAnswers}/{lastResult.totalQuestions} correct • 
              Completed in {Math.floor(lastResult.timeSpent / 60)}:{(lastResult.timeSpent % 60).toString().padStart(2, '0')}
              {lastResult.badge && (
                <span className="ml-2">• 🏆 {lastResult.badge}</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => setShowQuiz(true)}
            className="flex-1 flex items-center gap-2"
            size="lg"
          >
            <Zap className="h-5 w-5" />
            Start Quiz
          </Button>
          {subject === 'mixed' && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                // Could navigate to specific subject quizzes
                console.log('Navigate to subject-specific quiz');
              }}
            >
              Choose Subject
            </Button>
          )}
        </div>

        {/* Info Text */}
        <div className="text-xs text-gray-500 text-center">
          Questions are randomized each session • Immediate feedback available • Progress tracked
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizLauncher;
