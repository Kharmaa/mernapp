// server/unit/jwt.unit.test.js
const { signToken, verifyToken } = require("../utils/jwt");

describe("jwt utils", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  test("signToken luo tokenin ja verifyToken palauttaa payloadin", () => {
    const token = signToken({ userId: "abc", email: "a@b.com" });
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe("abc");
    expect(decoded.email).toBe("a@b.com");
  });

  test("verifyToken heittää virheen jos token on virheellinen", () => {
    expect(() => verifyToken("not-a-token")).toThrow();
  });
});
