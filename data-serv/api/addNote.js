async function addNote(query, dataBuffer) {
  return new Promise((resolve, reject) => {

    const data = dataBuffer.toString();
    const { content, timestamp } = JSON.parse(data);
    const values = [content, timestamp];

    console.log(values);

    query('INSERT INTO notes (content, timestamp) VALUES ($1, $2) RETURNING *', values, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });


}

module.exports = addNote;
