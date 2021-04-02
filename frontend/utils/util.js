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

function getStu(str) {
    var reg = new RegExp('')
    var r = search.match(reg)
    if (r != null) return unescape(r[2])
    return null
}

const timeFormat = s => {
    s = s.replace(/-/g, "/");
    return new Date(s);
}

module.exports = {
    formatTime: formatTime,
    timeFormat: timeFormat,
    getStu: getStu
}