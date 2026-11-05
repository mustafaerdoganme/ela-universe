// Pure geometry shared by pointer, wheel, keyboard and resize navigation.
export function clampView(view, width, height, imageWidth, imageHeight) {
 const scale = Math.min(view.maxScale, Math.max(view.minScale, view.scale));
 // Water continues outside the image. Allow every edge/corner to reach the
 // screen centre, with some extra room beside an open information panel.
 const boundX = imageWidth * scale / 2 + Math.min(96, width * .08),
  boundY = imageHeight * scale / 2 + Math.min(96, height * .08);
 return {
  ...view,
  scale,
  x: Math.min(boundX, Math.max(-boundX, view.x)),
  y: Math.min(boundY, Math.max(-boundY, view.y))
 };
}
export function zoomAt(view, factor, point, width, height, imageWidth, imageHeight) {
 const scale = Math.min(view.maxScale, Math.max(view.minScale, view.scale * factor)),
  ratio = scale / view.scale;
 return clampView({
  ...view,
  scale,
  x: point.x - (point.x - view.x) * ratio,
  y: point.y - (point.y - view.y) * ratio
 }, width, height, imageWidth, imageHeight);
}
export function fitBounds(bounds, width, height, imageWidth, imageHeight, area, minScale, maxScale) {
 const [left, top, right, bottom] = bounds, padding = 32;
 const scale = Math.min(maxScale, Math.max(minScale, Math.min(area.width / (right - left + padding * 2), area.height / (bottom - top + padding * 2))));
 const centreX = (left + right) / 2,
  centreY = (top + bottom) / 2;
 return clampView({
  scale,
  minScale,
  maxScale,
  x: area.left + area.width / 2 - width / 2 - (centreX - imageWidth / 2) * scale,
  y: area.top + area.height / 2 - height / 2 - (centreY - imageHeight / 2) * scale
 }, width, height, imageWidth, imageHeight);
}