import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { addBuild, Build, getAllBuilds } from "./db/builds";
import { run } from "./lib/run";
import { Uuid } from "./lib/utils";
import { JEDDIT } from "./projects/jeddit";
import { JITHUB } from "./projects/jithub";

const app = new Elysia()
    .use(swagger())
    .post("/projects/jithub/build", async () => {
        const uuid = Uuid();
        let build = {
            uuid,
            name: JITHUB.name,
            git_repository: JITHUB.git_repository,
            build_path: `/tmp/builder/${JITHUB.name}/${uuid}`,
        } as Build;
        build = addBuild(build);

        run(build);

        return build;
    })
    .post("/projects/jeddit/build", async () => {
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
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
