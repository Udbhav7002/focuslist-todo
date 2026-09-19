interface TodoStatsProps {
  stats: { total: number; completed: number; pending: number };
}

export function TodoStats({ stats }: TodoStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6 text-center">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl border border-blue-200/50 shadow-sm">
        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Total</p>
        <p className="text-2xl font-black text-blue-900">{stats.total}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-xl border border-orange-200/50 shadow-sm">
        <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mb-1">Pending</p>
        <p className="text-2xl font-black text-orange-900">{stats.pending}</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl border border-green-200/50 shadow-sm">
        <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Done</p>
        <p className="text-2xl font-black text-green-900">{stats.completed}</p>
      </div>
    </div>
  );
}
