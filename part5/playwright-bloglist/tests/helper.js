const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "log in" }).click();
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole("button", { name: "new blog" }).click();
  const inputs = await page.$$("input");
  await inputs[0].fill(title);
  await inputs[1].fill(author);
  await inputs[2].fill(url);

  await page.getByRole("button", { name: "save" }).click();
};

export { loginWith, createBlog };
