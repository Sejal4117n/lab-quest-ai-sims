
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy, Clock, Target, Award } from 'lucide-react';
import { quizQuestions, QuizQuestion, QuizResult, badges, Badge as QuizBadge } from '@/data/quizQuestions';
import { useToast } from '@/hooks/use-toast';

interface QuizModuleProps {
  subject?: 'biology' | 'chemistry' | 'physics' | 'mixed';
  onComplete?: (result: QuizResult) => void;
}

const QuizModule: React.FC<QuizModuleProps> = ({ 
  subject = 'mixed',
  onComplete 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<QuizBadge[]>([]);
  const { toast } = useToast();

  // Initialize quiz with randomized questions
  useEffect(() => {
    initializeQuiz();
  }, [subject]);

  // Timer effect
  useEffect(() => {
    if (!quizStartTime || showResults) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStartTime, showResults]);

  const initializeQuiz = () => {
    let questionsToUse: QuizQuestion[] = [];
    
    if (subject === 'mixed') {
      // Get 10 questions from each subject for mixed quiz
      const biologyQuestions = quizQuestions.filter(q => q.subject === 'biology').slice(0, 10);
      const chemistryQuestions = quizQuestions.filter(q => q.subject === 'chemistry').slice(0, 10);
      const physicsQuestions = quizQuestions.filter(q => q.subject === 'physics').slice(0, 10);
      questionsToUse = [...biologyQuestions, ...chemistryQuestions, ...physicsQuestions];
    } else {
      questionsToUse = quizQuestions.filter(q => q.subject === subject);
    }

    // Shuffle questions
    const shuffled = [...questionsToUse].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setSelectedAnswers(new Array(shuffled.length).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setQuizStartTime(new Date());
    setTimeElapsed(0);
    setEarnedBadges([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return answer === shuffledQuestions[index]?.correctAnswer ? count + 1 : count;
    }, 0);

    // Calculate subject-specific scores
    const biologyScore = selectedAnswers.reduce((count, answer, index) => {
      const question = shuffledQuestions[index];
      return question?.subject === 'biology' && answer === question.correctAnswer ? count + 1 : count;
    }, 0);

    const chemistryScore = selectedAnswers.reduce((count, answer, index) => {
      const question = shuffledQuestions[index];
      return question?.subject === 'chemistry' && answer === question.correctAnswer ? count + 1 : count;
    }, 0);

    const physicsScore = selectedAnswers.reduce((count, answer, index) => {
      const question = shuffledQuestions[index];
      return question?.subject === 'physics' && answer === question.correctAnswer ? count + 1 : count;
    }, 0);

    // Determine earned badges
    const newBadges: QuizBadge[] = [];
    
    if (correctAnswers === shuffledQuestions.length) {
      newBadges.push(badges.find(b => b.id === 'perfect_score')!);
    }
    
    if (biologyScore >= 8) {
      newBadges.push(badges.find(b => b.id === 'biology_master')!);
    }
    
    if (chemistryScore >= 8) {
      newBadges.push(badges.find(b => b.id === 'chemistry_expert')!);
    }
    
    if (physicsScore >= 8) {
      newBadges.push(badges.find(b => b.id === 'physics_genius')!);
    }
    
    if (correctAnswers >= 24) {
      newBadges.push(badges.find(b => b.id === 'well_rounded')!);
    }
    
    if (timeElapsed < 600) { // Less than 10 minutes
      newBadges.push(badges.find(b => b.id === 'speed_demon')!);
    }

    setEarnedBadges(newBadges);

    return {
      correctAnswers,
      biologyScore,
      chemistryScore,
      physicsScore,
      badges: newBadges
    };
  };

  const finishQuiz = () => {
    const results = calculateResults();
    setShowResults(true);

    const quizResult: QuizResult = {
      timestamp: new Date().toISOString(),
      totalQuestions: shuffledQuestions.length,
      correctAnswers: results.correctAnswers,
      subject,
      timeSpent: timeElapsed,
      badge: results.badges[0]?.name
    };

    // Show toast for badges
    if (results.badges.length > 0) {
      toast({
        title: '🎉 Badge Earned!',
        description: `You earned: ${results.badges.map(b => b.name).join(', ')}`,
      });
    }

    onComplete?.(quizResult);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (shuffledQuestions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  if (showResults) {
    const results = calculateResults();
    const percentage = Math.round((results.correctAnswers / shuffledQuestions.length) * 100);

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(results.correctAnswers, shuffledQuestions.length)}`}>
              {results.correctAnswers}/{shuffledQuestions.length}
            </div>
            <div className="text-lg text-gray-600">
              {percentage}% • {formatTime(timeElapsed)}
            </div>
          </div>

          {/* Subject Breakdown */}
          {subject === 'mixed' && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl">🔬</div>
                <div className="font-semibold">Biology</div>
                <div className={getScoreColor(results.biologyScore, 10)}>
                  {results.biologyScore}/10
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl">⚗️</div>
                <div className="font-semibold">Chemistry</div>
                <div className={getScoreColor(results.chemistryScore, 10)}>
                  {results.chemistryScore}/10
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl">⚛️</div>
                <div className="font-semibold">Physics</div>
                <div className={getScoreColor(results.physicsScore, 10)}>
                  {results.physicsScore}/10
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-3 flex items-center justify-center gap-2">
                <Award className="h-5 w-5" />
                Badges Earned
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {earnedBadges.map((badge) => (
                  <Badge key={badge.id} className="text-lg p-3">
                    <span className="mr-2">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button onClick={initializeQuiz} variant="outline">
              Take Quiz Again
            </Button>
            <Button onClick={() => window.history.back()}>
              Back to Experiments
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {currentQuestion.subject.charAt(0).toUpperCase() + currentQuestion.subject.slice(1)}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="text-sm text-gray-500 mb-2">
            {currentQuestion.experiment}
          </div>
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestionIndex] === index && (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
          >
            {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizModule;
