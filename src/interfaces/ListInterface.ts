import React from "react";

export interface List {
    id: string;
    user_id: string;
    title: string;
    description: string;
    visibility: 'private' | 'public';
    created_at: string;
}

export interface ListsContextType {
    lists: List[]; // Toutes les listes chargées
    setLists: React.Dispatch<React.SetStateAction<List[]>>; // Mise à jour de l'état local
    fetchUserLists: (userId: string) => Promise<void>;
    fetchPublicLists: () => Promise<void>;
    createList: (userId: string, title: string, description: string, visibility: 'private' | 'public') => Promise<List>;
    updateList: (listId: string, title: string, description: string, visibility: 'private' | 'public') => Promise<List>;
    deleteList: (listId: string) => Promise<void>;
}
