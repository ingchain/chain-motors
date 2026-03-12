import { useEffect } from "react";

import { getAuthState } from "../../stores/authStore";

type Props = {
    requiredRole: "client" | "admin";
};

export default function AuthRoleGate({ requiredRole }: Props) {
    useEffect(() => {
        const state = getAuthState();
        if (!state) {
            window.location.href = "/auth/login";
            return;
        }

        if (state.user.role !== requiredRole) {
            window.location.href = "/";
        }
    }, [requiredRole]);

    return null;
}
