import { db } from './_db';
import { Uuid } from '../lib/utils';

export interface AddBuild {
    uuid: string,
    name: string,
    build_path: string,
    git_repository: string,
}

export interface Build {
    id: number,
    uuid: string,
    name: string,
    build_path: string,
    git_repository: string,
    output: string,
}

export const createBuildTable = () => {
    console.log('create builds table')
    db.run(`CREATE TABLE IF NOT EXISTS builds(
        id integer PRIMARY KEY AUTOINCREMENT,
        uuid varchar(30),
        name varchar(30),
        build_path varchar(200),
        git_repository varchar(2000),
        output text
    )`);
}

export function getAllBuilds() {
    const builds = db.query('SELECT * FROM builds').all() as Build[];
    return builds;
}

export function getBuildById(id: number) {
    const build = db.query('SELECT * FROM builds WHERE id = ?').get(id) as Build | null;
    return build;
}

export function getBuildByUuid(uuid: string) {
    const build = db.query('SELECT * FROM builds WHERE uuid = ?').get(uuid) as Build | null;
    return build;
}

export function addBuild(build: AddBuild) {
    db.prepare('INSERT INTO builds (uuid, name, build_path, git_repository) VALUES (?,?,?,?)')
        .values(build.uuid ?? Uuid(), build.name, build.build_path, build.git_repository);
    return getBuildByUuid(build.uuid) as Build;
}

export function updateBuildOutput(id: number, output: string) {
    db.prepare(`
        UPDATE builds 
        SET output = ? 
        WHERE id = ?
    `).values(output, id);
}
