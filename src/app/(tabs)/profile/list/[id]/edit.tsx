import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLists } from "@/src/context/ListsContext";
import logger from "@/src/utils/logger";
import React from 'react';

export default function EditList() {
    const { id } = useLocalSearchParams();
    const { getListById, updateList } = useLists();
    const router = useRouter();

    const [listData, setListData] = useState({
        title: '',
        description: '',
        visibility: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                if (!id) {
                    throw new Error('Missing List ID');
                }

                const fetchedList = await getListById(id as string);
                logger.info('EditList :: fetchList :: fetchedList:', fetchedList);

                setListData({
                    title: fetchedList?.title || '',
                    description: fetchedList?.description || '',
                    visibility: fetchedList?.visibility || '',
                });
            } catch (error) {
                console.error('Failed to fetch list:', error);
                setError('Failed to load list details.');
            }
        };

        fetchList();
    }, [id]);

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!id) {
                throw new Error('Missing List ID');
            }

            await updateList(id as string, listData);
            router.back();
        } catch (error) {
            console.error('Failed to update list:', error);
            setError('Failed to update the list.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!id) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No List ID provided.</Text>
            </View>
        );
    }

    if (!listData.title && !isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="List Name"
                value={listData.title || ''} // Valeur par défaut pour éviter les erreurs
                onChangeText={(value) => setListData({ ...listData, title: value })}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={listData.description || ''}
                onChangeText={(value) => setListData({ ...listData, description: value })}
            />
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <Button title="Save Changes" onPress={handleSave} />
            )}
        </View>
    );
}

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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
