const phonergx = new RegExp(
  /(^(\+(33|59|26) [1-9]|0[1-9])( \d\d){4}$)|(^(\+(687|508))( \d\d){3}$)/g
)

export function formatPhone(value: string) {
  let cleaned = value.replace(/[.-]/g, ' ').replace(/[()]/g, '').trim()

  if (cleaned.match(phonergx)) {
    return cleaned
  }

  cleaned = cleaned.replace(/ /g, '')

  if (cleaned.match(/^\+33([1-9])((\d){8})$/g)) {
    // france
    cleaned = cleaned.replace(/^\+33([1-9])((\d){8})$/g, '+33 $1 $2')
  } else if (cleaned.match(/^\+59(\d{10})$/g)) {
    // antilles-guyane
    cleaned = cleaned.replace(/^\+59(\d)([1-9])((\d){8})$/g, '+59$1 $2 $3')
  } else if (cleaned.match(/^\+26(\d{10})$/g)) {
    // reunion-mayotte
    cleaned = cleaned.replace(/^\+26(\d)([1-9])((\d){8})$/g, '+26$1 $2 $3')
  } else if (cleaned.match(/^\+687(\d{6})$/g)) {
    // caledonie
    cleaned = cleaned.replace(/^\+687((\d\d){3})$/g, '+687 $1')
  } else if (cleaned.match(/^\+508(\d{6})$/g)) {
    // saint-pierre-et-miquelon
    cleaned = cleaned.replace(/^\+508((\d\d){3})$/g, '+508 $1')
  }
  // polynesie et international
  return cleaned.replace(/\d{2}(?=(\d{1,2}){1,4}$)/g, '$& ')
}
