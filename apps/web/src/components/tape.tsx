const words = ["LEGACY", "TRUE POINTERS", "HUNG LONG", "ICE", "THE ERA THAT LEFT A MARK"];

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
