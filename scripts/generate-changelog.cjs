const { default: readChangesets } = require("@changesets/read");
const { default: getReleasePlan } = require("@changesets/get-release-plan");
const { getReleaseLine } = require("@changesets/changelog-github");
const fs = require("fs");
const path = require("path");

(async () => {
  const cwd = process.cwd();
  const changesets = await readChangesets(cwd);
  const releasePlan = await getReleasePlan(changesets);

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
