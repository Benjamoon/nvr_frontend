import { get } from "svelte/store";
import type { PageLoad } from "./$types";
import { AuthStore } from "$lib/nvr";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async () => {
    const authData = get(AuthStore)

    if (authData != false) {
        redirect(303, "/_/")
    }
};