import { announcementIncentives } from "@truepointers/commerce";

export function AnnouncementBar() {
  return (
    <div className="announcement" role="region" aria-label="Announcements">
      <p className="sr-only">{announcementIncentives.join(". ")}</p>
      <div className="marquee" aria-hidden="true">
        {[...announcementIncentives, ...announcementIncentives].map((message, index) => (
          <span key={index}>
            {message}
            <b className="spark">✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
