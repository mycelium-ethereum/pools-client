export interface AccountDropdownButtonProps {
    account: string;
    ensName: string | undefined;
    logout: () => void;
    navMenuOpen: boolean;
    buttonClasses?: string;
}
