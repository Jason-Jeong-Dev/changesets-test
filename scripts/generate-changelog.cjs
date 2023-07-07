const { getReleaseLine } = require("@changesets/changelog-github");
const fs = require("fs");
const path = require("path");
const { default: getReleasePlan } = require("@changesets/get-release-plan");

getReleasePlan()
  .then(async (releasePlan) => {
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
  })
  .catch((error) => {
    console.error("Error generating changelog:", error);
    process.exit(1);
  });
