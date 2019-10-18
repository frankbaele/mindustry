Host Server :

Run docker directly

docker run -ti -p 6567:6567/tcp -p 6567:6567/udp frankbaele/mindustry

Run docker-compose with following config

```
version: '3.7'
services:
  mindustry:
    image: frankbaele/mindustry
    ports:
      - 6567:6567
    restart: always

```

Roadmap
- expose server configuration
- add dev builds
