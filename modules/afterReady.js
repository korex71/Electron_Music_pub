const fs = require('fs');
const path = require('path');

const afterReady = async (favDB) => {
  defaultFolders(); console.log('Pastas padroes');
  verifyFiles(favDB); console.log('Verificar arquivos x db');
};

const defaultFolders = () => {
  if(!fs.existsSync(path.resolve(__dirname, '..', 'musicas'))){
    try {
      fs.mkdirSync(path.resolve(__dirname, '..', 'musicas'));
    } catch (err) {
      throw err
    }
  }
  if(!fs.existsSync(path.resolve(__dirname, '..', 'tmp'))){
    try {
      fs.mkdirSync(path.resolve(__dirname, '..', 'tmp'));
    } catch (err) {
      throw err
    };
  };
};

const verifyFiles = async (db) => {
  db.find({}, function (err, docs) {
    if(err) throw err;
    docs.map(doc => {
      file(doc.title, doc.id, doc._id);
    });
  });
};

const file = (title, id, _id) => {
  console.log(`*** Verificação de ${title} - ${id}`)
  if(fs.existsSync(path.resolve(__dirname, '..', 'musicas', `${id}.mp3`))){
    console.log(`*** ${id} - ${title} existente em local, mantido na db.`);
  }else{
    db.remove({_id}, function (err) {
      if(err) throw err;
      console.log(`*** ${title} nao existia no local e foi removido da db.`);
    });
  };
};

module.exports = {afterReady};