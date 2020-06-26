import { createTestContext } from "../../tests/__helpers";

const ctx = createTestContext();

it("ensures that a game can be created", async () => {
  // Create a new game
  const gameResult = await ctx.client.send(`
    mutation {
      createGame(name: "Hello world") {
        id
        name
      }
    }
  `);

  expect(gameResult).toMatchObject({
    createGame: {
      id: "1",
      name: "Hello world",
    },
  });
});
