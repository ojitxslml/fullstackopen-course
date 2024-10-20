const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // Resetear la base de datos y crear un usuario
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Superuser",
        username: "root2",
        password: "salainen",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("button", { name: "log in" }).click();
    const locator = await page.getByText("username");
    await expect(locator).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "root2", "salainen");
      await expect(page.getByText("Superuser logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("button", { name: "log in" }).click();
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();
      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("Wrong username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(
        page.getByText("Matti Luukkainen logged in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "root2", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, {
        title: "New Blog Test",
        author: "Author Test",
        url: "http://example.com",
      });

      await expect(page.locator('.successful')).toContainText("a new blog New Blog Test by Author Test added");
    });


    test("a blog can be liked", async ({ page }) => {
        await createBlog(page, {
            title: "New Blog Test",
            author: "Author Test",
            url: "http://example.com",
        });
    
        await page.getByRole("button", { name: "view" }).click();

        await page.getByRole('button', { name: "like" }).click();
    
        await page.waitForTimeout(100); 
    
        const likesText = await page.getByText(/likes \d+/).innerText();
        const likesCount = parseInt(likesText.split(' ')[1], 10); 
    
        expect(likesCount).toBe(1);
    });
    
  });
});
