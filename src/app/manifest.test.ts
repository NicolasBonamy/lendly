import manifest from "@/app/manifest";

describe("web app manifest", () => {
  const webManifest = manifest();

  it("uses a dark splash background so the white mark stays visible", () => {
    expect(webManifest.background_color).toBe("#0a0a0a");
    expect(webManifest.theme_color).toBe("#0a0a0a");
  });

  it("declares a maskable Android icon separate from the any-purpose icons", () => {
    const icons = webManifest.icons ?? [];

    expect(icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/icons/app-icon-maskable-512.png",
          sizes: "512x512",
          purpose: "maskable",
        }),
        expect.objectContaining({
          src: "/icons/app-icon-512.png",
          sizes: "512x512",
          purpose: "any",
        }),
      ]),
    );
  });
});
