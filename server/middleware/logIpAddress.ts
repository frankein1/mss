export default defineEventHandler(event => {
  // eslint-disable-next-line no-console
  console.log('IP :' + getRequestIP(event, { xForwardedFor: true }))
})
