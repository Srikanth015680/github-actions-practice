const request = require("supertest");
const app = require("../src/app");
describe("ShopFlow API", () => {
  test("health endpoint responds", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
  test("product listing returns products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    expect(res.body.items[0]).toHaveProperty("price");
  });
  test("product search filters products", async () => {
    const res = await request(app).get("/api/products?q=keyboard");
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe("Mechanical Keyboard");
  });
  test("unknown product returns 404", async () => {
    const res = await request(app).get("/api/products/nope");
    expect(res.status).toBe(404);
  });
});
