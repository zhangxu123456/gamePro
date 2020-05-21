export default {
    // ajaxHost: process.env.NODE_ENV === 'development' ? '/apis' : `${location.protocol}//${location.host}`,
    // hostname: process.env.NODE_ENV === 'development' ? 'fz.wuyaoc.xyz' : `${location.hostname}`,
    // 由于本地嵌入 app, 没有 location, 因此写死
    // ajaxHost: process.env.NODE_ENV === 'development' ? '/apis' : 'http://fz.wuyaoc.xyz',
    // hostname: 'www.wuyaoc.xyz',
    ajaxHost: process.env.NODE_ENV === 'development' ? '/apis' : 'http://www.wuyaoc.xyz',
    hostname: 'www.wuyaoc.xyz',
}