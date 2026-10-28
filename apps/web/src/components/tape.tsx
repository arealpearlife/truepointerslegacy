const words = ["LEGACY", "TRUE POINTERS", "LOW HANG", "ICE", "HITS LAST FOREVER"];

export function Tape({ tone = "cherry" }: { tone?: "cherry" | "ice" }) {
  const run = [...words, ...words, ...words];
  return (
    <div className={`tape tape-${tone}`} aria-hidden="true">
      <div className="tape-track">
        {run.map((word, index) => (
          <span key={index}>
            {word}
            <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
