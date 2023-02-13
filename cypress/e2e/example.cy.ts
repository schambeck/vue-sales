describe("Home Test", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Welcome to the Sales application!");
  });
});
