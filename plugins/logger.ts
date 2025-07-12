import winston from 'winston'

export default defineNuxtPlugin(() => {
  console.log('toto')
  const { combine, timestamp, json, errors } = winston.format

  //   const {
  //     public: { logLevel }
  //   } = useRuntimeConfig()

  //   // Global logger
  //   const logger = winston.createLogger({
  //     level: logLevel,
  //     format: combine(errors({ stack: true }), timestamp(), json()),
  //     transports: [new winston.transports.Console()],
  //     exceptionHandlers: [new winston.transports.Console()],
  //     rejectionHandlers: [new winston.transports.Console()]
  //   })

  //   return {
  //     provide: {
  //       logger
  //     }
  //   }
})
