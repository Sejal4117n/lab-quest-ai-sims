
import React, { useState, useEffect, useRef } from 'react';
import { TestTube, FlaskConical, Beaker, Atom, Scale, Info, Zap, RotateCw, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

// Define types for our application
interface Chemical {
  id: string;
  name: string;
  formula: string;
  type: 'acid' | 'base' | 'metal' | 'gas' | 'salt' | 'oxidizer' | 'reducer';
  color: string;
  state: 'solid' | 'liquid' | 'gas';
  explosiveWith?: string[];
}

interface EquationComponent {
  id: string;
  chemical: Chemical;
  coefficient: number;
  side: 'reactant' | 'product';
}

// Chemical library
const chemicalLibrary: Chemical[] = [
  { id: 'na', name: 'Sodium', formula: 'Na', type: 'metal', color: '#C0C0C0', state: 'solid', explosiveWith: ['h2o'] },
  { id: 'h2o', name: 'Water', formula: 'H₂O', type: 'base', color: '#B3E5FC', state: 'liquid' },
  { id: 'hcl', name: 'Hydrochloric Acid', formula: 'HCl', type: 'acid', color: '#FFECB3', state: 'liquid' },
  { id: 'naoh', name: 'Sodium Hydroxide', formula: 'NaOH', type: 'base', color: '#E1BEE7', state: 'solid' },
  { id: 'h2', name: 'Hydrogen', formula: 'H₂', type: 'gas', color: '#F5F5F5', state: 'gas' },
  { id: 'o2', name: 'Oxygen', formula: 'O₂', type: 'gas', color: '#B3E5FC', state: 'gas' },
  { id: 'h2o2', name: 'Hydrogen Peroxide', formula: 'H₂O₂', type: 'oxidizer', color: '#E3F2FD', state: 'liquid' },
  { id: 'zn', name: 'Zinc', formula: 'Zn', type: 'metal', color: '#BDBDBD', state: 'solid' },
  { id: 'c2h2', name: 'Acetylene', formula: 'C₂H₂', type: 'gas', color: '#EEEEEE', state: 'gas', explosiveWith: ['o2'] },
  { id: 'co2', name: 'Carbon Dioxide', formula: 'CO₂', type: 'gas', color: '#F5F5F5', state: 'gas' },
];

// Known reactions for automatic balancing
const knownReactions = [
  {
    reactants: ['na', 'h2o'],
    products: ['naoh', 'h2'],
    balancedEquation: {
      reactants: [{ id: 'na', coefficient: 2 }, { id: 'h2o', coefficient: 2 }],
      products: [{ id: 'naoh', coefficient: 2 }, { id: 'h2', coefficient: 1 }]
    },
    explosive: true,
    reactionDescription: "Sodium reacts vigorously with water to produce sodium hydroxide and hydrogen gas."
  },
  {
    reactants: ['h2', 'o2'],
    products: ['h2o'],
    balancedEquation: {
      reactants: [{ id: 'h2', coefficient: 2 }, { id: 'o2', coefficient: 1 }],
      products: [{ id: 'h2o', coefficient: 2 }]
    },
    explosive: true,
    reactionDescription: "Hydrogen combines with oxygen to form water in an explosive reaction."
  },
  {
    reactants: ['zn', 'hcl'],
    products: ['h2'],
    balancedEquation: {
      reactants: [{ id: 'zn', coefficient: 1 }, { id: 'hcl', coefficient: 2 }],
      products: [{ id: 'h2', coefficient: 1 }]
    },
    explosive: false,
    reactionDescription: "Zinc reacts with hydrochloric acid to produce hydrogen gas."
  },
  {
    reactants: ['c2h2', 'o2'],
    products: ['co2', 'h2o'],
    balancedEquation: {
      reactants: [{ id: 'c2h2', coefficient: 2 }, { id: 'o2', coefficient: 5 }],
      products: [{ id: 'co2', coefficient: 4 }, { id: 'h2o', coefficient: 2 }]
    },
    explosive: true,
    reactionDescription: "Acetylene burns in oxygen to produce carbon dioxide and water in an explosive reaction."
  }
];

// Function to check if a reaction is explosive
function isExplosiveReaction(reactants: string[]): boolean {
  // Check if any chemical is explosive with another in the reactants
  for (const chemical of chemicalLibrary) {
    if (reactants.includes(chemical.id) && chemical.explosiveWith) {
      for (const explosiveWith of chemical.explosiveWith) {
        if (reactants.includes(explosiveWith)) {
          return true;
        }
      }
    }
  }

  // Check known explosive reactions
  for (const reaction of knownReactions) {
    if (reaction.explosive && 
        reaction.reactants.every(id => reactants.includes(id)) &&
        reactants.length === reaction.reactants.length) {
      return true;
    }
  }

  return false;
}

const VirtualChemistryLab: React.FC = () => {
  const [reactants, setReactants] = useState<EquationComponent[]>([]);
  const [products, setProducts] = useState<EquationComponent[]>([]);
  const [isBalanced, setIsBalanced] = useState<boolean | null>(null);
  const [reactionStatus, setReactionStatus] = useState<'idle' | 'reacting' | 'completed' | 'explosive'>('idle');
  const [reactionDescription, setReactionDescription] = useState<string>('');
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [draggingChemical, setDraggingChemical] = useState<Chemical | null>(null);
  
  const { toast } = useToast();
  const { theme } = useTheme();
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio references
  useEffect(() => {
    explosionSoundRef.current = new Audio('/sounds/explosion.mp3');
    return () => {
      if (explosionSoundRef.current) {
        explosionSoundRef.current.pause();
      }
    };
  }, []);

  // Handle drag start for chemicals
  const handleDragStart = (chemical: Chemical) => {
    setDraggingChemical(chemical);
  };

  // Handle drop on reactant or product side
  const handleDrop = (side: 'reactant' | 'product') => {
    if (draggingChemical) {
      const newComponent: EquationComponent = {
        id: `${draggingChemical.id}-${Date.now()}`,
        chemical: draggingChemical,
        coefficient: 1,
        side
      };

      if (side === 'reactant') {
        setReactants([...reactants, newComponent]);
      } else {
        setProducts([...products, newComponent]);
      }

      setDraggingChemical(null);
      setReactionStatus('idle');
      setIsBalanced(null);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Update coefficient
  const updateCoefficient = (id: string, increase: boolean) => {
    const updateArray = (components: EquationComponent[]) => {
      return components.map(comp => {
        if (comp.id === id) {
          return {
            ...comp,
            coefficient: increase ? comp.coefficient + 1 : Math.max(1, comp.coefficient - 1)
          };
        }
        return comp;
      });
    };

    setReactants(updateArray(reactants));
    setProducts(updateArray(products));
    setIsBalanced(null);
  };

  // Remove component
  const removeComponent = (id: string) => {
    setReactants(reactants.filter(r => r.id !== id));
    setProducts(products.filter(p => p.id !== id));
    setIsBalanced(null);
    setReactionStatus('idle');
  };

  // Check if equation is balanced
  const checkBalance = () => {
    // In a real application, this would be a complex function
    // that counts atoms on both sides of the equation
    // For now, we'll just simulate it with known reactions

    const reactantIds = reactants.map(r => r.chemical.id);
    const productIds = products.map(p => p.chemical.id);

    for (const reaction of knownReactions) {
      if (reaction.reactants.every(id => reactantIds.includes(id)) && 
          reaction.products.every(id => productIds.includes(id)) &&
          reactantIds.length === reaction.reactants.length &&
          productIds.length === reaction.products.length) {
        
        // Check if coefficients match the balanced equation
        const isMatch = reaction.balancedEquation.reactants.every(balancedR => {
          const r = reactants.find(r => r.chemical.id === balancedR.id);
          return r && r.coefficient === balancedR.coefficient;
        }) && reaction.balancedEquation.products.every(balancedP => {
          const p = products.find(p => p.chemical.id === balancedP.id);
          return p && p.coefficient === balancedP.coefficient;
        });

        setIsBalanced(isMatch);
        setReactionDescription(reaction.reactionDescription);
        return;
      }
    }

    setIsBalanced(false);
    setReactionDescription("Unknown reaction or equation is not balanced.");
  };

  // Auto balance the equation
  const autoBalance = () => {
    const reactantIds = reactants.map(r => r.chemical.id);
    
    for (const reaction of knownReactions) {
      if (reaction.reactants.every(id => reactantIds.includes(id)) && 
          reactantIds.length === reaction.reactants.length) {
        
        // Update reactants with balanced coefficients
        const updatedReactants = reactants.map(r => {
          const balancedR = reaction.balancedEquation.reactants.find(br => br.id === r.chemical.id);
          return {
            ...r,
            coefficient: balancedR ? balancedR.coefficient : r.coefficient
          };
        });

        // Create or update products
        const updatedProducts = reaction.balancedEquation.products.map(bp => {
          const existingProduct = products.find(p => p.chemical.id === bp.id);
          const chemical = chemicalLibrary.find(c => c.id === bp.id)!;
          
          if (existingProduct) {
            return {
              ...existingProduct,
              coefficient: bp.coefficient
            };
          } else {
            return {
              id: `${bp.id}-${Date.now()}`,
              chemical,
              coefficient: bp.coefficient,
              side: 'product' as const
            };
          }
        });

        setReactants(updatedReactants);
        setProducts(updatedProducts);
        setIsBalanced(true);
        setReactionDescription(reaction.reactionDescription);
        
        // Award a badge for using the auto-balance feature
        if (!earnedBadges.includes('auto-balancer')) {
          setEarnedBadges([...earnedBadges, 'auto-balancer']);
          toast({
            title: "Badge Earned!",
            description: "Auto-Balance Master: You've learned to let the computer do the hard work!",
          });
        }
        
        return;
      }
    }

    toast({
      title: "Unknown Reaction",
      description: "I don't know how to balance this reaction yet.",
      variant: "destructive"
    });
  };

  // Initiate reaction animation
  const startReaction = () => {
    if (reactants.length === 0) {
      toast({
        title: "No Reactants",
        description: "Add some chemicals to the reactants side first.",
        variant: "destructive"
      });
      return;
    }

    setReactionStatus('reacting');
    
    // Check if this is an explosive reaction
    const reactantIds = reactants.map(r => r.chemical.id);
    const isExplosive = isExplosiveReaction(reactantIds);
    
    setTimeout(() => {
      if (isExplosive) {
        setReactionStatus('explosive');
        // Play explosion sound
        if (explosionSoundRef.current) {
          explosionSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
        }
        
        // Award safety badge if they haven't earned it yet
        if (!earnedBadges.includes('safety-conscious')) {
          setEarnedBadges([...earnedBadges, 'safety-conscious']);
          toast({
            title: "Badge Earned!",
            description: "Safety First! You've encountered your first explosive reaction.",
          });
        }
      } else {
        setReactionStatus('completed');
        checkBalance();
      }
    }, 2000);
  };

  // Reset the experiment
  const resetExperiment = () => {
    setReactants([]);
    setProducts([]);
    setIsBalanced(null);
    setReactionStatus('idle');
    setReactionDescription('');
  };

  // Show a hint
  const showHint = () => {
    const reactantIds = reactants.map(r => r.chemical.id);
    
    for (const reaction of knownReactions) {
      if (reactantIds.some(id => reaction.reactants.includes(id))) {
        toast({
          title: "Reaction Hint",
          description: `Try combining ${reaction.reactants.map(id => {
            const chemical = chemicalLibrary.find(c => c.id === id);
            return chemical ? chemical.formula : id;
          }).join(' and ')} to create a known reaction.`,
        });
        return;
      }
    }

    toast({
      title: "Hint",
      description: "Try adding sodium (Na) and water (H₂O) to see an exciting reaction!",
    });
  };

  // Get color for chemical type
  const getTypeColor = (type: Chemical['type']) => {
    switch (type) {
      case 'acid': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'base': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'metal': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'gas': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'salt': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'oxidizer': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'reducer': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Virtual Chemistry Lab</h1>
          <p className="text-muted-foreground">
            Build and balance chemical equations, observe reactions, and learn chemistry concepts
          </p>

          {/* Badges Display */}
          {earnedBadges.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {earnedBadges.includes('auto-balancer') && (
                <Badge variant="secondary" className="pulse-badge">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Auto-Balance Master
                </Badge>
              )}
              {earnedBadges.includes('safety-conscious') && (
                <Badge variant="secondary" className="pulse-badge">
                  <TestTube className="w-3 h-3 mr-1" />
                  Safety Conscious
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Test Tube Shelf (Left Panel) */}
          <Card className="lg:col-span-3 p-4 overflow-hidden">
            <div className="flex items-center mb-4">
              <TestTube className="w-5 h-5 mr-2 text-lab-blue" />
              <h2 className="text-xl font-semibold">Chemical Shelf</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {chemicalLibrary.map((chemical) => (
                <div 
                  key={chemical.id}
                  draggable
                  onDragStart={() => handleDragStart(chemical)}
                  className={cn(
                    "flex items-center p-3 rounded-md cursor-grab transition-all",
                    "border border-border hover:shadow-md",
                    "bg-card hover:bg-accent/20",
                  )}
                >
                  <div 
                    className={cn(
                      "w-6 h-12 rounded-full mr-3 relative overflow-hidden",
                      chemical.state === 'liquid' && "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-3/4",
                      chemical.state === 'gas' && "before:absolute before:inset-0 before:opacity-50",
                      chemical.state === 'solid' && "before:absolute before:inset-0"
                    )}
                    style={{ 
                      borderColor: chemical.color,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      backgroundColor: theme === 'dark' ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                      position: 'relative'
                    }}
                  >
                    <div 
                      className="absolute bottom-0 left-0 right-0"
                      style={{ 
                        backgroundColor: chemical.color, 
                        height: chemical.state === 'liquid' ? '75%' : 
                                chemical.state === 'solid' ? '100%' : '0%',
                        opacity: chemical.state === 'gas' ? 0.3 : 1
                      }}
                    >
                      {chemical.state === 'gas' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                          <span className="text-xs">● ● ●</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm">{chemical.name}</div>
                    <div className="text-muted-foreground text-xs mb-1">{chemical.formula}</div>
                    <Badge variant="outline" className={cn("text-xs", getTypeColor(chemical.type))}>
                      {chemical.type.charAt(0).toUpperCase() + chemical.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Equation Builder (Center Panel) */}
          <Card className={cn(
            "lg:col-span-6 p-6",
            reactionStatus === 'explosive' && "animate-pulse border-red-500"
          )}>
            <div className="flex items-center mb-6">
              <Atom className="w-5 h-5 mr-2 text-lab-purple" />
              <h2 className="text-xl font-semibold">Equation Builder</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
              {/* Reactants Side */}
              <div 
                className="lg:col-span-2 min-h-[150px] border border-dashed border-border rounded-md p-4 flex flex-col"
                onDrop={() => handleDrop('reactant')}
                onDragOver={handleDragOver}
              >
                <div className="mb-2 text-center font-medium">Reactants</div>
                <div className="flex-1 flex flex-col gap-2">
                  {reactants.map((component) => (
                    <div 
                      key={component.id}
                      className={cn(
                        "flex items-center p-2 rounded-md border border-border",
                        reactionStatus === 'reacting' && "animate-pulse",
                        isBalanced === false && reactionStatus === 'completed' && "border-red-400"
                      )}
                    >
                      <div className="text-center mr-2">
                        <button 
                          onClick={() => updateCoefficient(component.id, true)} 
                          className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm"
                          disabled={reactionStatus !== 'idle'}
                        >
                          +
                        </button>
                        <span className="block my-1 font-mono">{component.coefficient}</span>
                        <button 
                          onClick={() => updateCoefficient(component.id, false)} 
                          className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm"
                          disabled={reactionStatus !== 'idle' || component.coefficient <= 1}
                        >
                          -
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-1"
                            style={{ backgroundColor: component.chemical.color }}
                          ></div>
                          <span className="font-medium">{component.chemical.formula}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{component.chemical.name}</div>
                      </div>
                      
                      <button 
                        onClick={() => removeComponent(component.id)}
                        className="text-muted-foreground hover:text-destructive"
                        disabled={reactionStatus !== 'idle'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {reactants.length === 0 && (
                    <div className="text-muted-foreground text-center text-sm flex-1 flex items-center justify-center italic">
                      Drag chemicals here
                    </div>
                  )}
                </div>
              </div>
              
              {/* Reaction Arrow */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="text-3xl">→</div>
                  {reactionStatus === 'explosive' && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-destructive font-bold text-sm animate-bounce">
                      ⚠️ BOOM!
                    </div>
                  )}
                  {reactionStatus === 'reacting' && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-foreground text-xs">
                      Reacting...
                    </div>
                  )}
                </div>
              </div>
              
              {/* Products Side */}
              <div 
                className="lg:col-span-2 min-h-[150px] border border-dashed border-border rounded-md p-4 flex flex-col"
                onDrop={() => handleDrop('product')}
                onDragOver={handleDragOver}
              >
                <div className="mb-2 text-center font-medium">Products</div>
                <div className="flex-1 flex flex-col gap-2">
                  {products.map((component) => (
                    <div 
                      key={component.id}
                      className={cn(
                        "flex items-center p-2 rounded-md border border-border",
                        reactionStatus === 'reacting' && "animate-pulse",
                        isBalanced === false && reactionStatus === 'completed' && "border-red-400"
                      )}
                    >
                      <div className="text-center mr-2">
                        <button 
                          onClick={() => updateCoefficient(component.id, true)} 
                          className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm"
                          disabled={reactionStatus !== 'idle'}
                        >
                          +
                        </button>
                        <span className="block my-1 font-mono">{component.coefficient}</span>
                        <button 
                          onClick={() => updateCoefficient(component.id, false)} 
                          className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm"
                          disabled={reactionStatus !== 'idle' || component.coefficient <= 1}
                        >
                          -
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-1"
                            style={{ backgroundColor: component.chemical.color }}
                          ></div>
                          <span className="font-medium">{component.chemical.formula}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{component.chemical.name}</div>
                      </div>
                      
                      <button 
                        onClick={() => removeComponent(component.id)}
                        className="text-muted-foreground hover:text-destructive"
                        disabled={reactionStatus !== 'idle'}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {products.length === 0 && reactionStatus !== 'explosive' && (
                    <div className="text-muted-foreground text-center text-sm flex-1 flex items-center justify-center italic">
                      Drag chemicals here or click "React"
                    </div>
                  )}
                  {reactionStatus === 'explosive' && (
                    <div className="relative h-full w-full flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="glass-broken">
                          <div className="crack-1"></div>
                          <div className="crack-2"></div>
                          <div className="crack-3"></div>
                          <div className="animate-bubble bg-orange-500/20 rounded-full w-8 h-8 absolute"></div>
                          <div className="animate-bubble delay-150 bg-orange-500/20 rounded-full w-10 h-10 absolute"></div>
                        </div>
                      </div>
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive z-10">
                        <div className="text-center font-bold">⚠️ Caution: Explosive Reaction!</div>
                        <div className="text-sm mt-1">This combination produces a dangerous reaction.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Balance Indicator */}
            {isBalanced !== null && reactionStatus === 'completed' && (
              <div className={cn(
                "mb-6 p-4 rounded-md border text-center",
                isBalanced 
                  ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-300" 
                  : "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300"
              )}>
                <div className="text-lg font-medium mb-1">
                  {isBalanced ? "✓ Equation is Balanced!" : "✗ Equation is Not Balanced"}
                </div>
                <p className="text-sm opacity-80">{reactionDescription}</p>
              </div>
            )}
            
            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={startReaction}
                disabled={reactionStatus !== 'idle' || reactants.length === 0}
                className="bg-lab-purple hover:bg-lab-purple/90"
              >
                <FlaskConical className="mr-2 h-4 w-4" />
                React
              </Button>
              <Button 
                variant="outline" 
                onClick={checkBalance}
                disabled={reactionStatus === 'reacting' || reactants.length === 0 || products.length === 0}
              >
                <Scale className="mr-2 h-4 w-4" />
                Check Balance
              </Button>
              <Button 
                variant="outline" 
                onClick={autoBalance}
                disabled={reactionStatus !== 'idle' || reactants.length === 0}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Auto Balance
              </Button>
              <Button 
                variant="outline"
                onClick={resetExperiment}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button 
                variant="ghost"
                onClick={showHint}
              >
                <Info className="mr-2 h-4 w-4" />
                Hint
              </Button>
            </div>
          </Card>

          {/* Reaction Feedback (Right Panel) */}
          <Card className="lg:col-span-3 p-4">
            <div className="flex items-center mb-4">
              <FlaskConical className="w-5 h-5 mr-2 text-lab-green" />
              <h2 className="text-xl font-semibold">Reaction Guide</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 border rounded-md border-border">
                <h3 className="font-medium mb-2">How to Use</h3>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Drag chemicals from the shelf to the Reactants section</li>
                  <li>Set the coefficients using + and - buttons</li>
                  <li>Click "React" to see what happens</li>
                  <li>Add expected products or use Auto Balance</li>
                  <li>Check if your equation is balanced correctly</li>
                </ol>
              </div>
              
              <div className="p-3 border rounded-md border-border">
                <h3 className="font-medium mb-2">Sample Reactions</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">Sodium + Water</div>
                    <div className="text-muted-foreground">2Na + 2H₂O → 2NaOH + H₂</div>
                  </div>
                  <div>
                    <div className="font-medium">Hydrogen + Oxygen</div>
                    <div className="text-muted-foreground">2H₂ + O₂ → 2H₂O</div>
                  </div>
                  <div>
                    <div className="font-medium">Zinc + Hydrochloric Acid</div>
                    <div className="text-muted-foreground">Zn + 2HCl → ZnCl₂ + H₂</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border rounded-md border-border">
                <h3 className="font-medium mb-2">Balancing Tips</h3>
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Count atoms on both sides of the equation</li>
                  <li>Start balancing with the most complex molecule</li>
                  <li>Balance metals first, then non-metals</li>
                  <li>Leave hydrogen and oxygen for last</li>
                  <li>Use the Auto Balance feature to check your work</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualChemistryLab;
