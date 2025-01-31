import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { useUserProfiles } from "@/src/context/UserProfilesContext";
import logger from "@/src/utils/logger";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importer l'icône

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSignup, setIsSignup] = useState(false);
    const [secureText, setSecureText] = useState(true); // État pour afficher/masquer le mot de passe

    const router = useRouter();
    const { authProvider, setUser, setIsVerified, signIn, signUp } = useAuth();

    const useHandleAuth = (email: string, password: string) => {
        const { createProfile } = useUserProfiles();

        return async () => {
            setError(null);
            try {
                const { data, error } = isSignup ? await signUp(email, password) : await signIn(email, password);
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
                    setIsVerified(authProvider.verifiedUser(data.user));

                    if (data?.session?.access_token && data?.session?.refresh_token) {
                        await authProvider.setSession(data.session.access_token, data.session.refresh_token);
                    }

                    router.push('/(tabs)/home');
                }
            } catch (error) {
                setError('Une erreur est survenue.');
                logger.error('Login :: useHandleAuth :: Error:', error);
            }
        };
    };

    const handleAuth = useHandleAuth(email, password);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignup ? 'Inscription' : 'Connexion'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Champ mot de passe avec icône pour afficher/masquer */}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText}
                />
                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <Icon
                        name={secureText ? "eye-off" : "eye"} // Icône dynamique
                        size={24}
                        color="gray"
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
            <Button title={isSignup ? "S'inscrire" : "Se connecter"} onPress={handleAuth} />
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    eyeIcon: {
        marginLeft: 5,
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
