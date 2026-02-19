const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/user/signup", () => {
  it("luo uuden käyttäjän ja palauttaa tokenin", async () => {
    const res = await request(app).post("/api/user/signup").send({
      name: "Test User",
      email: "test@test.com",
      password: "123456", // min 6
    });

    console.log("STATUS:", res.statusCode);
    console.log("BODY:", res.body);

    expect(res.statusCode).toBe(201);

    // token pitäisi tulla aina
    expect(res.body.token).toBeDefined();

    // email voi tulla joko rootissa tai user-objektissa (riippuu controllerista)
    const returnedEmail = res.body.email ?? res.body.user?.email;
    expect(returnedEmail).toBe("test@test.com");

    // userId voi olla userId / id / _id riippuen toteutuksesta
    const returnedId =
      res.body.userId ?? res.body.id ?? res.body.user?.id ?? res.body.user?._id;
    expect(returnedId).toBeDefined();
  });

  it("palauttaa 422 jos name puuttuu", async () => {
    const res = await request(app).post("/api/user/signup").send({
      email: "x@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(422);
    expect(res.body.message).toBeDefined();
  });

  describe("POST /api/user/login", () => {
    it("kirjaa käyttäjän sisään ja palauttaa tokenin", async () => {
      // 1. Luodaan käyttäjä
      await request(app).post("/api/user/signup").send({
        name: "Login User",
        email: "login@test.com",
        password: "123456",
      });

      // 2. Kirjaudutaan
      const res = await request(app).post("/api/user/login").send({
        email: "login@test.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.userId).toBeDefined();
      expect(res.body.email).toBe("login@test.com");
    });
  });

  describe("GET /api/user/me", () => {
    it("palauttaa 401 jos token puuttuu", async () => {
      const res = await request(app).get("/api/user/me");
      expect(res.statusCode).toBe(401); // tai 403 riippuen middlewarestä
    });

    it("palauttaa käyttäjän tiedot validilla tokenilla", async () => {
      // 1. signup
      const signup = await request(app).post("/api/user/signup").send({
        name: "Me User",
        email: "me@test.com",
        password: "123456",
      });

      const token = signup.body.token;

      // 2. suojattu reitti
      const res = await request(app)
        .get("/api/user/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email ?? res.body.user?.email).toBe("me@test.com");
    });
  });
});
