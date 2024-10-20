const { test, expect, beforeEach, describe } = require("@playwright/test");
const {
  loginWith,
  createBlog,
  loginAsDifferentUser,
  logout,
} = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
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

      await expect(page.locator(".blog-title")).toContainText(
        "New Blog Test"
      );
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, {
        title: "New Blog Test",
        author: "Author Test",
        url: "http://example.com",
      });

      await page.getByRole("button", { name: "view" }).click();

      await page.getByRole("button", { name: "like" }).click();

      await page.waitForTimeout(100);

      const likesText = await page.getByText(/likes \d+/).innerText();
      const likesCount = parseInt(likesText.split(" ")[1], 10);

      expect(likesCount).toBe(1);
    });

    test("a user can delete their own blog", async ({ page }) => {
      await createBlog(page, {
        title: "Blog to Delete",
        author: "Author Test",
        url: "http://example.com",
      });

      await page.goto("/");
      await page.getByRole("button", { name: "view" }).click();
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });

      await page.getByRole("button", { name: "delete" }).click();

      await page.waitForTimeout(500);

      await page.goto("/");

      const blogExists = await page.locator(`text=Blog to Delete`).count();
      expect(blogExists).toBe(0);
    });

    test("only the user who added the blog can see the delete button", async ({
      page,
    }) => {
      await createBlog(page, {
        title: "Blog by Author Test",
        author: "Author Test",
        url: "http://example.com",
      });

      await page.goto("/");
      await page.getByRole("button", { name: "view" }).click();

      const deleteButtonExistsForAuthor = await page
        .getByRole("button", { name: "delete" })
        .isVisible();
      expect(deleteButtonExistsForAuthor).toBe(true);

      await page.request.post("http://localhost:3001/api/users", {
        data: {
          name: "Superuser2",
          username: "differentUser",
          password: "differentPassword",
        },
      });

      await logout(page);

      await loginAsDifferentUser(page);

      await page.goto("/");

      await page.getByRole("button", { name: "view" }).click();

      const deleteButtonExistsForOtherUser = await page
        .getByRole("button", { name: "delete" })
        .isVisible();
      expect(deleteButtonExistsForOtherUser).toBe(false);
    });
    test("blogs are arranged in the order according to likes", async ({ page }) => {
        await createBlog(page, {
            title: "Blog A",
            author: "Author A",
            url: "http://example.com/a",
        });
    
        await createBlog(page, {
            title: "Blog B",
            author: "Author B",
            url: "http://example.com/b",
        });
    
        await createBlog(page, {
            title: "Blog C",
            author: "Author C",
            url: "http://example.com/c",
        });
    
        await page.waitForTimeout(1000); 

        const blogCount = await page.locator('.blog').count();
        expect(blogCount).toBe(3);
    
        await page.getByRole("button", { name: "view" }).nth(0).click(); 
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: 'like' }).nth(0).click(); 
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: 'like' }).nth(0).click(); 
    
        await page.waitForTimeout(500); 
    
        await page.getByRole("button", { name: "view" }).nth(1).click();
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: 'like' }).nth(1).click();
        
        await page.waitForTimeout(500);

        const blogs = await page.locator('.blog-title');
        const titles = await blogs.allTextContents();
    
        const expectedOrder = ["Blog A", "Blog C", "Blog B"];
        expect(titles).toEqual(expectedOrder);
    });
    
  });
});
