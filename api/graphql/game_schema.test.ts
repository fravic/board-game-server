jest.mock("../redis");

import { createTestContext } from "../../tests/__helpers";

const ctx = createTestContext();

it("ensures that a game can be created", async () => {
  // Create a new game
  const gameResult = await ctx.client.send(`
    mutation {
      createGame(name: "Hello world", numPlayers: 3) {
        id
        name
        numPlayers
      }
    }
  `);

  expect(gameResult).toMatchObject({
    createGame: expect.objectContaining({
      name: "Hello world",
      numPlayers: 3,
    }),
  });
});
