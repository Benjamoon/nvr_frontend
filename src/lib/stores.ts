import { writable, type Writable } from "svelte/store";
import { persisted } from 'svelte-persisted-store'

interface Credentials {
    username: String,
    password: String,
    url: String
}

export const CredentialsStore: Writable<Credentials | false> = persisted("NVRCredentials", false)

interface CamerasObject {
    name: String,
    rtsp_address: String,
    logs: String[]
}

export const CamerasStore: Writable<CamerasObject[] | false> = writable(false)