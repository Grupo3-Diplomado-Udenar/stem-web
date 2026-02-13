export type AuthMode = "login" | "register-student" | "register-organization";

export interface AuthPageProps {
    onLoginSuccess?: (type: 'student' | 'organization') => void;
    onBackClick?: () => void;
    isModal?: boolean;
}
