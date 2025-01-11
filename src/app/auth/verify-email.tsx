import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useAuth } from '@/src/context/AuthContext'; // Importation du hook personnalisé
import logger from '@/src/utils/logger';

export default function VerifyEmail() {
    const { authProvider } = useAuth(); // Utilisation du hook personnalisé
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResendEmail = async () => {
        try {
            logger.info(`Tentative de renvoi d'email de confirmation à ${email}`);

            await authProvider.resendConfirmationEmail(email); // Appel de la méthode abstraite

            setMessage('Email de confirmation renvoyé. Veuillez vérifier votre boîte de réception.');
            logger.info('Email de confirmation renvoyé avec succès');
        } catch (err) {
            setError('Une erreur est survenue lors de l\'envoi de l\'email.');
            logger.error('Une erreur est survenue dans handleResendEmail', err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Veuillez vérifier votre adresse email. Si vous n'avez pas reçu l'email, vous pouvez le renvoyer ci-dessous.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Adresse email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Renvoyer l'email" onPress={handleResendEmail} />
            {message && <Text style={styles.message}>{message}</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
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
    message: {
        color: 'green',
        marginTop: 10,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});
