const generateMessage = (entity) => ({
  alreadyExist: `${entity} already Exist`,
  notFound: `${entity} not found`,
  createSuccessfully: `${entity} created successfully`,
  updateSuccessfully: `${entity} updated successfully`,
  deleteSuccessfully: `${entity} deleted successfully`,
  failToCreate: `fail to create ${entity}`,
  failToUpdate: `fail to Update ${entity}`,
  failToDelete: `fail to Delete ${entity}`,
});

export const messages = {
  category: generateMessage("category"),
  subcategory: generateMessage("subcategory"),
  brand: generateMessage("brand"),
  product: generateMessage("product"),
  user: {
    ...generateMessage("user"),
    verified: "user verified successfully",
    invalidCredentials: "invalid credentials",
    notAuthorized: "not authorized to access this api",
  },
  review: generateMessage("review"),
  coupon: generateMessage("coupon"),
  order: generateMessage("order"),
};
