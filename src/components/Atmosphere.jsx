/** Gradient mesh, masked grid and film grain. Purely decorative, behind everything. */
export function Atmosphere({ showGrid = true }) {
  return (
    <>
      <div aria-hidden="true" className="sg-atmo sg-atmo--mesh" />
      {showGrid && <div aria-hidden="true" className="sg-atmo sg-atmo--grid" />}
      <div aria-hidden="true" className="sg-atmo sg-atmo--grain" />
    </>
  );
}
