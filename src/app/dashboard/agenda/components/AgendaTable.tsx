'use client';

export function AgendaTable() {
  const data = [
    {
      id: 1,
      title: 'AI & Cloud Conference',
      date: '23-10-2025',
      time: '10:00 AM',
      speaker: 'John Deo',
    },
  ];

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-semibold">Event Content (Agenda)</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Speaker</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-muted/30 border-b">
              <td className="p-2">{row.title}</td>
              <td className="p-2">{row.date}</td>
              <td className="p-2">{row.time}</td>
              <td className="p-2">{row.speaker}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
