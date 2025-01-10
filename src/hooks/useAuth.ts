import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { User } from "@supabase/auth-js";

// Définir le type des valeurs retournées par le hook
interface UseAuthReturn {
    user: User | null; // Utilisateur ou null
    loading: boolean;  // Indicateur de chargement
    isVerified: boolean; // Indicateur de vérification de l'email
}

// Hook personnalisé pour accéder au contexte d'authentification
export function useAuth(): UseAuthReturn {
    // Accéder aux valeurs du contexte AuthContext
    const { user, loading, isVerified } = useContext(AuthContext);

    // Retourner les valeurs depuis le contexte
    return { user, loading, isVerified };
}
