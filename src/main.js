const core = require('@actions/core')

const convertMapToObjDeeply = o => {
  const recurseOnEntries = a => Object.fromEntries(
    a.map(([k, v]) => [k, convertMapToObjDeeply(v)])
  );
  
  if (o instanceof Map) {
    return recurseOnEntries([...o]);
  }
  else if (Array.isArray(o)) {
    return o.map(convertMapToObjDeeply);
  }
  else if (typeof o === "object" && o !== null) {
    return recurseOnEntries(Object.entries(o));
  }
  
  return o;
};

const deps = new Map()
deps.set(
  'numpy',
  new Map([
    ['3.12', ['1.26.0', null]],
    ['3.11', ['1.23.2', null]],
    ['3.10', ['1.21.3', null]],
    ['3.9', ['1.19.3', '2.0.2']]
  ])
)

function findClosestVersion(pkgName, pkgVersion, pythonVersion) {
  
  console.log(`${convertMapToObjDeeply(deps)}`)
  return pkgVersion
}

try {
  const pkgName = core.getInput('package-name')
  const pkgVersion = core.getInput('package-version')
  const pythonVersion = core.getInput('python-version')
  console.log(
    `pkgName: ${pkgName}\npkgVersion: ${pkgVersion}\npythonVersion: ${pythonVersion}`
  )

  closestPkgVersion = findClosestVersion(pkgName, pkgVersion, pythonVersion)
  core.setOutput('closest-valid-version', closestPkgVersion)

  const time = new Date().toTimeString()
  core.setOutput('time', time)
} catch (error) {
  core.setFailed(error.message)
}
