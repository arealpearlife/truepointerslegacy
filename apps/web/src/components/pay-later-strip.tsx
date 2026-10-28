import { PAY_LATER_METHODS, marketing } from "@truepointers/commerce";

export function PayLaterStrip({ compact = false }: { compact?: boolean }) {
  return (
    <p className={compact ? "pay-later-strip compact" : "pay-later-strip"}>
      <span className="pay-later-whisper">{marketing.payLaterWhisper}</span>
      <span className="pay-later-methods">
        {PAY_LATER_METHODS.map((method) => (
          <span key={method.id}>{method.label}</span>
        ))}
      </span>
    </p>
  );
}
