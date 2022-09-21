const HarmonyImportDependency = require('webpack/lib/dependencies/HarmonyImportDependency');

class ClosureHarmonyExportImportDependency extends HarmonyImportDependency {
  constructor(request, sourceOrder, range) {
    super(request, sourceOrder);
    this.range = range;
  }
  updateHash(hash) {
    hash.update('ClosureHarmonyExportImportDependency');
  }
}

ClosureHarmonyExportImportDependency.Template = class ClosureHarmonyExportImportDependencyTemplate {
  apply(dep, source, runtime) {
    const moduleId = runtime.moduleId({
      module: dep._module,
      request: dep._request,
    });
    source.replace(dep.range[0], dep.range[1] - 1, JSON.stringify(moduleId));
  }
}

module.exports = ClosureHarmonyExportImportDependency;
