export function Patch({ className = "" }: { className?: string }) {
  return (
    <svg className={`patch ${className}`.trim()} viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="patch-ring" d="M100 100 m-70 0 a70 70 0 1 1 140 0 a70 70 0 1 1 -140 0" />
      </defs>
      <circle cx="100" cy="100" r="96" className="patch-base" />
      <circle cx="100" cy="100" r="88" className="patch-stitch" />
      <circle cx="100" cy="100" r="52" className="patch-core" />
      <g className="patch-spin">
        <text className="patch-ring-text">
          <textPath href="#patch-ring" startOffset="0">
            TRUE POINTERS ✦ LEGACY ✦ TRUE POINTERS ✦ LEGACY ✦
          </textPath>
        </text>
      </g>
      <text x="100" y="117" textAnchor="middle" className="patch-number">
        TP
      </text>
    </svg>
  );
}
