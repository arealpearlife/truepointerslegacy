import { buildComparison, type Product, type Selection } from "@truepointers/commerce";

export function ComparisonTable({
  legacy,
  flawless,
  selection,
}: {
  legacy: Product | null;
  flawless: Product | null;
  selection: Selection;
}) {
  const rows = buildComparison(legacy, flawless, selection);
  return (
    <section id="compare" className="comparison" aria-labelledby="comparison-title">
      <h2 id="comparison-title">Compare Legacy and Flawless</h2>
      <table>
        <caption className="caption">
          Verified product differences for the selected size and length.
        </caption>
        <thead>
          <tr>
            <th scope="col">Detail</th>
            <th scope="col">Legacy</th>
            <th scope="col">Flawless</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.legacy}</td>
              <td>{row.flawless}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
