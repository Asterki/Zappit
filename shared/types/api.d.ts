interface LoginBody {
    email: string;
    password: string;
    tfaCode: string | undefined
}

interface CheckUseBody {
    email: string;
    username: string;
}

interface RegisterBody {
    username: string;
    email: string;
    password: string;
    locale: "en" | "es" | "fr" | "de"
}

export type { LoginBody, CheckUseBody }