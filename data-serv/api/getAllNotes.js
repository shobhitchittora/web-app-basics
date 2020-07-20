async function getAllNotes(query) {
  return new Promise((resolve) => {
    query('SELECT * FROM notes', (error, result) => {
      if (error) {
        throw error
      }
      resolve(result);
    });
  });
  

}

module.exports = getAllNotes;
