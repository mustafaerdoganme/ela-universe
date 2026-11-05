// A continuous flight in map coordinates: rise, travel, then settle at the stop.
// The same transform is applied to the artwork, masks, routes and signs.
export function createCameraFlight(from, to, {
 width,
 height,
 imageWidth,
 imageHeight,
 area
}) {
 const ox = area.left + area.width / 2 - width / 2,
  oy = area.top + area.height / 2 - height / 2;
 const a = {
  x: imageWidth / 2 + (ox - from.x) / from.scale,
  y: imageHeight / 2 + (oy - from.y) / from.scale
 };
 const b = {
  x: imageWidth / 2 + (ox - to.x) / to.scale,
  y: imageHeight / 2 + (oy - to.y) / to.scale
 };
 const dx = b.x - a.x,
  dy = b.y - a.y,
  distance = Math.hypot(dx, dy),
  zoomDistance = Math.abs(Math.log(to.scale / from.scale));
 const changed = distance > 1 || zoomDistance > .004;
 const duration = changed ? Math.min(2600, 1400 + distance * .85 + zoomDistance * 350) : 0;

 function at(t) {
  if (t <= 0) return {
   ...from
  };
  if (t >= 1) return {
   ...to
  };
  const e = t * t * t * (t * (t * 6 - 15) + 10),
   arc = Math.min(65, distance * .07) * Math.sin(Math.PI * e);
  const cx = a.x + dx * e - (distance ? dy / distance * arc : 0),
   cy = a.y + dy * e + (distance ? dx / distance * arc : 0);
  const lift = Math.min(.8, distance / 800) * Math.sin(Math.PI * e) ** 2;
  const scale = Math.max(from.minScale, Math.min(from.maxScale, Math.exp(Math.log(from.scale) + (Math.log(to.scale) - Math.log(from.scale)) * e - lift)));
  return {
   ...from,
   scale,
   x: ox - (cx - imageWidth / 2) * scale,
   y: oy - (cy - imageHeight / 2) * scale
  };
 }
 return {
  duration,
  at
 };
}