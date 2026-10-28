const messages = [
  "Legacy Tennis Chain",
  "3MM · 4MM · 5MM stones",
  '40" · 44" · 48" drops',
  "Low hang, worn loud",
  "Flawless Upgrade",
  "Checkout through Shopify",
];

export function AnnouncementBar() {
  return (
    <div className="announcement" role="region" aria-label="Announcements">
      <p className="sr-only">{messages.join(". ")}</p>
      <div className="marquee" aria-hidden="true">
        {[...messages, ...messages].map((message, index) => (
          <span key={index}>
            {message}
            <b className="spark">✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
