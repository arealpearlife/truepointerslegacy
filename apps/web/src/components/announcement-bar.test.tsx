import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnnouncementBar } from "./announcement-bar";

describe("Announcement bar", () => {
  it("whispers the house courtesies without a $1,000 look", () => {
    render(<AnnouncementBar />);
    const bar = screen.getByLabelText("Announcements");
    expect(bar).toHaveTextContent(/From \$500/);
    expect(bar).toHaveTextContent(/5 years of care/);
    expect(bar).toHaveTextContent(/From \$1,000/);
    expect(bar).toHaveTextContent(/A Legacy chain, chosen by you/);
    expect(bar).not.toHaveTextContent(/\$1,000 look/i);
  });
});
