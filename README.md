Host Server :

Run docker directly

docker run -ti -p 6567:6567/tcp -p 6567:6567/udp frankbaele/mindustry

Run docker-compose with following config

```
version: '3.5' # lower version to work with current ubuntu lts
services:
  mindustry:
    image: frankbaele/mindustry
    
    # enable tty and stdin to make `docker attach` work
    tty: true
    stdin_open: true

    # trust no one :)
    read_only: true
    cap_drop:
      - ALL

    ports:
      - "6567:6567"
    restart: always

    # map config to host machine
    volumes:
      - ./config:/config
```
