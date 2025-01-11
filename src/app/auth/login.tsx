import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSignup, setIsSignup] = useState(false); // Mode login ou signup
    const router = useRouter();

    // Utilisation des méthodes d'authentification via le hook useAuth
    const { signIn, signUp } = useAuth();

    const handleAuth = async () => {
        try {
            const { data, error } = isSignup
                ? await signUp(email, password)  // Utilisation de signUp
                : await signIn(email, password);  // Utilisation de signIn

            if (error) {
                setError(error.message);
                return;
            }

            if (data?.user) {
                // Rediriger si authentifié
                router.push('/(tabs)/home'); // Correspond à `app/(tabs)/home.tsx`
            } else if (isSignup) {
                setError('Vérifiez votre boîte mail pour confirmer votre inscription.');
            }
        } catch (err) {
            setError('Une erreur est survenue.');
        }
    };

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
