/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
const { JSON } = require("body-parser");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name = _csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    emailAddress: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Sports Scheduler", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(40011, () => {
      console.log("Started an application at port number 4005");
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up as admin", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User 1",
      email: "user1@gmail.com",
      password: "12345",
      role: "admin",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign up as player", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstname: "Test",
      lastname: "User 2",
      email: "user2@gmail.com",
      password: "12345",
      role: "player",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/admin");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/admin");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a sport", async () => {
    const agent = request.agent(server);
    await login(agent, "user1@gmail.com", "12345");
    const res = await agent.get("/createsport");
    const csrfToken = extractCsrfToken(res);
    const res1 = await agent.post("/createsport").send({
      sport: "cricket",
      _csrf: csrfToken,
    });
    expect(res1.statusCode).toBe(403);
    const res2 = await agent.post("/createsport").send({
      sport: "Football",
      _csrf: csrfToken,
    });
    expect(res2.statusCode).toBe(403);
  });

  test("create a session", async () => {
    const agent = request.agent(server);
    await login(agent, "user1@gmail.com", "12345");
    let res = await agent.get("/createsessions/1");

    let csrfToken = extractCsrfToken(res);
    var today = new Date("2023-06-04");

    console.log("Date: ", today);
    const createsessions = await agent.post("/createsessions").send({
      nameOfSport: 1,
      dateTime: today,
      sessionsPlace: "test",
      playersName: "test,test",
      noOfPlayers: 11,
      sessioncreated: true,
      
      _csrf: csrfToken,
    });
    console.log(createsessions.text);
    const groupedsessionResponse = await agent
      .get("/session")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedsessionResponse.text);
    console.log(parsedGroupedResponse);
    const sessions = parsedGroupedResponse.allSessions.length;

    expect(sessions).toBe(1);
  });
})
