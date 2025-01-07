import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// Crée un contexte pour l'authentification
const AuthContext = createContext();

// Le composant AuthProvider fournit l'état global de l'utilisateur
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isVerified, setIsVerified] = useState(false);

	// Fonction pour obtenir l'utilisateur actuel de Supabase
	const fetchUser = async () => {
		const { data, error } = await supabase.auth.getUser();
		if (data?.user) {
			setUser(data.user);
			setIsVerified(data.user.email_verified);
		} else {
			setUser(null);
			setIsVerified(false);
		}
		setLoading(false);
	};

	// Fonction de connexion
	const signIn = async (email, password) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			throw error;
		}
		setUser(data.user);
		setIsVerified(data.user.email_verified);
	};

	// Fonction de déconnexion
	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsVerified(false);
	};

	// Récupérer l'utilisateur actuel lors du montage du composant
	useEffect(() => {
		fetchUser();
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_, session) => {
				setUser(session?.user ?? null);
				setIsVerified(session?.user?.email_verified ?? false);
			}
		);

		return () => {
			listener?.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, isVerified, loading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom Hook pour accéder au contexte d'authentification
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
