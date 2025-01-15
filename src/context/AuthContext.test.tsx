import React from 'react'; // Assurez-vous d'importer React ici
import { Button, Text } from 'react-native'; // Assurez-vous d'importer Button de 'react-native'
import { fireEvent, render, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { cleanup } from '@testing-library/react-native';

afterEach(() => {
    cleanup();
});

/*
jest.mock('@/src/context/AuthContext', () => {
    const React = require('react');
    const mockAuthContext = React.createContext();

    return {
        AuthProvider: ({ children }) => (
            <mockAuthContext.Provider
                value={{
                    user: null, // L'état initial de l'utilisateur
                    signIn: jest.fn(async () => {
                        console.log('signIn called');
                        return {
                            user: { email: 'test@example.com' },
                            session: { access_token: 'fake-access-token', refresh_token: 'fake-refresh-token' },
                        };
                    }),
                    signOut: jest.fn(async () => {
                        // Réinitialise l'utilisateur
                    }),
                    getCurrentUser: jest.fn(async () => ({ id: '123', email: 'test@example.com' })),
                    verifiedUser: jest.fn((user) => user.email === 'test@example.com'),
                    setSession: jest.fn(() => {
                        // Simule la configuration de session
                    }),
                    onAuthStateChange: jest.fn(() => {
                        // Simule un écouteur d'état
                    }),
                }}
            >
                {children}
            </mockAuthContext.Provider>
        ),
        useAuth: () => React.useContext(mockAuthContext),
    };
});
*/

jest.mock('@/src/context/AuthContext', () => {
    const React = require('react');
    const mockAuthContext = React.createContext();

    return {
        AuthProvider: ({ children }) => {
            const [user, setUser] = React.useState(null);

            const signIn = jest.fn(async () => {
                const mockUser = { email: 'test@example.com', password: 'blablabla' };
                setUser(mockUser);
                return { user: mockUser };
            });

            const signOut = jest.fn(async () => {
                setUser(null);
            });

            return (
                <mockAuthContext.Provider
                    value={{ user, signIn, signOut }}
                >
                    {children}
                </mockAuthContext.Provider>
            );
        },
        useAuth: () => React.useContext(mockAuthContext),
    };
});

// Composant de test pour utiliser le contexte
const TestComponent = () => {
    const { user, signIn, signOut } = useAuth();

    console.log('TestComponent :: user: ', user);

    return (
        <>
            <Text testID="user-email">{user?.email || 'No User'}</Text>
            <Button testID="sign-in-btn" onPress={() => signIn('test@example.com', 'password')} title="Sign In" />
            <Button testID="sign-out-btn" onPress={signOut} title="Sign Out" />
        </>
    );
};

describe('AuthContext', () => {
    it('should update user after signIn', async () => {
        const { getByTestId, getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Vérifie que l'utilisateur est initialement déconnecté
        expect(getByTestId('user-email').props.children).toBe('No User');

        // Simule l'appui sur le bouton Sign In
        await act(async () => {
            fireEvent.press(getByText('Sign In'));
        });

        // Vérifie que l'utilisateur est mis à jour
        expect(getByTestId('user-email').props.children).toBe('test@example.com');
    });

    it('should clear user after signOut', async () => {
        const { getByTestId, getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        // Simule une connexion
        await act(async () => {
            fireEvent.press(getByText('Sign In'));
        });

        // Vérifie que l'utilisateur est connecté
        expect(getByTestId('user-email').props.children).toBe('test@example.com');

        // Simule une déconnexion
        await act(async () => {
            fireEvent.press(getByText('Sign Out'));
        });

        // Vérifie que l'utilisateur est déconnecté
        expect(getByTestId('user-email').props.children).toBe('No User');
    });
});
