import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/20/solid";

export default function PaymentStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const StatIcon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-xl transform hover:scale-[1.02] transition-all"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                      <StatIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3 text-sm font-medium text-slate-500 truncate">
                      {stat.name}
                    </div>
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-slate-800">
                    {stat.value}
                  </div>
                </div>
                <div
                  className={`flex items-center ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpIcon className="h-5 w-5" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
