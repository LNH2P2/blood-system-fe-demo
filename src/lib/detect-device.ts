function detectDevice(): "android" | "ios" | "web" | "desktop" {
    const ua = navigator.userAgent.toLowerCase();

    if (/android/.test(ua)) return "android";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/windows|macintosh|linux/.test(ua)) return "desktop";
    return "web"; // fallback, e.g. smartTV, unknown, etc.
}
export default detectDevice;
