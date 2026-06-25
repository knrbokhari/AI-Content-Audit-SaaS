import { atom, } from 'jotai';

export const userAtom = atom({ user: {}, isAuthenticated: false, errors: null });