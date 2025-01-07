import { useState, useEffect } from 'react';

// Typage de la réponse de fetch
interface FetchResponse<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
}

// Hook générique de récupération de données
function useFetch<T>(url: string): FetchResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                const result: T = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Erreur inconnue');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, error, isLoading };
}

export default useFetch;
