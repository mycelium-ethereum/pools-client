export interface OnboardModalProps {
    onboardStep: number;
    setOnboardStep: React.Dispatch<React.SetStateAction<number>>;
    showOnboardModal: boolean;
    setShowOnboardModal: () => any;
}

export interface ProgressIndicatorProps {
    totalSteps: number;
    currentStep: number;
}
