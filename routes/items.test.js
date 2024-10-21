process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
const items = require("../fakeDb");
const exp = require("constants");

let pickles = { name: "Pickles", price: 0.99 };

beforeEach(function () {
  items.push(pickles);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [pickles] });
  });
});

describe("POST /items", () => {
  test("create an item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "Cheese", price: 5.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "Cheese", price: 5.99 } });
  });
  test("Responds 400 when item name is missing info", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Change item name", async () => {
    const res = await request(app)
      .patch(`/items/${pickles.name}`)
      .send({ name: "Olives" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Olives", price: 0.99 } });
  });
  test("404 if invalid item name", async () => {
    const res = await request(app)
      .patch("/items/capers")
      .send({ name: "Olives" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item Not Found" });
  });
});

describe("/DELETE /items/:name", () => {
  test("delete an item", async () => {
    const res = await request(app).delete(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200);
  });
  test("404 if you delete an invalid item name", async () => {
    const res = await request(app).delete("/items/pepperoni");
    expect(res.statusCode).toBe(404);
  });
});
