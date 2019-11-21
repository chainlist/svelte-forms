import { url as validateUrl } from "../src/rules/url";

describe("svelte-forms", () => {
  describe("validators", () => {
    describe("url", () => {
      it("passes well-formed URLs", () => {
        const goodUrls = [
          "http://a.b-c.de",
          "http://code.google.com/events/#&product=browser",
          "http://userid@example.com/",
        ];
        goodUrls.forEach(url => {
          expect(validateUrl(url)).toEqual(true);
        });
      });
      it("fails malformed URLs", () => {
        const badUrls = ["just_text", "http://", "//a", ":// should fail"];
        badUrls.forEach(url => {
          expect(validateUrl(url)).toEqual(false);
        });
      });
    });
  });
});
