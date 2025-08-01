import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from './GameContext';

export function TossPage() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { state, dispatch } = useGame();

  const handleTossChoice = (choice: 'heads' | 'tails') => {
    dispatch({ type: 'SET_TOSS_CHOICE', payload: choice });
  };

  const performToss = () => {
    if (!state.playerChoice) return;
    
    setIsFlipping(true);
    setShowResult(false);
    
    // Simulate coin flip animation
    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      dispatch({ type: 'PERFORM_TOSS', payload: result });
      setIsFlipping(false);
      setShowResult(true);
    }, 2000);
  };

  if (state.phase === 'roleSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold">
              {state.playerWonToss ? '🎉 You Won the Toss!' : '😔 You Lost the Toss'}
            </CardTitle>
            <p className="text-muted-foreground">
              {state.playerWonToss 
                ? 'Choose your strategy!' 
                : 'Computer gets to choose first, then you pick the opposite role.'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {state.playerWonToss ? (
              <div className="space-y-3">
                <Button
                  onClick={() => dispatch({ type: 'SET_ROLE', payload: 'attack' })}
                  variant="game"
                  size="lg"
                  className="w-full py-4"
                >
                  ⚔️ Choose Attack (Play First)
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'SET_ROLE', payload: 'defense' })}
                  variant="toss"
                  size="lg"
                  className="w-full py-4"
                >
                  🛡️ Choose Defense (Play Second)
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Computer chose:</p>
                  <p className="font-semibold text-lg">Defense (Playing Second)</p>
                </div>
                <Button
                  onClick={() => dispatch({ type: 'SET_ROLE', payload: 'attack' })}
                  variant="game"
                  size="lg"
                  className="w-full py-4"
                >
                  ⚔️ You Get Attack (Play First)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold">
            Welcome {state.playerName}! 🏏
          </CardTitle>
          <p className="text-muted-foreground">
            Time for the toss! Choose heads or tails
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!state.playerChoice ? (
            <div className="space-y-3">
              <Button
                onClick={() => handleTossChoice('heads')}
                variant="toss"
                size="lg"
                className="w-full py-4 text-lg"
              >
                🪙 Heads
              </Button>
              <Button
                onClick={() => handleTossChoice('tails')}
                variant="toss"
                size="lg"
                className="w-full py-4 text-lg"
              >
                🪙 Tails
              </Button>
            </div>
          ) : !isFlipping && !showResult ? (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">You chose:</p>
                <p className="font-semibold text-xl capitalize">{state.playerChoice}</p>
              </div>
              <Button
                onClick={performToss}
                variant="game"
                size="lg"
                className="w-full py-4 text-lg"
              >
                🎯 Flip the Coin!
              </Button>
            </div>
          ) : isFlipping ? (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary/80 rounded-full mx-auto flex items-center justify-center animate-coin-flip shadow-xl">
                <span className="text-4xl">🪙</span>
              </div>
              <p className="text-lg font-medium text-muted-foreground">
                Flipping the coin...
              </p>
            </div>
          ) : null}
          
          {showResult && (
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary/80 rounded-full mx-auto flex items-center justify-center shadow-xl">
                <span className="text-4xl">🪙</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Result:</p>
                <p className="font-bold text-2xl capitalize text-primary">
                  {state.tossResult}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}