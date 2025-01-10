import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { setItem, getItem, removeItem } from '../storage';

// Crée un contexte pour l'authentification
export const AuthContext = createContext();  // Exporter le contexte ici

// Le composant AuthProvider fournit l'état global de l'utilisateur
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isVerified, setIsVerified] = useState(false);

	// Fonction pour obtenir l'utilisateur actuel de Supabase
	const fetchUser = async () => {
		console.log('### AuthProvider :: fetchUser');

		// Essaie d'obtenir l'utilisateur depuis le stockage local
		const storedUser = await getItem('user');
		const storedToken = await getItem('token');

		console.log('### AuthProvider :: storedUser: ', storedUser);

		if (storedUser && storedToken) {
			const parsedUser = JSON.parse(storedUser); // Parse les données JSON
			setUser(parsedUser);
			setIsVerified(parsedUser.user_metadata?.email_verified ?? false);

			// Configure Supabase avec le token
			await supabase.auth.setSession({ access_token: storedToken });
			setLoading(false);
			return;
		}

		const { data, error } = await supabase.auth.getUser();

		console.log('### AuthProvider :: fetchUser :: data: ', data);

		if (data?.user) {
			setUser(data.user);
			setIsVerified(data.user.user_metadata.email_verified);

			// Stocke l'utilisateur et le token dans le stockage local
			const session = await supabase.auth.getSession();
			await setItem('user', JSON.stringify(data.user));
			await setItem('token', session?.data?.session?.access_token ?? '');
		} else {
			setUser(null);
			setIsVerified(false);
		}
		setLoading(false);
	};

	// Fonction de connexion
	const signIn = async (email, password) => {

		console.log('### AuthProvider :: signIn :: email:', email);
		console.log('### AuthProvider :: signIn :: password:', password);

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		console.log('### AuthProvider :: signIn :: data:', data);
		console.log('### AuthProvider :: signIn :: error:', error);

		if (error) {
			throw error;
		}
		setUser(data.user);
		setIsVerified(data.user.user_metadata.email_verified);

		// Après avoir appelé setUser et setIsVerified
		console.log('### AuthProvider :: signIn :: Après setUser', data.user);
		console.log('### AuthProvider :: signIn :: Après setIsVerified', data.user.user_metadata.email_verified);

		// Enregistrer les informations nécessaires dans le storage
		if (data.session) {
			await setItem('authToken', data.session.access_token); // Exemple avec le token
			await setItem('user', JSON.stringify(data.user)); // Exemple avec l'utilisateur
		}

		// Récupérer l'utilisateur après connexion pour garantir que l'état est bien à jour
		fetchUser();  // Ajout de cet appel pour être certain que l'utilisateur est récupéré et stocké
	};

	// Fonction d'inscription
	const signUp = async (email, password) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			throw error;
		}
		setUser(data.user);
		setIsVerified(data.user.user_metadata.email_verified);

		if (data.session) {
			await setItem('authToken', data.session.access_token); // Exemple avec le token
			await setItem('user', JSON.stringify(data.user)); // Exemple avec l'utilisateur
		}

		// Récupérer l'utilisateur après connexion pour garantir que l'état est bien à jour
		fetchUser();  // Ajout de cet appel pour être certain que l'utilisateur est récupéré et stocké

		return { data, error };
	};

	// Fonction de déconnexion
	const signOut = async () => {
		await supabase.auth.signOut();
		setUser(null);
		setIsVerified(false);
		await removeItem('authToken');
		await removeItem('user');
	};

	// Récupérer l'utilisateur actuel lors du montage du composant
	useEffect(() => {
		fetchUser();
		const { data: listener } = supabase.auth.onAuthStateChange(
			(_, session) => {

				console.log('### AuthProvider :: session: ', session);

				setUser(session?.user ?? null);
				setIsVerified(session?.user?.user_metadata?.email_verified ?? false);
			}
		);

		return () => {
			if (listener?.unsubscribe) {
				listener?.unsubscribe();
			}
		};
	}, []);

	return (
		<AuthContext.Provider value={{ user, isVerified, loading, signIn, signUp, signOut }}>
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
