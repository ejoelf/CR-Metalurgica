export function notDeletedWhere(extraWhere = {}) {
  return {
    ...extraWhere,
    deletedAt: null,
  };
}

export function softDeleteData(extraData = {}) {
  return {
    ...extraData,
    deletedAt: new Date(),
  };
}

export function supportsSoftDelete(modelFields = []) {
  return modelFields.includes('deletedAt');
}
