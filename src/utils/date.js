import moment from 'moment'

export const getBirthDay = id_number => {
  const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (regIdCard.test(id_number)) {
    let year = id_number.slice(6, 10)
    let month = id_number.slice(10, 12)
    let day = id_number.slice(12, 14)
    return `${year}-${month}-${day}`
  }
}