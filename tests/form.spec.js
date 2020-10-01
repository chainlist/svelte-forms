import { url as validateUrl } from "../src/rules/url";
import { email as validateEmail } from "../src/rules/email";

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

  describe("email", () => {

    it("passes well-formed emails", () => {
      const goodEmails = ["email@email.com", "my.email@example.fr"];
      goodEmails.forEach(email => {
        expect(validateEmail(email)).toEqual(true);
      });
    });

    it("fails malformed emails", () => {
      const badEmails = ["just_text", ".email@email", "email@email@email", "email.@email", "email@email", "email@", "@gmail.com", 12];
      badEmails.forEach(email => {
        expect(validateEmail(email)).toEqual(false);
      });
    });

  });


});
