function wrapAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
//Promise.resolve() ==> can also handle sync request
module.exports = wrapAsync;