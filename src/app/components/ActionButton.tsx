interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function ActionButton({ children, onClick, variant = "primary" }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="backdrop-blur-md bg-white/20 hover:bg-white/30 transition-all rounded-xl px-6 py-3 text-white font-medium text-base"
    >
      {children}
    </button>
  );
}
