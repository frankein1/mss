export default defineEventHandler(event => {
  if (process.env.NODE_ENV !== 'development') {
    const request = getRequestURL(event)
    const headers = getRequestHeaders(event)

    // eslint-disable-next-line no-console
    console.log({
      date: new Date(),
      ipSource: getRequestIP(event),
      ipForwardedFor: getRequestIP(event, { xForwardedFor: true }),
      method: event.method,
      path: request.pathname,
      queryParams: request.searchParams,
      userAgent: headers['user-agent'],
      statutReponse: '',
      executionTime: ''
    })
  }
})
