const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//手机号中间替换为****
const telHideCenter = (val) => {
  var reg = /^(\d{3})\d{4}(\d{4})$/;
  val = val.replace(reg, '$1****$2');
  return val;
}

module.exports = {
  formatTime: formatTime,
  telHideCenter: telHideCenter,
}
