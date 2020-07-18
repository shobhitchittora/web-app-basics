function smile(req, res, next) {
  console.log(`😇`);
  next();
}

module.exports = smile;