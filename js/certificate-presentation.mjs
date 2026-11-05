import {
 coursePage
} from './course.mjs';
export const CERTIFICATE_OVERVIEW_BOUNDS = [0, 0, 1536, 1024];
export const CERTIFICATE_WELCOME = {
 id: 'certificate-welcome',
 type: 'welcome',
 name: 'Certificate Program’a hoş geldiniz',
 bounds: CERTIFICATE_OVERVIEW_BOUNDS,
 route: {
  number: 0,
  name: 'Certificate Program',
  target: [801, 408]
 }
};
export const PHILOSOPHY_INTRO = {
 id: 'philosophy-intro',
 type: 'intro',
 name: 'Philosophy of Experiential Learning',
 question: 'Deneyimsel öğrenmenin felsefi temelleri',
 text: 'Bu kursta deneyimsel öğrenmenin felsefi temellerini tanıyacağız. William James, John Dewey ve Paulo Freire’nin bakışları üzerinden deneyimin bilgiye, öğrenmeye ve diyaloğa nasıl bağlandığını inceleyeceğiz.',
 topics: ['Deneyim ve bilgi arasındaki ilişki', 'Deneyimin eğitim ve öğrenmeyle bağı', 'Diyalog, katılım ve söz sahibi olma'],
 thinkers: 'William James · John Dewey · Paulo Freire',
 connection: 'Haritada bu düşünürlerin mekânlarını ve Philosophy of Experiential Learning okuluna bağlanan yolları birlikte görüyorsunuz. Ardından her durağı yakından keşfedeceğiz.',
 bounds: CERTIFICATE_OVERVIEW_BOUNDS,
 route: {
  number: 1,
  name: 'Philosophy of Experiential Learning',
  journey: 'Architecture of Experiential Learning',
  target: [475, 306]
 }
};
// These are presentation views, not additional lessons or completion requirements.
export function certificateDisplayPage(progress, scene) {
 return scene === 'welcome' ? CERTIFICATE_WELCOME : scene === 'philosophy-intro' ? PHILOSOPHY_INTRO : coursePage(progress);
}
export function startArchitecture(progress) {
 return {
  ...progress,
  started: true,
  journalOpen: false,
  step: 0
 };
}