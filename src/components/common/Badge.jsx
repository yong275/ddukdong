export default function Badge({ variant = 'default', icon, children, style }) {
  const bg = variant === 'soft'
    ? { background: 'var(--surface-sunk)', color: 'var(--text-muted)' }
    : { background: 'var(--accent)', color: 'var(--text-on-accent)' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 'var(--radius-pill)',
      fontWeight: 700, fontSize: 'var(--fs-xs)',
      ...bg, ...style,
    }}>
      {icon && icon}
      {children}
    </span>
  );
}
