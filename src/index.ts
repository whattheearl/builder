import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger';
import { addBuild, Build, getAllBuilds } from "./db/builds";
import { run } from './lib/run';
import { Uuid } from "./lib/utils";
import { JEDDIT } from "./repo/jeddit";
import { BUILDER } from "./repo/builder";

const app = new Elysia()
    .use(swagger())
    .post("/builds/builder", async () => {
        const uuid = Uuid();
        let build = {
            uuid,
            name: BUILDER.name,
            git_repository: BUILDER.git_repository,
            build_path: `/tmp/builder/${BUILDER.name}/${uuid}`,
        } as Build;
        build = addBuild(build);

        run(build);

        return build;
    })
    .post("/builds/jeddit", async () => {
        const uuid = Uuid();
        let build = {
            uuid,
            name: JEDDIT.name,
            git_repository: JEDDIT.git_repository,
            build_path: `/tmp/builder/${JEDDIT.name}/${uuid}`,
        } as Build;
        build = addBuild(build);

        run(build);

        return build;
    })
    .get("/builds", () => getAllBuilds())
    .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
