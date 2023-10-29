export const COMMENT_RELATIONS_INCLUDE = {
  createdBy: {
    select: { firstName: true, lastName: true, email: true }
  },
  updatedBy: {
    select: { firstName: true, lastName: true, email: true }
  }
}
