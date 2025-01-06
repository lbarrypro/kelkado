import { supabase } from '@/lib/supabase';

export const useAuthActions = () => {
    const signIn = async (email: string, password: string) => {

        console.log('### useAuthActions :: signIn :: email: ', email);
        console.log('### useAuthActions :: signIn :: password: ', password);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        console.log('### useAuthActions :: signIn :: data: ', JSON.stringify(data, null, 2));
        console.log('### useAuthActions :: signIn :: error: ', JSON.stringify(error, null, 2));

        return { data, error };
    };

    const signUp = async (email: string, password: string) => {

        console.log('### useAuthActions :: signUp :: email: ', email);
        console.log('### useAuthActions :: signUp :: password: ', password);

        const { data, error } = await supabase.auth.signUp({ email, password });

        console.log('### useAuthActions :: signUp :: data: ', JSON.stringify(data, null, 2));
        console.log('### useAuthActions :: signUp :: error: ', JSON.stringify(error, null, 2));

        return { data, error };
    };

    return { signIn, signUp };
};
