import React, { createContext, useContext, useState, useEffect } from 'react';
import { Generation } from '../types/dashboard';
import { INITIAL_GENERATIONS } from '../constants/dashboard';

interface GenerationsContextType {
    generations: Generation[];
    addGeneration: (generation: Generation) => void;
    deleteGeneration: (id: string) => void;
    clearGenerations: () => void;
}

const GenerationsContext = createContext<GenerationsContextType | undefined>(undefined);

export const GenerationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [generations, setGenerations] = useState<Generation[]>(() => {
        const saved = localStorage.getItem('generations');
        return saved ? JSON.parse(saved) : INITIAL_GENERATIONS;
    });

    useEffect(() => {
        localStorage.setItem('generations', JSON.stringify(generations));
    }, [generations]);

    const addGeneration = (generation: Generation) => {
        setGenerations(prev => [generation, ...prev]);
    };

    const deleteGeneration = (id: string) => {
        setGenerations(prev => prev.filter(gen => gen.id !== id));
    };

    const clearGenerations = () => {
        setGenerations(INITIAL_GENERATIONS);
    };

    return (
        <GenerationsContext.Provider value={{ generations, addGeneration, deleteGeneration, clearGenerations }}>
            {children}
        </GenerationsContext.Provider>
    );
};

export const useGenerations = () => {
    const context = useContext(GenerationsContext);
    if (context === undefined) {
        throw new Error('useGenerations must be used within a GenerationsProvider');
    }
    return context;
};
