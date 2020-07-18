function _getEnv() {
  return process.env.NODE_ENV;
}

function isDev() {
  const env = _getEnv();
  return /^devlopment|dev$/.test(env);
}

function isProd() {
  const env = _getEnv();
  return /^production|prod$/.test(env);
}

function isStage() {
  const env = _getEnv();
  return /^stage|staging$/.test(env);
}

module.exports = {
  isDev,
  isProd,
  isStage
}