const Octokit = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN
});
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const scriptTimeout = 5000;
const owner = "frankbaele";
const repo = "mindustry";

async function updateDockerFile(version) {
  const file = await readFile('./Dockerfile.template', 'utf8');
  const result = file.replace(/%%release%%/g, version);
  return Buffer.from(result).toString('base64')
}

async function pushDockerFile(version, content, sha) {
  return octokit.repos.createOrUpdateFile({
    owner,
    repo,
    path:'Dockerfile',
    message: "Update to new version: " + version,
    content,
    sha
  })
}

async function tagCommit(commit, version){
  const tag = await octokit.git.createTag({
    owner,
    repo,
    tag: version,
    message: "Release tag: " + version,
    object: commit.sha,
    type: "commit"
  })
  return octokit.git.createRef({
    owner,
    repo,
    ref: "refs/tags/" + version,
    sha: tag.data.sha
  })
}

async function getCurrentFile(){
  return octokit.repos.getContents({
    owner,
    repo,
    path: "Dockerfile"
  })

}
async function createRelease(version) {
  return octokit.repos.createRelease({
    owner,
    repo,
    tag_name: version
  })
}

async function checkVersion() {
  try{
    const mindustry_release = await octokit.repos.getLatestRelease({
      owner: "Anuken",
      repo: "Mindustry"
    });
    console.log("Mindustry latest release: " + mindustry_release.data.tag_name);

    const docker_release = await octokit.repos.getLatestRelease({
      owner,
      repo,
    });
    console.log("Dockerhub latest release: " + docker_release.data.tag_name);

    if (mindustry_release.data.tag_name !== docker_release.data.tag_name) {
      const newVersion = mindustry_release.data.tag_name;
      const fileBase64 = await updateDockerFile(newVersion);
      const currentFile = await getCurrentFile();
      const result = await pushDockerFile(newVersion, fileBase64, currentFile.data.sha);
      await tagCommit(result.data.commit, newVersion);
      await createRelease(newVersion);
      console.log("Versions update was successful")
    } else {
      console.log("Versions match, nothing to do")
    }
  } catch (error){
    console.error(error)
  }
  setTimeout(checkVersion, scriptTimeout)
}

checkVersion();