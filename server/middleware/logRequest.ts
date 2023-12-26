export default defineEventHandler(event => {
  const request = getRequestURL(event)

  // eslint-disable-next-line no-console
  console.log({
    date: new Date(),
    ipSource: getRequestIP(event),
    ipForwardedFor: getRequestIP(event, { xForwardedFor: true }),
    method: event.method,
    path: request.pathname,
    queryParams: request.searchParams,
    userAgent: '',
    statutReponse: '',
    dureeTraitement: ''
  })
})
