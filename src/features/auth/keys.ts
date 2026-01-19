export const authKeys = {
    all: ['auth'] as const,
    loginOrRegister: () => [...authKeys.all, 'login-or-register'] as const,
};
