import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGame } from './GameContext';
import { toast } from '@/hooks/use-toast';

export function WelcomePage() {
  const [name, setName] = useState('');
  const { dispatch } = useGame();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow alphanumeric characters
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      setName(value);
    } else {
      toast({
        title: "Invalid Character",
        description: "Only alphanumeric characters are allowed",
        variant: "destructive"
      });
    }
  };

  const handleStartGame = () => {
    if (name.trim().length === 0) {
      toast({
        title: "Name Required",
        description: "Please enter your name to start the game",
        variant: "destructive"
      });
      return;
    }
    
    if (name.trim().length < 2) {
      toast({
        title: "Name Too Short",
        description: "Name must be at least 2 characters long",
        variant: "destructive"
      });
      return;
    }

    dispatch({ type: 'SET_PLAYER_NAME', payload: name.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-secondary-foreground">🏏</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Guess & Toss Showdown
          </CardTitle>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A thrilling cricket-style guessing game where strategy meets luck!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground block">
              Enter Your Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Champion name here..."
              value={name}
              onChange={handleNameChange}
              className="text-lg py-3 bg-background/50 border-2 border-border focus:border-primary focus:bg-background transition-all duration-300"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              Alphanumeric characters only (letters and numbers)
            </p>
          </div>
          
          <Button 
            onClick={handleStartGame}
            variant="game"
            size="lg"
            className="w-full py-4 text-lg font-semibold"
            disabled={name.trim().length < 2}
          >
            🎮 Start Game
          </Button>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-foreground">How to Play:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Win the toss to choose attack or defense</li>
              <li>• Guess numbers 1-6 each turn</li>
              <li>• If numbers match, current player is OUT!</li>
              <li>• Otherwise, add your guess to your score</li>
              <li>• Highest score wins when someone gets out</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}