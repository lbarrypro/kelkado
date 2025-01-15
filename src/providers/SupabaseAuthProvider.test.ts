import { SupabaseAuthProvider } from '@/src/providers/SupabaseAuthProvider';
import { cleanup } from '@testing-library/react-native';

afterEach(() => {
    cleanup();
});

// Mock de Supabase
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            signUp: jest.fn(async () => ({ data: { user: { id: '123', email: 'test@example.com' } }, error: null })),
            signInWithPassword: jest.fn(async () => ({ data: { user: { id: '123', email: 'test@example.com' } }, error: null })),
            signOut: jest.fn(async () => ({ error: null })),
        },
    })),
}));

describe('SupabaseAuthProvider', () => {
    let authProvider: SupabaseAuthProvider;

    beforeEach(() => {
        authProvider = new SupabaseAuthProvider();
    });

    it('should sign up a user successfully', async () => {
        const response = await authProvider.signUp('test@example.com', 'password');
        expect(response?.data?.user?.email).toBe('test@example.com');
    });

    it('should sign in a user successfully', async () => {
        const response = await authProvider.signIn('test@example.com', 'password');
        expect(response?.data?.user?.email).toBe('test@example.com');
    });

    it('should sign out a user successfully', async () => {
        await expect(authProvider.signOut()).resolves.not.toThrow();
    });
});
