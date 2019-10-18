const Octokit = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN
});
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function updateDockerFile(version){
  const file = await readFile('./Dockerfile.template', 'utf8');
  const result = file.replace(/%%release%%/g, version);
  await writeFile('../Dockerfile', result)
}

async function createCommit(){

}

async function setTag(version){
  // octokit.git.createTag({
  //   "frankbaele",
  //   "mindustry",
  //    version,
  //   "Release version: " + version,
  //   object,
  //   "commit"
  // })
}
async function creatRelease (version) {

}

(async () => {
  const mindustry_release = await octokit.repos.getLatestRelease({
    owner:"Anuken",
    repo:"Mindustry"
  })

  const docker_release = await octokit.repos.getLatestRelease({
    owner:"frankbaele",
    repo:"mindustry"
  })

  if(mindustry_release.data.tag_name !== mindustry_release.data.docker_release){

  }
  await updateDockerFile(mindustry_release.data.tag_name);
  await setTag(mindustry_release.data.tag_name);
  await creatRelease(mindustry_release.data.tag_name);

})();
