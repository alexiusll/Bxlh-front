import moment from 'moment'

export function removeNull(data) {
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    throw new Error('request data is not a object.')
  }

  // 两层去掉null 和 空对象
  for (let key in data) {
    if (data[key] === null || JSON.stringify(data[key]) === '{}') {
      delete data[key]
    } else if (Object.prototype.toString.call(data[key]) === '[object Object]') {
      for (let _key in data[key]) {
        if (data[key][_key] === null) {
          delete data[key][_key]
        }
      }
    }
  }

  return data
}

export function judgeIsSubmit(cycle_status = [], cycle_number) {
  if (!cycle_number) {
    return false
  }
  for (const cycle of cycle_status) {
    if (cycle.cycle_number === cycle_number && cycle.is_submit === 1) {
      return true
    }
  }
  return false
}

export function disabledDateAfterToday(current) {
  return current && current > moment().endOf('day')
}
