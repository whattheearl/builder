import { $ } from "bun";
import { type Build, updateBuild } from "../db/builds";

export async function run(build: Build) {
    let output = `Running build ${build.name}:${build.id}`;
    console.log(output);
    build.output = output;
    updateBuild(build);

    {
        console.log(`Cleaning up ${build.build_path}`);
        const { stdout, stderr, exitCode } = await $`rm -rf ${build.build_path}`
            .quiet()
            .nothrow();
        if (exitCode != 0) {
            console.error("failed to remove build folder");
            build.output += stderr.toString();
            return;
        }
        console.log(stdout.toString());
        build.output += stdout.toString() + "\n";
        updateBuild(build);
    }

    {
        console.log(
            `Cloning repository ${build.git_repository} to ${build.build_path}`,
        );
        const { stdout, stderr, exitCode } =
            await $`git clone ${build.git_repository} ${build.build_path}`
                .quiet()
                .nothrow();
        if (exitCode != 0) {
            console.error("failed to clone repository");
            build.output += stderr.toString();
            return;
        }
        console.log(stdout.toString());
        build.output += stdout.toString() + "\n";
        updateBuild(build);
    }

    {
        console.log(`Building ${build.name}`);
        const { stdout, stderr, exitCode } =
            await $`make -C ${build.build_path} build;`.quiet().nothrow();
        if (exitCode != 0) {
            console.error(`Failed to build ${build.name}`);
            build.output += stderr.toString();
            return;
        }
        console.log(stdout.toString());
        build.output += stdout.toString() + "\n";
        updateBuild(build);
    }

    {
        console.log(`Publishing ${build.name}`);
        const { stdout, stderr, exitCode } =
            await $`make -C ${build.build_path} publish`.quiet().nothrow();
        if (exitCode != 0) {
            console.error("Failed to publish");
            build.output += stderr.toString();
            return;
        }
        console.log(stdout.toString());
        build.output += stdout.toString() + "\n";
        updateBuild(build);
    }

    {
        console.log(`Cleaning up ${build.build_path}`);
        console.log(`rm -rf ${build.build_path}`);
        const { stdout, stderr, exitCode } = await $`rm -rf ${build.build_path}`
            .quiet()
            .nothrow();
        if (exitCode != 0) {
            console.error("Failed to clean up build files");
            build.output += stderr.toString();
            return;
        }
        console.log(stdout.toString());
        build.output += stdout.toString() + "\n";
        updateBuild(build);
    }
}
