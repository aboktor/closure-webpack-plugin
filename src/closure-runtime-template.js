const RuntimeTemplate = require('webpack/lib/RuntimeTemplate');
const Template = require('webpack/lib/Template');
const unquotedValidator = require('unquoted-property-validator');

module.exports = class ClosureRuntimeTemplate extends RuntimeTemplate {
  moduleNamespacePromise({
    chunkGraph,
    block,
    module,
    request,
    message,
    runtimeRequirements,
  }) {
    if (!module) {
      return this.missingModulePromise({
        request,
      });
    }
    const moduleId = chunkGraph.getModuleId(module);
    if (moduleId === null) {
      throw new Error(
        `RuntimeTemplate.moduleNamespacePromise(): Module ${module.identifier()} has no id. This should not happen.`
      );
    }
    const promise = this.blockPromise({
      block,
      chunkGraph,
      message,
      runtimeRequirements,
    });

    const idExpr = JSON.stringify(moduleId);
    const comment = this.comment({
      request,
    });
    const getModuleFunction = `function() { return __webpack_require__.t(${comment}${idExpr}); }`;
    return `${promise || 'Promise.resolve()'}.then(${getModuleFunction})`;
  }

  /**
   *
   * @param {Object} options options object
   * @param {boolean=} options.update whether a new variable should be created or the existing one updated
   * @param {Module} options.module the module
   * @param {string} options.request the request that should be printed as comment
   * @param {string} options.importVar name of the import variable
   * @param {Module} options.originModule module in which the statement is emitted
   * @returns {string} the import statement
   */
  importStatement({ update, module, request, importVar, originModule, chunkGraph, weak }) {
    if (!module) {
      return this.missingModuleStatement({
        request,
      });
    }
    const moduleId = this.moduleId({
      module,
      chunkGraph,
      request,
      weak
    });
    const optDeclaration = update ? '' : 'var ';
    return `/* harmony import */ ${optDeclaration}${importVar} = __webpack_require__(${moduleId})\n`;
  }

  exportFromImport({
    module,
    request,
    exportName,
    originModule,
    asiSafe,
    isCall,
    callContext,
    importVar,
    runtime,
    moduleGraph
  }) {
    if (!module) {
      return this.missingModule({
        request,
      });
    }
    if (exportName.length > 1) {
      throw new Error(
        `webpack-closure-plugin doesn't know how to deal with that: ${exportName}`
      );
    }
    const singleExportName =
      exportName.length === 1 ? exportName[0] : undefined;
    const exportsType = module.buildMeta && module.buildMeta.exportsType;
    if (!exportsType) {
      if (exportName === 'default') {
        return importVar;
      } else if (originModule.buildMeta.strictHarmonyModule) {
        if (exportName) {
          return '/* non-default import from non-esm module */undefined';
        }
        return `/*#__PURE__*/__webpack_require__(${importVar})`;
      }
    }

    if (singleExportName) {
      const exportsInfo = moduleGraph.getExportsInfo(module);
      const used = exportsInfo.getUsedName(singleExportName, runtime);
      if (!used) {
        const comment = Template.toNormalComment(
          `unused export ${singleExportName}`
        );
        return `${comment} undefined`;
      }
      const unquotedAccess = unquotedValidator(singleExportName);
      let access = `.${singleExportName}`;
      if (unquotedAccess.needsQuotes || unquotedAccess.needsBrackets) {
        access = `[${unquotedAccess.quotedValue}]`;
      }
      access = `${importVar}${access}`;
      return access;
    }
    return importVar;
  }

  defineEsModuleFlagStatement({ exportsArgument }) {
    return '';
  }
};
