const db = firebase.firestore();

export async function insert(item){
 try {
  const response = await db.collection('todos').add(item);
  return response;
 } catch (error) {
  throw new Error(error);
 }
}

export async function getItems(uid){
  try {
    let items = [];
    const response = await db.collection('todos').where('userid', '==', uid).get();
    // console.log(response)
    response.forEach(item => {
      // console.log(item.id)
      // console.log(item.data())
      const data = {
        idColecction : item.id,
        ...item.data()
      }
      // console.log(data)
      items.push(data);
    });
    return items
  } catch (error) {
    throw new Error(error);
  }
}

export async function update(colecction, item){

  try {
    await db.collection('todos').doc(colecction).update({completed:  item.completed})
  } catch (error) {
    throw new Error(error)
  }
  
  // try {
  //   let docId;
  //   const doc = await db.collection('todos').where('id', '==', id).get()
  //   // await db.collection('todos').where('id', '==', id).get()
  //   console.log('antes')
  //   console.log(doc.id)
  //   // doc.forEach(item => {
  //   //   console.log(item)
  //   // })
  //   console.log('despues')
  //   const ej = await db.collection('todos').doc(doc).get();
  //   consolelog(ej)

  //   // await db.collection('todos').doc('M08E1czwFv55rBulOXmF').update({completed:  item.completed})
  // } catch (error) {
  //   throw new Error(error)
  // }
}