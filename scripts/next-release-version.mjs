import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

function stableVersion(version) {
  if (typeof version !== "string" || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Expected a stable semantic version, received ${JSON.stringify(version)}`);
  }
  const parts = version.split(".").map(Number);
  if (!parts.every(Number.isSafeInteger)) {
    throw new Error(`Version exceeds the supported integer range: ${version}`);
  }
  return parts;
}

export function nextReleaseVersion(current, published) {
  const versions = typeof published === "string" ? [published] : published;
  if (
    !Array.isArray(versions) ||
    versions.length === 0 ||
    !versions.every((v) => typeof v === "string")
  ) {
    throw new Error("The registry must return a non-empty list of published versions");
  }
  let latest = stableVersion(current);
  for (const version of versions) {
    // Prereleases do not advance the stable release line.
    if (version.includes("-")) continue;
    const candidate = stableVersion(version);
    const difference = candidate.findIndex((part, index) => part !== latest[index]);
    if (difference !== -1 && candidate[difference] > latest[difference]) latest = candidate;
  }
  if (!Number.isSafeInteger(latest[2] + 1)) {
    throw new Error("The next patch version exceeds the supported integer range");
  }
  return `${latest[0]}.${latest[1]}.${latest[2] + 1}`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { version } = JSON.parse(readFileSync("package.json", "utf8"));
  console.log(nextReleaseVersion(version, JSON.parse(process.argv[2])));
}
