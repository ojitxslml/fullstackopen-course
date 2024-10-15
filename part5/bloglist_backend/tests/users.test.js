const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app"); // Asegúrate de importar tu aplicación de Express
const User = require("../models/user"); // Asegúrate de importar tu modelo de usuario
const mongoose = require("mongoose");

// Conectar a la base de datos antes de las pruebas
beforeEach(async () => {
  // Limpia la colección de usuarios antes de cada prueba
  await User.deleteMany({});
});

describe("User creation", () => {
  test("creating a user with valid data", async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "password",
    };

    const response = await supertest(app)
      .post("/api/users")
      .send(newUser)
      .expect(201);

    assert.strictEqual(response.body.username, newUser.username);
  });

  test("creating a user with too short username", async () => {
    const newUser = {
      username: "us",
      name: "Short User",
      password: "password",
    };

    const response = await supertest(app)
      .post("/api/users")
      .send(newUser)
      .expect(400);

    assert.strictEqual(response.body.error, 'username and password must be at least 3 characters long and provided');
  });

  test("creating a user with too short password", async () => {
    const newUser = {
      username: "validuser",
      name: "User With Short Password",
      password: "12",
    };

    const response = await supertest(app)
      .post("/api/users")
      .send(newUser)
      .expect(400);

    assert.strictEqual(response.body.error, 'username and password must be at least 3 characters long and provided');
  });

  test("creating a user with an existing username", async () => {
    const newUser = {
      username: "existinguser",
      name: "Existing User",
      password: "password",
    };

    await supertest(app)
      .post("/api/users")
      .send(newUser)
      .expect(201);

    const response = await supertest(app)
      .post("/api/users")
      .send(newUser)
      .expect(400);

    assert.strictEqual(response.body.error, 'username must be unique');
  });
});

after(async () => {
    await mongoose.connection.close();
  });
  