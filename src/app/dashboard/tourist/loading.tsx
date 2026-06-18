import { Loader2 } from 'lucide-react';

export default function TouristDashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
      <p className="text-gray-500 text-sm">Fetching your dashboard data</p>
    </div>
  );
}
