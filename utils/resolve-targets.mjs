/**
 * Utility function to transform `browserslist` output into supported
 * browser names and format for esbuild `target` parameter.
 * @param {Array.<string>} browsersArray - Array of browsers from browserslist
 * @returns {Array.<string>} Transformed `targets` array for esbuild config
 */
const resolveTargets = (browsersArray) => {
  const alternateNameMap = {
    and_chr: 'chrome',
    and_ff: 'firefox',
    ios_saf: 'ios',
  };

  const validNames = ['chrome', 'edge', 'firefox', 'ios', 'safari'];

  const transformedArray = browsersArray.map((browser) => {
    let [browserName, browserVersion] = browser?.split(' ');
    if (!browserName || !browserVersion) return null;

    if (alternateNameMap.hasOwnProperty(browserName)) {
      browserName = alternateNameMap[browserName];
    }
    if (!validNames.includes(browserName)) return null;

    const versionSplit = browserVersion.split('-');
    if (versionSplit.length === 1) return `${browserName}${browserVersion}`;

    const [lower, upper] = versionSplit;
    const lowerNum = Number(lower);
    const upperNum = Number(upper);
    let currentVersion = lowerNum;
    let versionArray = [];
    while (currentVersion < upperNum) {
      versionArray.push(`${browserName}${currentVersion}`);
      currentVersion = (currentVersion * 10 + 0.1 * 10) / 10;
    }
    versionArray.push(`${browserName}${upperNum}`);

    return versionArray;
  });

  return transformedArray.flat().filter((item) => Boolean(item));
};

export default resolveTargets;
