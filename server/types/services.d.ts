import { User } from "../../shared/types/models";

export interface RegisterUserReturnType {
    error: "err-username-or-email-taken" | null;
    user: User | null;
}