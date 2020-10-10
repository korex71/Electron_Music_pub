const newFavorite = (db, id, title, author, thumblink) => {
  db.find({id}, function (err, exist) {
    if(exist.length === 0){
      const schema = {id, title, author, thumblink};
      db.insert(schema, function (err, newInsert) {
        if(err) throw err;
        console.log(newInsert);
      });
    }else{
      return
    }
  })
  
};

const removeFavorite = (db, id, event) => {
  db.remove({_id: id}, {}, function (err, numRemoved) {
    if(err) throw err
    if(numRemoved > 0) event.reply('favRemove', true);
  });
};

const listFavorite = (db, event) => {
  db.find({}, function (err, music) {
    if(err) throw err;
    event.reply('listFavs', music);
  });
};

module.exports = {listFavorite, newFavorite, removeFavorite}