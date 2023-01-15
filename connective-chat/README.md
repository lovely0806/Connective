# Connective Chat
Powered by Express.js

# Development
- Copy .env.example as .env and setup environment variables
- `docker-compose -f docker-compose.dev.yml up -d --build`
- Connect client on `:3000`

# Production
- Same steps as development but change the `docker-compose.dev.yml` to `docker-compose.yml`