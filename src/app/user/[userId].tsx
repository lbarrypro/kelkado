import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import DisplayProfile from '@/src/components/user/DisplayProfile';

const UserProfileScreen = () => {
    const { userId } = useLocalSearchParams(); // Remplace `useRouter()` par `useLocalSearchParams()`

    if (!userId) {
        return <Text>Profil introuvable</Text>;
    }

    return (
        <View>
            <DisplayProfile userId={userId as string} />
        </View>
    );
};

export default UserProfileScreen;
