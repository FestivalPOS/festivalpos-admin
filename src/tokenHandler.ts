import axios from 'axios'

const storageTokenName = 'token';

// Function to set authorization token
export function updateAuthToken(token: string | null): void
{
    if (token !== null) {
        localStorage.setItem(storageTokenName, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

export function getAuthToken(): string | null
{
    return localStorage.getItem(storageTokenName);
}

export function clearAuthToken(): void
{
    localStorage.removeItem(storageTokenName);
    updateAuthToken(getAuthToken());
}