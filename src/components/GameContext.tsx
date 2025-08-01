import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type GamePhase = 'welcome' | 'toss' | 'roleSelect' | 'playing' | 'gameOver';

export interface GameState {
  phase: GamePhase;
  playerName: string;
  isPlayerTurn: boolean;
  isPlayerAttacking: boolean;
  playerScore: number;
  computerScore: number;
  currentRound: number;
  gameResult: 'win' | 'lose' | null;
  tossResult: 'heads' | 'tails' | null;
  playerChoice: 'heads' | 'tails' | null;
  playerWonToss: boolean;
}

type GameAction = 
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'SET_TOSS_CHOICE'; payload: 'heads' | 'tails' }
  | { type: 'PERFORM_TOSS'; payload: 'heads' | 'tails' }
  | { type: 'SET_ROLE'; payload: 'attack' | 'defense' }
  | { type: 'START_GAME' }
  | { type: 'MAKE_GUESS'; payload: { playerGuess: number; computerGuess: number } }
  | { type: 'END_GAME'; payload: 'win' | 'lose' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  phase: 'welcome',
  playerName: '',
  isPlayerTurn: false,
  isPlayerAttacking: false,
  playerScore: 0,
  computerScore: 0,
  currentRound: 1,
  gameResult: null,
  tossResult: null,
  playerChoice: null,
  playerWonToss: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload, phase: 'toss' };
    
    case 'SET_TOSS_CHOICE':
      return { ...state, playerChoice: action.payload, phase: 'toss' };
    
    case 'PERFORM_TOSS':
      const playerWonToss = state.playerChoice === action.payload;
      return {
        ...state,
        tossResult: action.payload,
        playerWonToss,
        phase: 'roleSelect'
      };
    
    case 'SET_ROLE':
      const isAttacking = action.payload === 'attack';
      return {
        ...state,
        isPlayerAttacking: isAttacking,
        isPlayerTurn: isAttacking,
        phase: 'playing'
      };
    
    case 'START_GAME':
      return { ...state, phase: 'playing' };
    
    case 'MAKE_GUESS':
      const { playerGuess, computerGuess } = action.payload;
      const isMatch = playerGuess === computerGuess;
      
      if (isMatch) {
        // Current player is out - switch to other player or end game
        if (state.isPlayerTurn) {
          // Player is out, now computer's turn if this is first round
          if (state.currentRound === 1) {
            return {
              ...state,
              isPlayerTurn: false,
              currentRound: state.currentRound + 1
            };
          } else {
            // Both players have played, computer wins
            return {
              ...state,
              gameResult: 'lose',
              phase: 'gameOver'
            };
          }
        } else {
          // Computer is out - determine winner by score
          const gameResult = state.playerScore > state.computerScore ? 'win' : 'lose';
          return {
            ...state,
            gameResult,
            phase: 'gameOver'
          };
        }
      } else {
        // Add to score, same player continues
        const newPlayerScore = state.isPlayerTurn ? state.playerScore + playerGuess : state.playerScore;
        const newComputerScore = !state.isPlayerTurn ? state.computerScore + computerGuess : state.computerScore;
        
        return {
          ...state,
          playerScore: newPlayerScore,
          computerScore: newComputerScore
        };
      }
    
    case 'END_GAME':
      return { ...state, gameResult: action.payload, phase: 'gameOver' };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}