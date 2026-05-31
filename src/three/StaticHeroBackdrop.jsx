export default function StaticHeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124, 92, 255, 0.10), transparent 60%), radial-gradient(ellipse 60% 40% at 70% 60%, rgba(34, 211, 238, 0.06), transparent 70%), #05060A',
      }}
    />
  );
}
