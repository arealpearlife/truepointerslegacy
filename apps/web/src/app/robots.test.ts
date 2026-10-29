import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows public indexing of the storefront", () => {
    expect(robots()).toEqual({ rules: { userAgent: "*", allow: "/" } });
  });
});
