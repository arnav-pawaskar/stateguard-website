/** Gradient mesh, masked grid and film grain. Purely decorative, behind everything. */
export function Atmosphere() {
  return (
    <>
      <div aria-hidden="true" className="sg-atmo sg-atmo--mesh" />
      <div aria-hidden="true" className="sg-atmo sg-atmo--grid" />
      <div aria-hidden="true" className="sg-atmo sg-atmo--grain" />
    </>
  );
}
