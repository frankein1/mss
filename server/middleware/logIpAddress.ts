export default defineEventHandler(event => {
  console.log('IP :' + getRequestIP(event, { xForwardedFor: true }))
})
