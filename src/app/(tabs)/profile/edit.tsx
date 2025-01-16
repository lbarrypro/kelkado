import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserProfiles } from '@/src/context/UserProfilesContext';
import { useAuth}  from "@/src/context/AuthContext";
import React from 'react';

const EditProfilePage = () => {
    const [profile, setProfile] = useState({
        username: '',
        birthdate: '',
        profile_picture: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { user: authUser } = useAuth(); // Récupère l'utilisateur authentifié
    const { userData, setUserData, getProfile, updateProfile } = useUserProfiles();

    useEffect(() => {
        // Récupère les données du profil utilisateur (remplace "userId" par l'ID actuel)
        const fetchProfile = async () => {
            try {
                if (!authUser) {
                    throw new Error('User not authenticated');
                }

                const data = await getProfile(authUser.id);
                setProfile(data);
            } catch (error) {
                console.error('EditProfilePage :: fetchProfile error:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (name: string, value: string) => {
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            await updateProfile(authUser.id, profile);

            // Mettez à jour les données utilisateur dans le contexte
            setUserData({ ...userData!, ...profile });
            router.back(); // Retourne à la page précédente
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={profile.username}
                onChangeText={(value) => handleChange('username', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Birthdate"
                value={profile.birthdate}
                onChangeText={(value) => handleChange('birthdate', value)}
            />
            <TextInput
                style={styles.input}
                placeholder="Profile Picture URL"
                value={profile.profile_picture}
                onChangeText={(value) => handleChange('profile_picture', value)}
            />
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Save Changes" onPress={handleSubmit} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
});

export default EditProfilePage;
