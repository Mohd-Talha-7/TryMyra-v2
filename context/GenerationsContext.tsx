import React, { createContext, useContext, useState, useEffect } from 'react';
import { Generation } from '../types/dashboard';
import { INITIAL_GENERATIONS } from '../constants/dashboard';
import { useUser } from '@clerk/clerk-react';

interface GenerationsContextType {
    generations: Generation[];
    addGeneration: (generation: Generation) => void;
    deleteGeneration: (id: string) => void;
    clearGenerations: () => void;
    isLoading: boolean;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
const GenerationsContext = createContext<GenerationsContextType | undefined>(undefined);

export const GenerationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGenerations = async () => {
            if (!user?.id) {
                setGenerations(INITIAL_GENERATIONS);
                setIsLoading(false);
                return;
            };

            try {
                const response = await fetch(`${API_URL}/generations/${user.id}`);
                const data = await response.json();
                setGenerations(data.length > 0 ? data : INITIAL_GENERATIONS);
            } catch (err) {
                console.error('Failed to fetch generations:', err);
                setGenerations(INITIAL_GENERATIONS);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGenerations();
    }, [user?.id]);

    const addGeneration = async (generation: Generation) => {
        const genWithUserId = { ...generation, userId: user?.id };
        try {
            console.log(`Attempting to save generation to: ${API_URL}/generations`);
            const response = await fetch(`${API_URL}/generations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(genWithUserId)
            });
            console.log(`Response status: ${response.status}`);
            if (response.ok) {
                console.log('Generation saved successfully to backend');
                setGenerations(prev => [generation, ...prev]);
            } else {
                const errorData = await response.json();
                console.error('Backend save failed:', errorData);
                setGenerations(prev => [generation, ...prev]);
            }
        } catch (err) {
            console.error('Failed to save generation:', err);
            // Fallback to optimistic update if server is down (optional)
            setGenerations(prev => [generation, ...prev]);
        }
    };

    const deleteGeneration = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/generations/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setGenerations(prev => prev.filter(gen => gen.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete generation:', err);
        }
    };

    const clearGenerations = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${API_URL}/generations/user/${user.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setGenerations(INITIAL_GENERATIONS);
            }
        } catch (err) {
            console.error('Failed to clear generations:', err);
        }
    };

    return (
        <GenerationsContext.Provider value={{ generations, addGeneration, deleteGeneration, clearGenerations, isLoading }}>
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
