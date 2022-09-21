let uniqueId = 1;

function getWebpackModuleName(webpackModule, chunkGraph) {
  if (webpackModule.userRequest) {
    return webpackModule.userRequest;
  }

  if (webpackModule.rootModule && webpackModule.rootModule.userRequest) {
    return webpackModule.rootModule.userRequest;
  }

  const id = chunkGraph.getModuleId(webpackModule);
  if (id) {
    return `__missing_path_${id}__`;
  }

  if (webpackModule.module) {
    return getWebpackModuleName(webpackModule.module); // Do we really want this recursive call?
  }

  if (webpackModule.__wpccName) {
    return webpackModule.__wpccName;
  }

  webpackModule.__wpccName = `__missing_path_no_id_${uniqueId}__`;
  uniqueId += 1;
  return webpackModule.__wpccName;
}

module.exports = getWebpackModuleName;
