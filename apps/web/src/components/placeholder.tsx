export function Placeholder({
  label,
  headline,
  detail,
}: {
  label: string;
  headline?: string;
  detail?: string;
}) {
  return (
    <div className="placeholder">
      {headline ? <span className="tile-headline poster">{headline}</span> : null}
      {detail ? <span className="tile-detail">{detail}</span> : null}
      <p className="tile-note">
        {label} This placeholder is not a photograph or video of the product.
      </p>
    </div>
  );
}
