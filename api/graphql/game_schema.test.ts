import { createTestContext } from "../../tests/helpers";

const ctx = createTestContext();

it("ensures that a game can be created, and that players can join", async () => {
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

  const playerResult = await ctx.client.send(`
    mutation {
      addPlayerToGame(name: "Fravic", gameId: "${gameResult.createGame.id}") {
        name
      }
    }
  `);

  expect(playerResult).toMatchObject({
    addPlayerToGame: {
      name: "Fravic",
    },
  });
});
