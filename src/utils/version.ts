import { readFileSync } from "node:fs";

function readPackageVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(new URL("../../package.json", import.meta.url), "utf-8")
    );
    return pkg.version ?? "unknown";
  } catch {
    return "unknown";
  }
}

function git(args: string[]): string | null {
  try {
    const result = Bun.spawnSync({
      cmd: ["git", ...args],
      stdout: "pipe",
      stderr: "ignore",
    });
    if (result.exitCode !== 0) return null;
    const out = result.stdout?.toString().trim();
    return out || null;
  } catch {
    return null;
  }
}

const sha =
  process.env.COMMIT_SHA ??
  process.env.SOURCE_VERSION ??
  git(["rev-parse", "HEAD"]) ??
  "unknown";

const branch =
  process.env.COMMIT_BRANCH ??
  process.env.BRANCH ??
  git(["rev-parse", "--abbrev-ref", "HEAD"]) ??
  "unknown";

const time =
  process.env.BUILD_TIME ?? git(["log", "-1", "--format=%cI"]) ?? null;

const version = {
  app: readPackageVersion(),
  commit: {
    sha,
    branch,
    time,
  },
  runtime: {
    name: "bun",
    version: Bun.version,
  },
};

export { version };
export type VersionInfo = typeof version;
