declare const LangPack: {
    accounts: {
        login: {
            pageTitle: string;
            pageDescription: string;
            topBar: string;
            title: string;
            form: {
                emailOrUsername: string;
                password: string;
                login: string;
                register: string;
            };
            tfaForm: {
                title: string;
                tfa: string;
                submit: string;
                back: string;
            };
            register: string;
            forgotPassword: string;
            errors: {
                'invalid-credentials': string;
                'missing-parameters': string;
                'rate-limit': string;
                'invalid-tfa-code': string;
                disabled: string;
                "": string;
            };
        };
        register: {
            pageTitle: string;
            pageDescription: string;
            locale: string;
            topBar: string;
            title: string;
            register: string;
            footer: string;
            emailForm: {
                username: string;
                usernameDescription: string;
                email: string;
                next: string;
            };
            passwordForm: {
                password: string;
                passwordDescription: string;
                confirmPassword: string;
                register: string;
            };
            errors: {
                'missing-parameters': string;
                'mismatching-passwords': string;
                'invalid-email': string;
                'invalid-username': string;
                'invalid-username-length': string;
                'invalid-password-length': string;
                'email-in-use': string;
                'username-in-use': string;
                'err-username-or-email-taken': string;
                'rate-limit': string;
                'password-strength': string;
                "": "";
            };
        };
    };
    main: {
        home: {
            title: string;
            topBar: string;
        };
    };
    profile: {
        index: {
            title: string;
        };
    };
    settings: {
        index: {
            title: string;
        };
        privacy: {
            title: string;
        };
        security: {
            title: string;
        };
    };
};
export default LangPack;
