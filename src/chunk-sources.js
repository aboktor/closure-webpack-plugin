const toSafePath = require('./safe-path');
const getWebpackModuleName = require('./module-name');
const { compareModulesByIdentifier } = require('webpack/lib/util/comparators');

let uniqueId = 1;
module.exports = function getChunkSources(chunk, compilation) {
  if (compilation.chunkGraph.getNumberOfChunkModules(chunk) === 0) {
    const emptyId = uniqueId;
    uniqueId += 1;
    return [
      {
        path: `__empty_${emptyId}__`,
        src: '',
      },
    ];
  }

  const getModuleSrcObject = (webpackModule) => {

    const first = (set) => {
      const entry = set.values().next();
      return entry.done ? undefined : entry.value;
    };
    const modulePath = getWebpackModuleName(
      webpackModule,
      compilation.chunkGraph
    );
    let src = '';
    let sourceMap = null;
    if (/javascript/.test(webpackModule.type)) {
      try {
        const source = compilation.codeGenerationResults.getSource(
          webpackModule,
          chunk.runtime,
          first(webpackModule.getSourceTypes())
        );
        const sourceAndMap = source.sourceAndMap();
        src = sourceAndMap.source;
        if (sourceAndMap.map) {
          sourceMap = sourceAndMap.map;
        }
      } catch (e) {
        compilation.errors.push(e);
      }
    }
    const moduleId = compilation.chunkGraph.getModuleId(webpackModule);

    return {
      path: toSafePath(modulePath),
      src,
      sourceMap,
      webpackId:
        moduleId !== null &&
        moduleId !== undefined && // eslint-disable-line no-undefined
        moduleId.toString().length > 0
          ? `${moduleId}`
          : null,
    };
  };

  const getChunkModuleSources = (chunkModules, webpackModule) => {
    const moduleDeps =
      webpackModule.type === 'multi entry'
        ? webpackModule.dependencies
        : [webpackModule];

    // Multi entry modules have no userRequest or id, but they do have multiple
    // nested dependencies. Traverse all of them.
    moduleDeps.forEach((subModule) => {
      chunkModules.push(getModuleSrcObject(subModule));
    });

    return chunkModules;
  };

  // Absolute hack here ordering by reverse chunk ids
  return compilation.chunkGraph
    .getOrderedChunkModules(chunk, compareModulesByIdentifier)
    .reverse()
    .reduce(getChunkModuleSources, [])
    .filter(
      (moduleJson) =>
        !(
          moduleJson.path === '__unknown__' &&
          moduleJson.src === '/* (ignored) */'
        )
    );
};
