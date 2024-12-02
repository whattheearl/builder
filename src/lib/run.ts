import { $ } from 'bun';
import { type Build, updateBuildOutput } from '../db/builds';

export async function run(build: Build) {
    let output = "";
    output += await $`rm -rf ${build.build_path}`.text();
    updateBuildOutput(build.id, output);

    output += await $`git clone ${build.git_repository} ${build.build_path}`.text();
    updateBuildOutput(build.id, output);

    output += await $`make -C ${build.build_path} build; make -C ${build.build_path} publish`.text();
    updateBuildOutput(build.id, output);

    output += await $`rm -rf ${build.build_path}`.text();
    updateBuildOutput(build.id, output);
}

