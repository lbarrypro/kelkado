import React from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {View, Text, TouchableOpacity} from 'react-native';
import DisplayProfile from '@/src/components/user/DisplayProfile';
import Ionicons from "@expo/vector-icons/Ionicons";

const UserProfileScreen = () => {
    const { userId } = useLocalSearchParams(); // Remplace `useRouter()` par `useLocalSearchParams()`

    if (!userId) {
        return <Text>Profil introuvable</Text>;
    }

    return (
        <>
            {/* Ajout du header avec le bouton retour */}
            <Stack.Screen
                options={{
                    title: `Retour`,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View>
                <DisplayProfile userId={userId as string} />
            </View>
        </>
    );
};

export default UserProfileScreen;
