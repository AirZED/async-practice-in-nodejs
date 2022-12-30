const fs = require('fs');

const superagent = require('superagent');

//CALL BACK HELL
//read the do file
// fs.readFile(`${__dirname}/dog.txt`, 'utf-8', (err, data) => {
//   if (err) return console.log('An error occured');
//   console.log('Breed: ' + data);
//   //use the called file to send an http request
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       //save this to another file
//       fs.writeFile(`new-file.txt`, `${res.body.message}`, (err) => {
//         console.log('Written to file');
//       });
//     });
// });

// creating a readFile to return a promise
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) reject('I could not find that file');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Couldn't write the file");
      resolve('Written to file');
    });
  });
};

/*
//USING PROMISES
readFilePro(`${__dirname}/dog.txt`)
  .then((result) => {
    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
  })
  .then((data) => writeFilePro('new-file2.txt', data.body.message))
  .then((fin) => console.log(fin))
  .catch((err) => console.log(err.message));
  */

//USING ASYNC AWAIT
const getDogPic = async () => {
  try {
    const resultFromRead = await readFilePro(`${__dirname}/dog.txt`);

    const fetchedFile = await superagent.get(
      `https://dog.ceo/api/breed/${resultFromRead}/images/random`
    );

    const writtenFile = await writeFilePro(
      'new-file.txt',
      fetchedFile.body.message
    );

    return writeFilePro;
  } catch (error) {
    throw new Error(error);
  }
};

/*
getDogPic()
  .then((x) => console.log(x))
  .catch((err) => console.log(err.message));
*/

(async () => {
  try {
    const value = await getDogPic();
  } catch (err) {
    console.log(err);
  }
})();

//awaiting multiple promises simultaneously
const getDogPicMultiplePromises = async () => {
  try {
    const resultFromRead = await readFilePro(`${__dirname}/dog.txt`);

    const fetchedFile1 = superagent.get(
      `https://dog.ceo/api/breed/${resultFromRead}/images/random`
    );
    const fetchedFile2 = superagent.get(
      `https://dog.ceo/api/breed/${resultFromRead}/images/random`
    );
    const fetchedFile3 = superagent.get(
      `https://dog.ceo/api/breed/${resultFromRead}/images/random`
    );

    const all = await Promise.all([fetchedFile1, fetchedFile2, fetchedFile3]);
    const allMaped = all.map((each) => each.body.message);
    console.log(allMaped);

    const allWritten = all.map(
      async (each, index) =>
        await writeFilePro(`new-file-${index}.txt`, each.body.message)
    );

    return Promise.all(allWritten);
  } catch (error) {
    throw new Error(error);
  }
};

(async () => {
  const file = await getDogPicMultiplePromises();
  console.log(file);
})();
