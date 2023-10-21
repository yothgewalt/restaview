import React from "react";

import { useRouter } from "next/router";

export default function Restaurants() {
    const router = useRouter();

    React.useEffect(() => {
        void (async () => {
            await router.push('/');
        })();
    }, [router])

    return null;
}
