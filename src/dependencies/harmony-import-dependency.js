const HarmonyImportSpecifierDependency = require('webpack/lib/dependencies/HarmonyImportSpecifierDependency');

class ClosureHarmonyImportDependency extends HarmonyImportSpecifierDependency {
  updateHash(hash) {
    hash.update('ClosureHarmonyImportDependency');
  }
}

ClosureHarmonyImportDependency.Template = class ClosureHarmonyImportDependencyTemplate {
  apply(dependency, source, templateContext) {
    const dep = /** @type {HarmonyImportDependency} */ (dependency);
    const {
      module,
      chunkGraph,
      moduleGraph,
      runtime,
      runtimeTemplate,
    } = templateContext;
    const moduleId = runtimeTemplate.moduleId({
      module: moduleGraph.getModule(dep),
      request: dep.request,
      chunkGraph,
      weak: dep.weak
    });
    source.replace(dep.range[0], dep.range[1] - 1, JSON.stringify(moduleId));
  }
};

module.exports = ClosureHarmonyImportDependency;
