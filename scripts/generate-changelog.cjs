const { read } = require("@changesets/read");
const { getReleasePlan } = require("@changesets/release-plan");
const { getReleaseLine } = require("@changesets/changelog-github");
const fs = require("fs");
const path = require("path");

(async () => {
  const cwd = process.cwd();
  const sinceRef = undefined; // 최근 터그되지 않은 변경 메시지 이후 모든 변경 메시지를 가져옵니다.
  const changesets = await read(cwd, sinceRef);
  const configPath = path.join(cwd, ".changeset", "config.json");
  const releasePlan = await getReleasePlan(changesets, await import(configPath),
    { cwd });

  const githubOptions = {
    repo: "changesets-test",
    user: "Jason-Jeong-Dev",
  };

  let changelogText = "";
  for (const release of releasePlan.releases) {
    if (release.type === "none") continue;

    const releaseEntries = release.changelogEntries;
    changelogText += await getReleaseLine(release, releaseEntries, githubOptions);
    changelogText += "\n\n";
  }
  fs.writeFileSync("CHANGELOG.md", changelogText, { flag: "a+" });
})().catch((error) => {
  console.error("Error generating changelog:", error);
  process.exit(1);
});
