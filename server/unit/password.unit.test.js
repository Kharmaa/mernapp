// server/unit/password.unit.test.js
const { hashPassword, comparePassword } = require("../utils/password");

describe("password utils", () => {
  test("hashPassword tuottaa hashin joka ei ole sama kuin salasana", async () => {
    const hash = await hashPassword("123456");
    expect(hash).toBeDefined();
    expect(hash).not.toBe("123456");
  });

  test("comparePassword palauttaa true oikealla salasanalla ja false väärällä", async () => {
    const hash = await hashPassword("123456");
    expect(await comparePassword("123456", hash)).toBe(true);
    expect(await comparePassword("WRONG", hash)).toBe(false);
  });
});
