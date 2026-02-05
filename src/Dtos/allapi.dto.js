const roleDTO = (doc) => {
    return {
      name: doc.name,
      createdAt:doc.createdAt,
      slug: doc.slug,     
    };
}

const userDTO = (doc) => ({
  id: doc._id,
  name: doc.name,
  email: doc.email,
  phoneNumber: doc.phoneNumber,
  roles: doc.roles?.map(roleDTO) || [],
  permissions: doc.permissions || [],
  isActive: doc.isActive,
  twoFactorEnabled: doc.twoFactorEnabled,
  createdAt: doc.createdAt,
});

const permissionDTO = (doc)=> {
  return {
    name: doc.name,
    createdAt:doc.createdAt,
    slug: doc.slug,
  };
}

const getAllPermissonDTO = (doc)=> {
  return doc.map((item) => permissionDTO(item));
}

module.exports = { permissionDTO, getAllPermissonDTO, userDTO };