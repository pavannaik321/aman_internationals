// components/DateCard.tsx
export default function DateCard() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-4 my-6 p-4 rounded-xl shadow-md bg-white text-center">
      <p className="text-gray-600 text-lg">{today}</p>
    </div>
  );
}
