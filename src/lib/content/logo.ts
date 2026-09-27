/** Prefer the cropped local mark when Sanity still has the padded official upload. */
const PADDED_OFFICIAL_MARK =
  /bc6b59788d24f6ffd7aeb2401a13bfd1d745d970|-639x469(?:\.png)?/i;

export const LOCAL_LOGO_MARK = "/images/logo-mark-official.png";

export function resolveBrandLogo(url?: string | null) {
  if (!url) return LOCAL_LOGO_MARK;
  if (PADDED_OFFICIAL_MARK.test(url)) return LOCAL_LOGO_MARK;
  return url;
}
