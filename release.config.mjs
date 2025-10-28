/**
 * @type {import("semantic-release").GlobalConfig}
 */
export default {
	branches: [
		"main",
		{ name: "beta", prerelease: true },
		{ name: "alpha", prerelease: true }
	],
	tagFormat: "v${version}",
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/changelog",
			{ changelogFile: "CHANGELOG.md" }
		],
		[
			"@semantic-release/npm",
			{ npmPublish: false }
		],
		[
			"@semantic-release/exec",
			{
				prepareCmd:
					"pnpm build"
			}
		],
		[
			"@semantic-release/github",
			{
				assets: "build/bundle/*.zip"
			}
		],
		[
			"@semantic-release/git",
			{
				assets: ["CHANGELOG.md", "package.json"],
				message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
			}
		]
	]

};

