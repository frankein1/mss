import winston from 'winston'
import morgan from 'morgan'

const { combine, timestamp, json, errors } = winston.format
const defaultLevel = process.env.LOG_LEVEL || 'info'

const config: winston.LoggerOptions = {
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()]
}

// Global logger
export const logger = winston.createLogger({
  level: defaultLevel,
  ...config
})

export default defineNitroPlugin(nitroApp => {
  const {
    public: { logLevel }
  } = useRuntimeConfig()

  // When starting nuxt app set log level threshold to runtime defined value
  logger.configure({ level: logLevel, ...config })

  const httpLogger = morgan(
    (tokens, req, res) => {
      const r = {
        method: tokens.method(req, res),
        url: (tokens.url(req, res) || '').substring(0, 100),
        //host: tokens.host(req, res),
        protocol: req.headers['x-forwarded-proto'],
        //from: tokens.from(req, res),
        //duration: tokens.duration(req, res),
        //bytes: tokens.bytes(req, res),
        status: Number.parseFloat(tokens.status(req, res) || ''),
        content_length: tokens.res(req, res, 'content-length'),
        request_id: tokens.res(req, res, 'x-request-id'),
        response_time: Number.parseFloat(
          tokens['response-time'](req, res) || ''
        ),
        referrer: tokens.referrer(req, res),
        user_agent: req.headers['user-agent']
      }
      return JSON.stringify(r)
    },
    {
      stream: {
        write: message => logger.info('router', JSON.parse(message))
      }
    }
  )

  // Global nitro middleware to log every API request
  nitroApp.hooks.hook('request', event => {
    httpLogger(event.node.req, event.node.res, () => {})
  })
})
