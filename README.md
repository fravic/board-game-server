# Board Game Server

Backend server for a generic board game. Design goals:

- Easy to extend for any turn-based game implementation
- Effortless game hosting and joining, with no authentication
- Typed realtime API via GraphQL subscriptions
- Persistance via Redis so a game can be dropped and picked up at any time by anyone
- Replayability of games enabled by storage of every meaningful action performed

---

## Development

# Server

- `cd server`
- `yarn install` to install JS/TS packages
- `yarn dev-redis` to start Redis in Docker
- `yarn dev` to start Nexus devserver
