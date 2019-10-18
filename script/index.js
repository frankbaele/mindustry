const Octokit = require("@octokit/rest");
const octokit = new Octokit({
  username: "frankbaele",
  password: process.env.PASSWORD
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
  .tag(version)
  .push()
  .pushTags()
}

async function setTag(version) {
  // octokit.git.createTag({
  //   "frankbaele",
  //   "mindustry",
  //    version,
  //   "Release version: " + version,
  //   object,
  //   "commit"
  // })
}

async function creatRelease(version) {

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

  if (mindustry_release.data.tag_name !== mindustry_release.data.docker_release) {

  }
  const newVersion = "v100"
  await updateDockerFile(newVersion);
  await setTag(newVersion);
  await creatRelease(newVersion);
  await createCommit(newVersion)
})();
