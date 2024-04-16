import { CredentialsStore } from "$lib/stores"
import { get } from "svelte/store"


/** @type {import('./$types').PageLoad} */
export async function load({url, fetch}) {
    let creds = get(CredentialsStore);

    if (!creds) {
        return {
            files: {}
        }
    }

    let path = url.pathname.replace("/recordings", "").replace("/", "")
    let totalPath = `${creds.url}/recordings/${path}`.replace(/\/$/, ""); //Path, without trailing /

    let res = await fetch(totalPath, {
        headers: {
            ["Authorization"]: `Basic ${window.btoa(creds.username + ":" + creds.password)}`
        }
    })

    if (res.status != 200) {
        // Bad request, assume creds are wrong.
        CredentialsStore.set(false);

        return {
            files: {}
        }
    }
    
    let result
    if (res.headers.get("content-type") == "video/mp4") {
        result = await res.blob()
    } else {
        result = await res.json()
    }

    return {
        files: result,
        currentPath: url.pathname
    }
}