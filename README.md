# Board Game Server

Backend server for a generic board game. Design goals:

- Easy to extend for any turn-based game implementation
- Effortless game hosting and joining, with no authentication
- Typed realtime API via GraphQL subscriptions
- Persistance via Redis so a game can be dropped and picked up at any time by anyone
- Replayability of games enabled by storage of every meaningful action performed

---

## Development

### Server (port 4000)

- `cd server`
- `yarn install` to install JS/TS packages
- `yarn dev-redis` to start Redis in Docker
- `yarn dev` to start devserver and auto-generate nexus schema

### Client (port 3000)

- `cd client`
- `yarn install` to install JS/TS packages
- `yarn dev` to start devserver
