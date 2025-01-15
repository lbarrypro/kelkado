import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useUserProfiles } from "@/src/context/UserProfilesContext";
import logger from "@/src/utils/logger"; // Contexte d'authentification

interface User {
    id: string;
    name: string;
    email: string;
    verified: boolean;
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSignup, setIsSignup] = useState(false); // Mode login ou signup
    const [user, setUser] = useState<User | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const router = useRouter();

    // Utilisation des méthodes d'authentification via le hook useAuth
    const { authProvider, signIn, signUp } = useAuth();

    const useHandleAuth = (email: string, password: string) => {
        const { createProfile } = useUserProfiles();

        return async () => {
            setError(null);

            try {
                const { data, error } = isSignup
                    ? await signUp(email, password)
                    : await signIn(email, password);
                logger.info('Login :: useHandleAuth :: isSignup:', { isSignup, data, error });

                if (error) {
                    setError(error.message);
                    return;
                }

                if (data?.user) {
                    if (isSignup) {
                        logger.debug('Login :: useHandleAuth :: createProfile');
                        await createProfile({ id: data.user.id });
                    }

                    setUser(data.user);
                    logger.debug('Login :: useHandleAuth :: setUser');

                    setIsVerified(authProvider.verifiedUser(data.user));
                    logger.debug('Login :: useHandleAuth :: setIsVerified');

                    if (data?.session?.access_token && data?.session?.refresh_token) {
                        await authProvider.setSession(data.session.access_token, data.session.refresh_token);
                        logger.debug('Login :: useHandleAuth :: setSession');
                    }

                    // router.push('/(tabs)/home');
                }
            } catch (error) {
                setError('Une erreur est survenue.');
                logger.error('Login :: useHandleAuth :: Error:', error);
            }
        };
    };

    const handleAuth = useHandleAuth(email, password);

    /*
    const handleAuth = async () => {
        setError(null); // Réinitialiser l'erreur avant chaque tentative

        const { data, error } = isSignup
            ? await signUp(email, password) // Appelle signUp si `isSignup` est vrai
            : await signIn(email, password); // Appelle signIn sinon

        if (error) {
            setError(error.message);
            return;
        }

        if (data?.user) {
            if (isSignup) {
                // Ajouter un profil utilisateur
                const { createProfile } = useUserProfiles(); // Utilisation du hook
                const profile = await createProfile({
                    id: data.user.id
                });

                logger.debug('Login :: handleAuth :: createProfile :: profile: ', profile);

                // setError('Vérifiez votre boîte mail pour confirmer votre inscription.');
            }

            setUser(data.user);
            setIsVerified(authProvider.verifiedUser(data.user));

            logger.info('AuthProvider :: signUp :: Session configurée');

            if (data?.session?.access_token && data?.session?.refresh_token) {
                // Sauvegarder la session après la création de l'utilisateur
                await authProvider.setSession(data.session?.access_token, data.session?.refresh_token);
            }

            // Redirige l'utilisateur vers la page d'accueil après connexion
            router.push('/(tabs)/home');
        }
    };
    */

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignup ? 'Inscription' : 'Connexion'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button
                title={isSignup ? 'S\'inscrire' : 'Se connecter'}
                onPress={handleAuth}
            />
            <Text style={styles.switchText}>
                {isSignup ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                <Text style={styles.link} onPress={() => setIsSignup(!isSignup)}>
                    {isSignup ? ' Se connecter' : ' S\'inscrire'}
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    switchText: {
        textAlign: 'center',
        marginTop: 10,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});
