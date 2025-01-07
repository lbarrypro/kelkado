import React, { createContext, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

// Créer le contexte
const SupabaseContext = createContext(supabase);

// Créer un provider pour rendre l'instance Supabase disponible
export const SupabaseProvider = ({ children }) => (
	<SupabaseContext.Provider value={supabase}>
		{children}
	</SupabaseContext.Provider>
);

// Hook personnalisé pour accéder à Supabase
export const useSupabase = () => {
	const context = useContext(SupabaseContext);
	if (!context) throw new Error('useSupabase must be used within a SupabaseProvider');
	return context;
};
