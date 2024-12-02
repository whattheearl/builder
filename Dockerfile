FROM oven/bun:1
WORKDIR /home/jon/wte/builder
COPY ./package.json ./bun.lockb .
RUN bun i --frozen-lockfile
COPY . .
ENTRYPOINT ["bun", "run", "./src/index.ts"]
