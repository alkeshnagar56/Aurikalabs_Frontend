export const canEdit = (user, task) => {
  if (!user || !task) return false;

  const isCreator = task.createdBy?.email === user.email;
  const isAssigned = task.assignedTo?.email === user.email;

  return isCreator || isAssigned;
};
