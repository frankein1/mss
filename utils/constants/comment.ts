export const COMMENT_RELATIONS_INCLUDE = {
  createdBy: {
    select: { id: true, firstName: true, lastName: true, email: true }
  }
}
