const builtinModules = require('module').builtinModules;
const path = require('path');

function loadModules() {

  const PARENT_MODULE_PATH = path.dirname(module.parent.filename);

  let result = {};

  for (let module of arguments) {
    let moduleName,
      moduleAs;

    if (typeof module === 'string') {
      moduleName = module;
      moduleAs = module
    } else if (typeof module == 'object' && module.path && module.as) {
      moduleName = module.path;
      moduleAs = module.as;
    } else {
      throw new Error(`loadModules: Module loading failed - ${module}`);
    }

    // If built-in
    if (builtinModules.includes(moduleName)) {
      result[moduleAs] = require(moduleName);
    }
    // user defined module
    else {
      result[moduleAs] = require(path.join(PARENT_MODULE_PATH, moduleName));
    }
  }

  return result;
}



module.exports = loadModules;
