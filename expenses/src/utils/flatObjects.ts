const flatObjects = (object: any[] | any) => {
  if (Array.isArray(object)) {
    return object.map(e => {
      const { user, category } = e;
      e.user = user.id;
      e.category = category.id
      return e; 
    })
  }
  const {user,category} = object;
  object.user = user.id;
  object.category = category.id
  return object;
}


export default flatObjects;