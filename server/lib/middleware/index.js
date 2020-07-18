/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
function middleware(req, res) {

  /**
   * arguments = Array of function
   */
  function chain() {
    let chainIterator = Array.prototype.entries.call(arguments);

    function callNextMiddleware() {
      let nextIterator = chainIterator.next();
      if (!nextIterator.done) {
        let [_, nextMiddleware] = nextIterator.value;
        nextMiddleware(req, res, callNextMiddleware);
      }
    }

    callNextMiddleware();
  }

  return {
    chain
  }
}



module.exports = middleware;