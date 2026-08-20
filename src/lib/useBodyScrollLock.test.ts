import { renderHook } from "@testing-library/react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

describe("useBodyScrollLock", () => {
  afterEach(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  });

  it("locks document scroll while the hook is active", () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("does not lock scroll when inactive", () => {
    renderHook(() => useBodyScrollLock(false));

    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overflow).toBe("");
  });
});
