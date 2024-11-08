export interface ButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export interface StartButtonProps {
  onClick: () => void;
  isStart: boolean;
}
