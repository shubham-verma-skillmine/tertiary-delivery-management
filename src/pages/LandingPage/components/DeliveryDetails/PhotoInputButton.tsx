type PhotoInputButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
};

const PhotoInputButton = ({
  onClick,
  disabled,
  children,
}: PhotoInputButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
                  flex flex-col items-center justify-center gap-2 h-16
                  border rounded-lg text-[13px] font-medium transition-all duration-150
                  ${
                    disabled
                      ? "border-border bg-muted text-muted-foreground/40 cursor-not-allowed"
                      : "border-dashed border-border hover:border-[#FFC107] hover:bg-amber-50 dark:hover:bg-amber-950/20 text-muted-foreground hover:text-amber-700 cursor-pointer bg-card"
                  }
                `}
    >
      {children}
    </button>
  );
};

export default PhotoInputButton;
