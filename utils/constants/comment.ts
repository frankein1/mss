export const COMMENT_RELATIONS_INCLUDE = {
  createdBy: {
    select: { firstName: true, lastName: true, email: true }
  }
}
