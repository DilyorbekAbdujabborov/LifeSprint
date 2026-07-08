import { DollarSign } from 'lucide-react';
import type { Course } from '../types';

interface StudentMoocProps {
  courses: Course[];
  coins: number;
  onBuyCourse: (course: Course) => void;
}

export default function StudentMooc({ courses, coins, onBuyCourse }: StudentMoocProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">Mustaqil kurslar do'koni</h2>
          <p className="text-xs text-gray-400">Tangalaringiz evaziga yangi bilimlarni sotib oling.</p>
        </div>
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs font-bold text-amber-800 dark:text-amber-300">
          <DollarSign className="w-4 h-4 inline" /> Balans: <span className="font-mono text-sm">{coins} tanga</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="p-6 bg-white dark:bg-[#151433] border border-gray-100 dark:border-slate-800 rounded-3xl flex flex-col justify-between space-y-4">
            <div className="space-y-2 text-left">
              <span className="text-[9px] font-bold px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-full uppercase">{course.category}</span>
              <h3 className="font-bold text-base text-gray-950 dark:text-white">{course.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-3">{course.description}</p>
              <div className="pt-2 border-t border-gray-50 dark:border-slate-800 text-[10px] text-gray-400 font-bold space-y-1">
                <p>Ustoz: {course.teacherName}</p>
                <p>{course.duration} &bull; {course.lessonsCount} ta dars</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-gray-400 font-bold">Narxi:</span>
                <strong className="text-purple-600 dark:text-purple-400 font-mono text-base">{course.priceCoins} tanga</strong>
              </div>
              {course.enrolled ? (
                <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl">Sotib olingan</span>
              ) : (
                <button
                  onClick={() => onBuyCourse(course)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  type="button"
                >
                  Xarid qilish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
