// useAuth.js

import { useStorage  } from '@vueuse/core';

function initAuth() {
    localStorage.setItem('token', null);
    localStorage.setItem('user', null);
}

export function useAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    return {
        checkAuth: () => user !== null,

        getToken: () => token,
        setToken: (newToken) => {
            localStorage.setItem('token', newToken)
        },
        clearToken: () => {
            localStorage.setItem('token', null)
        },

        getUser: () => JSON.parse(user),
        setUser: (newUser) => {
            localStorage.setItem('user', newUser)
        },
        clearUser: () => {
            localStorage.setItem('user', null)
        },
    }
}