import React from 'react';
import { useLists } from '@/src/context/ListsContext';
import { useLocalSearchParams } from 'expo-router';
import DisplayList from '@/src/components/list/DisplayList';

export default function UserListScreen() {
    const { listId } = useLocalSearchParams();
    const { getListById, getProductsByList } = useLists();

    if (!listId) return null;

    return (
        <DisplayList
            listId={listId.toString()}
            getListById={getListById}
            getProductsByList={getProductsByList}
            canEdit={false} // Pas d'édition des listes des autres utilisateurs
        />
    );
}
