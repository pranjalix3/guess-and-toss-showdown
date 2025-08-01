import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from './GameContext';
import { toast } from '@/hooks/use-toast';

export function GamePage() {
  const [playerGuess, setPlayerGuess] = useState<number | null>(null);
  const [computerGuess, setComputerGuess] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showComputerThinking, setShowComputerThinking] = useState(false);
  const { state, dispatch } = useGame();

  // Handle computer turn automatically - only generate computer's guess
  useEffect(() => {
    if (!state.isPlayerTurn && state.phase === 'playing' && !isRevealing && !computerGuess) {
      setShowComputerThinking(true);
      
      setTimeout(() => {
        const compGuess = Math.floor(Math.random() * 6) + 1;
        setComputerGuess(compGuess);
        setShowComputerThinking(false);
      }, 2000);
    }
  }, [state.isPlayerTurn, state.phase, isRevealing, computerGuess, dispatch]);

  const handleNumberClick = (number: number) => {
    if (isRevealing) return;
    
    if (state.isPlayerTurn) {
      // Player's turn - player guesses, computer responds
      setPlayerGuess(number);
      setIsRevealing(true);
      setShowComputerThinking(true);
      
      setTimeout(() => {
        const compGuess = Math.floor(Math.random() * 6) + 1;
        setComputerGuess(compGuess);
        setShowComputerThinking(false);
        
        setTimeout(() => {
          dispatch({ 
            type: 'MAKE_GUESS', 
            payload: { 
              playerGuess: number, 
              computerGuess: compGuess 
            } 
          });
          
          setTimeout(() => {
            setPlayerGuess(null);
            setComputerGuess(null);
            setIsRevealing(false);
          }, 1500);
        }, 1500);
      }, 1000);
    } else {
      // Computer's turn - computer already guessed, player tries to match
      setPlayerGuess(number);
      setIsRevealing(true);
      
      setTimeout(() => {
        dispatch({ 
          type: 'MAKE_GUESS', 
          payload: { 
            playerGuess: number, 
            computerGuess: computerGuess! 
          } 
        });
        
        setTimeout(() => {
          setPlayerGuess(null);
          setComputerGuess(null);
          setIsRevealing(false);
        }, 1500);
      }, 1500);
    }
  };

  const getCurrentPlayerName = () => {
    return state.isPlayerTurn ? state.playerName : 'Computer';
  };

  const numbers = [1, 2, 3, 4, 5, 6];

  if (state.phase === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-secondary to-secondary/80 rounded-full mx-auto flex items-center justify-center shadow-xl animate-glow-pulse">
              <span className="text-4xl">
                {state.gameResult === 'win' ? '🏆' : '💔'}
              </span>
            </div>
            <CardTitle className="text-3xl font-bold">
              {state.gameResult === 'win' ? 'You Won!' : 'You Lost!'}
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              {state.gameResult === 'win' 
                ? 'Congratulations on your victory!' 
                : 'Better luck next time!'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-center">Final Scores</h3>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{state.playerName}</p>
                  <p className="text-2xl font-bold text-primary">{state.playerScore}</p>
                </div>
                <div className="text-2xl">VS</div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Computer</p>
                  <p className="text-2xl font-bold text-destructive">{state.computerScore}</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => dispatch({ type: 'RESET_GAME' })}
              variant="game"
              size="lg"
              className="w-full py-4 text-lg"
            >
              🎮 Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Game Status Header */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{state.playerName}</p>
                <p className="text-3xl font-bold text-primary">{state.playerScore}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Round {state.currentRound}</p>
                <p className="text-xl font-semibold">VS</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Computer</p>
                <p className="text-3xl font-bold text-destructive">{state.computerScore}</p>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <Badge variant={state.isPlayerTurn ? "default" : "secondary"} className="text-sm px-4 py-2">
                {getCurrentPlayerName()}'s Turn
              </Badge>
              <p className="text-sm text-muted-foreground">
                Role: {state.isPlayerAttacking ? 'Attacking' : 'Defending'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Game Action Area */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {state.isPlayerTurn 
                ? 'Choose Your Number' 
                : computerGuess 
                  ? `Computer chose ${computerGuess}! Choose your number to match`
                  : 'Computer is Thinking...'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Number Selection */}
            {(state.isPlayerTurn || (!state.isPlayerTurn && computerGuess)) && !isRevealing && (
              <div className="grid grid-cols-3 gap-4">
                {numbers.map((number) => (
                  <Button
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    variant="number"
                    className="aspect-square text-2xl hover:animate-bounce-number"
                  >
                    {number}
                  </Button>
                ))}
              </div>
            )}
            
            {/* Reveal Phase */}
            {isRevealing && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{state.playerName}</p>
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-xl mx-auto flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-primary-foreground">
                        {playerGuess}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Computer</p>
                    <div className="w-20 h-20 bg-gradient-to-br from-destructive to-destructive/80 rounded-xl mx-auto flex items-center justify-center shadow-lg">
                      {showComputerThinking ? (
                        <div className="animate-spin text-2xl">🤔</div>
                      ) : (
                        <span className="text-3xl font-bold text-destructive-foreground">
                          {computerGuess}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {computerGuess && (
                  <div className="text-center">
                    {playerGuess === computerGuess ? (
                      <p className="text-xl font-bold text-destructive">
                        🚫 Match! {getCurrentPlayerName()} is OUT!
                      </p>
                    ) : (
                      <p className="text-lg text-muted-foreground">
                        ✅ No match! {playerGuess} added to {getCurrentPlayerName()}'s score
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Computer Turn Display */}
            {!state.isPlayerTurn && !isRevealing && (
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-destructive to-destructive/80 rounded-xl mx-auto flex items-center justify-center shadow-lg">
                  <div className="animate-spin text-3xl">🤔</div>
                </div>
                <p className="text-muted-foreground">Computer is making its move...</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Game Rules Reminder */}
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-sm">Quick Rules</h3>
              <p className="text-xs text-muted-foreground">
                Same number = Current player OUT • Different numbers = Add to score • Highest score wins!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}