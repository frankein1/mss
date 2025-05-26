// replaceSQLParamsInPreparedStatements(
//   `SELECT * FROM A WHERE param = $1,
//   ['hello']
// )  --> `SELECT * FROM A WHERE param = 'hello'`
export default function replaceSQLParamsInPreparedStatements(
  sql: string,
  params: any[]
): string {
  return sql.replace(/\$(\d+)/g, (_match, group) => {
    const idx = parseInt(group, 10) - 1
    let value = params[idx]

    // Handle undefined or missing parameters
    if (value === undefined) {
      return 'NULL'
    }

    // Properly quote strings for SQL
    if (typeof value === 'string') {
      // Escape single quotes for SQL
      value = value.replace(/'/g, "''")
      return `'${value}'`
    }
    // Convert other types to string
    return String(value)
  })
}
