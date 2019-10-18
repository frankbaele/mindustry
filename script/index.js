const Octokit = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN
});

const simpleGit = require('simple-git')('../');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function updateDockerFile(version) {
  const file = await readFile('./Dockerfile.template', 'utf8');
  const result = file.replace(/%%release%%/g, version);
  await writeFile('../Dockerfile', result)
}

async function createCommit(version) {
  return simpleGit
  .add('./Dockerfile')
  .commit("Update to new version: " + version)
  .addTag(version, (err,result)=>{})
  .push()
  .pushTags()
}

async function createRelease(version) {
  return octokit.repos.createRelease({
    owner:"frankbaele",
    repo: "mindustry",
    tag_name: version
  })
}

(async () => {
  const mindustry_release = await octokit.repos.getLatestRelease({
    owner: "Anuken",
    repo: "Mindustry"
  });

  const docker_release = await octokit.repos.getLatestRelease({
    owner: "frankbaele",
    repo: "mindustry"
  });

  if (mindustry_release.data.tag_name !== docker_release.data.tag_name) {
    const newVersion = mindustry_release.data.tag_name;
    await updateDockerFile(newVersion);
    await createCommit(newVersion);
    await createRelease(newVersion);
  }
})();
