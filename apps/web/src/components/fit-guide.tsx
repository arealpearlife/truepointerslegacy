import { APPROVED_CHAIN_LENGTHS } from "@truepointers/commerce";
import { lengthLabel } from "@/lib/labels";

const SCALE = 16;
const CENTER = 190;
const NECK_NOTCH = 220;

export const fitDrops: Record<string, { drop: number; zone: string; detail: string }> = {
  "40 inches": {
    drop: 13,
    zone: "Mid-abs",
    detail: "Hangs about 13 inches below the neck notch, a few inches above the navel.",
  },
  "44 inches": {
    drop: 15,
    zone: "At the navel",
    detail: "Hangs about 15 inches below the neck notch, right at the navel.",
  },
  "48 inches": {
    drop: 17,
    zone: "Toward the waistband",
    detail: "Hangs about 17 inches below the neck notch, past the navel toward the waistband.",
  },
};

const references = [
  { label: "NECK NOTCH", drop: 0 },
  { label: "NAVEL", drop: 15.5 },
  { label: "WAISTBAND", drop: 18.5 },
];

function y(drop: number): number {
  return NECK_NOTCH + drop * SCALE;
}

function chainPath(bottom: number): string {
  return `M142 200 C116 270 150 ${bottom} ${CENTER} ${bottom} C230 ${bottom} 264 270 238 200`;
}

const leftHalf = [
  "M160 158 L146 196 C120 205 70 206 44 222 C22 232 14 262 16 300 L12 470",
  "M40 470 C44 420 50 360 66 314 Q70 310 72 318 C74 380 92 430 94 468 C95 495 88 530 86 600",
  "M150 214 C120 210 90 214 62 224",
  "M92 334 C120 372 160 376 186 362",
];

export function FitGuide({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect?: (length: string) => void;
}) {
  const lengths = APPROVED_CHAIN_LENGTHS.filter((length) => fitDrops[length]);
  return (
    <section id="fit" className="fit" aria-labelledby="fit-title">
      <header className="fit-head">
        <p className="eyebrow">Fit guide</p>
        <h2 id="fit-title" className="poster">
          Where it hits
        </h2>
        <p>
          Every Legacy length is built to hang long. Here is where each one lands on the body, so
          you know your drop before you buy.
        </p>
      </header>
      <div className="fit-body">
        <svg
          className="fit-figure"
          viewBox="-150 0 680 620"
          role="img"
          aria-labelledby="fit-figure-title"
        >
          <title id="fit-figure-title">
            Male torso outline showing where 40, 44, and 48 inch chains land
          </title>
          {references.map((reference) => (
            <g key={reference.label} className="fit-reference">
              <line x1={-150} x2={150} y1={y(reference.drop)} y2={y(reference.drop)} />
              <text x={-150} y={y(reference.drop) - 8}>
                {reference.label}
              </text>
            </g>
          ))}
          <g className="fit-outline">
            <path d="M190 22 C228 22 246 52 246 92 C246 126 234 150 214 162 C204 168 196 170 190 170 C184 170 176 168 166 162 C146 150 134 126 134 92 C134 52 152 22 190 22 Z" />
            {leftHalf.map((d) => (
              <path key={d} d={d} />
            ))}
            <g transform={`matrix(-1 0 0 1 ${CENTER * 2} 0)`}>
              {leftHalf.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <line x1={89} x2={291} y1={y(18.5)} y2={y(18.5)} />
            <circle cx={CENTER} cy={y(15.5)} r={3.5} />
          </g>
          {lengths.map((length, index) => {
            const bottom = y(fitDrops[length]!.drop);
            const isSelected = selected === length;
            return (
              <g
                key={length}
                className={`fit-chain chain-${index}${isSelected ? " is-selected" : ""}`}
              >
                <path d={chainPath(bottom)} />
                <line className="fit-leader" x1={CENTER + 8} x2={420} y1={bottom} y2={bottom} />
                <text x={428} y={bottom + 9}>
                  {lengthLabel(length)}
                </text>
              </g>
            );
          })}
        </svg>
        <ol className="fit-legend">
          {lengths.map((length, index) => {
            const fit = fitDrops[length]!;
            const content = (
              <>
                <span className={`fit-swatch chain-${index}`} aria-hidden="true" />
                <span className="fit-length poster">{lengthLabel(length)}</span>
                <span className="fit-zone">{fit.zone}</span>
                <span className="fit-detail">{fit.detail}</span>
              </>
            );
            return (
              <li key={length} className={selected === length ? "is-selected" : undefined}>
                {onSelect ? (
                  <button
                    type="button"
                    aria-pressed={selected === length}
                    onClick={() => onSelect(length)}
                  >
                    {content}
                  </button>
                ) : (
                  <div>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <p className="fit-note">
        Drawn to scale on a 5&apos;10&quot; frame with a 15.5 inch neck. On taller or broader builds
        the chain sits higher; on shorter or slimmer builds it sits lower.
      </p>
    </section>
  );
}
