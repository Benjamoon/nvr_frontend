import axios, { type AxiosRequestConfig, type ResponseType } from 'axios';
import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'

/**
 * Makes a HTTP GET request to a specified API endpoint using basic authentication.
 * @param endpoint The API endpoint to which the request will be sent.
 * @param username The username for basic authentication.
 * @param password The password for basic authentication.
 * @returns Promise with the response data.
 */
export async function MakeNVRRequest(endpoint: string, username: string, password: string, type: ResponseType = "json"): Promise<any> {
    try {
        const response = await axios.get(endpoint, {
            auth: {
                username,
                password
            },
            responseType: type
        });
        return response.data;
    } catch (error) {
        // Handle errors, possibly rethrow or log
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
            return Promise.reject(error.message);
        } else {
            console.error('Unexpected error:', error);
            return Promise.reject('An unexpected error occurred');
        }
    }
}

/**
 * Extracts the root of a URL (including protocol, hostname, and port).
 * @param inputUrl The full URL provided by the user.
 * @returns The root part of the URL.
 */
export function getRootUrl(inputUrl: string): string {
    try {
        const url = new URL(inputUrl);
        // Build the root URL by combining protocol, hostname, and port
        return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
    } catch (error) {
        console.error('Invalid URL:', error);
        return 'Invalid URL';
    }
}




interface AuthData {
    url: string;
    username: string;
    password: string;
}

export const AuthStore = persisted<AuthData | false>("auth", false);



export function extractFirstFPSFromLogArray(logs: string[]): number | null {
    // Regular expression to find the fps pattern
    const fpsPattern = /fps=\s*(\d+)/;

    // Iterate over each log entry
    for (let log of logs) {
        const match = log.match(fpsPattern);
        // If a match is found, return the first group (the fps number) converted to a number
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
    }

    // If no match is found in any log entry, return null
    return null;
}