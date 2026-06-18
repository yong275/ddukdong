const variantStyles = {
  primary: 'bg-[--primary] text-[--text-on-primary] hover:bg-[--primary-hover]',
  secondary:
    'bg-[--surface] text-[--text] border border-[--border-strong] hover:bg-[--surface-sunk]',
  accent: 'bg-[--accent] text-[--text-on-accent] hover:bg-[--accent-hover]',
  ghost: 'bg-transparent text-[--text-muted] hover:text-[--text]',
};

const sizeStyles = {
  sm: 'px-[18px] py-[9px] text-sm',
  md: 'px-[26px] py-[13px] text-base',
  lg: 'px-[34px] py-[16px] text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[999px] font-semibold ' +
    'transition-all duration-150 hover:-translate-y-px active:translate-y-0 ' +
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const classes = [
    base,
    variantStyles[variant] ?? variantStyles.primary,
    sizeStyles[size] ?? sizeStyles.md,
    block ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
