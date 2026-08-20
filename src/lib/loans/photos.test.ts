import {
  dataUrlToBlob,
  isDataUrl,
  isRemoteUrl,
  loanPhotoPath,
} from "@/lib/loans/photos";

describe("loan photos", () => {
  it("detects data URLs and remote URLs", () => {
    expect(isDataUrl("data:image/jpeg;base64,abc")).toBe(true);
    expect(isDataUrl("https://example.com/photo.jpg")).toBe(false);
    expect(isRemoteUrl("https://example.com/photo.jpg")).toBe(true);
    expect(isRemoteUrl("http://localhost/photo.jpg")).toBe(true);
    expect(isRemoteUrl("data:image/jpeg;base64,abc")).toBe(false);
  });

  it("builds a user-scoped storage path", () => {
    expect(loanPhotoPath("user-1", "loan-2")).toBe("user-1/loan-2.jpg");
  });

  it("converts a JPEG data URL to a blob", () => {
    const blob = dataUrlToBlob("data:image/jpeg;base64,YQ==");

    expect(blob.type).toBe("image/jpeg");
    expect(blob.size).toBe(1);
  });

  it("rejects an invalid data URL", () => {
    expect(() => dataUrlToBlob("not-a-data-url")).toThrow(
      "Invalid image data URL",
    );
  });
});
