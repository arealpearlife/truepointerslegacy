import { marketing } from "@truepointers/commerce";

const sparkles = [
  { top: "8%", left: "6%", delay: "0s" },
  { top: "62%", left: "22%", delay: "1.1s" },
  { top: "14%", left: "48%", delay: "0.5s" },
  { top: "70%", left: "71%", delay: "1.7s" },
  { top: "4%", left: "88%", delay: "0.9s" },
];

export function Motto({ className = "" }: { className?: string }) {
  return (
    <p className={`motto ${className}`.trim()}>
      <span className="motto-lead">{marketing.mottoLead}</span>{" "}
      <span className="motto-shine">{marketing.motto}</span>
      <span className="sparkles" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <i
            key={sparkle.left}
            style={{ top: sparkle.top, left: sparkle.left, animationDelay: sparkle.delay }}
          />
        ))}
      </span>
    </p>
  );
}
