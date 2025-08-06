const pkg = require('jsonwebtoken')

function toMilliseconds(minute) {
  return minute * 60 * 1000
}

function toSeconds(minute) {
  return minute * 60
}

const { sign } = pkg

function signJwt(user, jwtKey, expiresInMinutes) {
  const sessionToken = sign(
    {
      user: {
        email: user.email,
        id: user.id,
        lastName: user.lastName,
        firstName: user.firstName,
        role: user.role,
        status: user.status,
        structureId: user.structureId,
        structureType: user.structureType,
        CGUHistoryVersion: user.CGUHistoryVersion
      }
    },
    jwtKey,
    {
      algorithm: 'HS256',
      expiresIn: toSeconds(expiresInMinutes)
    }
  )
  return sessionToken
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
function setAuthenticationToken(context, events) {
  const structure = {
    id: '8adcd106-c652-4e4c-80df-beb373fae252',
    name: 'CCAS de Test',
    email: 'ccas-test@yopmail.com',
    type: 'Ccas',
    address: '1 rue du Ruisseau',
    city: 'Ennui-sur-Blasé',
    zipcode: '00000',
    phone: '01 00 00 00 00'
  }
  const user = {
    id: '7e5c1734-35cb-4047-9035-a944961a67a4',
    firstName: 'Jeanne',
    lastName: 'Responsable',
    email: 'jeanne.responsable@yopmail.com',
    role: 'StructureManager',
    status: 'Active',
    structureId: structure.id
  }
  const CGUHistoryVersion = '1.1'

  const token = signJwt(
    {
      ...user,
      structureId: structure.id,
      structureType: structure.type,
      CGUHistoryVersion
    },
    process.env.AUTH_JWT_KEY || 'secretJWT',
    parseInt(process.env.TOKEN_VALIDATION_IN_MINUTES || '30')
  )
  const expires = parseInt(
    ((new Date().getTime() + toMilliseconds(30)) / 1000).toFixed(0)
  )

  const cookie = `MSS_SESSION_TOKEN=${encodeURIComponent(token)}; Domain=localhost; path=/; Secure; HttpOnly; Expires=${expires}`

  context.vars.cookie = cookie
}

module.exports = {
  setAuthenticationToken
}
