const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

// Mockataan jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("check-auth middleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeReq = ({ method = "GET", authorization } = {}) => ({
    method,
    headers: authorization ? { authorization } : {},
  });

  const makeRes = () => ({});

  test("päästää OPTIONS-pyynnön läpi ilman tarkistusta", () => {
    const req = makeReq({ method: "OPTIONS" });
    const res = makeRes();
    const next = jest.fn();

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  test("palauttaa 401 jos Authorization-header puuttuu", () => {
    const req = makeReq();
    const res = makeRes();
    const next = jest.fn();

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);

    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.code).toBe(401);
  });

  test("palauttaa 401 jos token puuttuu (Bearer ilman tokenia)", () => {
    const req = makeReq({ authorization: "Bearer " });
    const res = makeRes();
    const next = jest.fn();

    checkAuth(req, res, next);

    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.code).toBe(401);
  });

  test("palauttaa 401 jos jwt.verify heittää virheen", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("bad token");
    });

    const req = makeReq({ authorization: "Bearer badtoken" });
    const res = makeRes();
    const next = jest.fn();

    checkAuth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledTimes(1);

    const err = next.mock.calls[0][0];
    expect(err).toBeDefined();
    expect(err.code).toBe(401);
  });

  test("asettaa req.userData ja kutsuu next() validilla tokenilla", () => {
    jwt.verify.mockReturnValue({ userId: "u1", email: "a@b.com" });

    const req = makeReq({ authorization: "Bearer goodtoken" });
    const res = makeRes();
    const next = jest.fn();

    checkAuth(req, res, next);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(req.userData).toEqual({ userId: "u1", email: "a@b.com" });

    // next() kutsutaan ilman virhettä
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
