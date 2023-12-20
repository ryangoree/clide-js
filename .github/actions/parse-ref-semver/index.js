import core from '@actions/core';

try {
  const ref = core.getInput('ref');
  core.setOutput('ref', ref);
  core.info(`Parsing "${ref}"...`);

  /**
   * A modified version of the regex from
   * https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
   * which:
   * - allows an optional leading path (e.g. "refs/tags/")
   * - matches the optional package scope and name (e.g. "@scope/name" ->
   *   "scope", "name")
   * - allows an optional leading "v" character before the major version. (e.g. "v1.0.0")
   *
   * https://regex101.com/r/wYU2v8/1
   */
  const match = ref.match(
    /^([^@\s]+\/)?((@([^\/\s]*))?\/?([^\s]+)@)?v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
  );

  if (!match) {
    core.setOutput('matched', 'false');
    core.info(`"${ref}" is not a valid semver reference.`);
  } else {
    const [
      // path (e.g. "refs/tags/")
      _,
      // Full prefix minus the optional "v" (e.g. refs/tags/@scope/name@)
      __,
      // Scope with the "@" (e.g. "@scope")
      ___,
      scope,
      name,
      major,
      minor,
      patch,
      prerelease,
      build,
    ] = match;

    core.info(`matched "${match}"`);

    core.setOutput('matched', 'true');
    core.setOutput('scope', scope);
    core.setOutput('name', name);
    core.setOutput('major', major);
    core.setOutput('minor', minor);
    core.setOutput('patch', patch);
    core.setOutput('prerelease', prerelease);
    core.setOutput('build', build);
  }
} catch (error) {
  core.setFailed(error.message);
}
