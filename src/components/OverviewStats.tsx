// components/OverviewStats.tsx
type StatItem = {
  label: string;
  value: number;
  subLabel: string;
};

const stats: StatItem[] = [
  { label: "Today's", value: 23, subLabel: "Check-in" },
  { label: "Today's", value: 13, subLabel: "Check-out" },
  { label: "Total", value: 60, subLabel: "In hotel" },
  { label: "Total", value: 10, subLabel: "Available room" },
  { label: "Total", value: 90, subLabel: "Occupied room" },
];

export default function OverviewStats() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 m-4">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
        {stats.map((item, index) => (
          <div key={index} className="flex flex-row justify-start items-end gap-4">
            <div className="text-start">
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="text-m text-gray-600">{item.subLabel}</p>
            </div>
            <p className="text-2xl font-semibold text-blue-500 mb-0">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
