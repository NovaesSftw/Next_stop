// Lista de cursos da plataforma. Para adicionar um curso, crie um arquivo em data/courses/
// (use ingles.js como modelo) e inclua-o aqui.
import ingles from './courses/ingles.js';
import logica from './courses/logica.js';
import matematica from './courses/matematica.js';

export const COURSES = [ingles, logica, matematica];

export const getCourse = (id) => COURSES.find((c) => c.id === id);

/** Encontra uma lição pelo id e devolve também o curso, a unidade e a posição. */
export function findLesson(courseId, lessonId) {
  const course = getCourse(courseId);
  if (!course) return null;
  const lessons = course.units.flatMap((unit) => unit.lessons.map((lesson) => ({ lesson, unit })));
  const index = lessons.findIndex((l) => l.lesson.id === lessonId);
  if (index < 0) return null;
  return { course, unit: lessons[index].unit, lesson: lessons[index].lesson, index, next: lessons[index + 1]?.lesson ?? null };
}
