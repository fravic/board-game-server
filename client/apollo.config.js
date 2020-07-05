module.exports = {
  client: {
    service: {
      name: "board-game-server",
      localSchemaFile: "../server/src/schema/schema.generated.graphql",
    },
    addTypename: true,
    tagName: "gql",
    globalTypesFile: "src/gql_types/globalTypes.ts",
  },
};
