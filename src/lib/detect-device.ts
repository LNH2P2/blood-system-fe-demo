// function detectDevice(): "android" | "ios" | "web" | "desktop" {
//     const ua = navigator.userAgent.toLowerCase();

//     if (/android/.test(ua)) return "android";
//     if (/iphone|ipad|ipod/.test(ua)) return "ios";
//     if (/windows|macintosh|linux/.test(ua)) return "desktop";
//     return "web"; // fallback, e.g. smartTV, unknown, etc.
// }
// export default detectDevice;

export function detectDevice(): "android" | "ios" | "web" | "desktop" {
    if (typeof navigator === "undefined") {
        // đang chạy ở server (SSR hoặc build)
        return "desktop"; // hoặc fallback mặc định
    }

    const ua = navigator.userAgent.toLowerCase();

    if (/android/.test(ua)) return "android";
    if (/iphone|ipad|ipod/.test(ua)) return "ios";
    if (/windows|macintosh|linux/.test(ua)) return "desktop";

    return "desktop";
}
export default detectDevice;