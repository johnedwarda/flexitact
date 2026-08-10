import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const CalendarAppView = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const monthLabel = useMemo(
    () => new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" }),
    [currentMonth, currentYear]
  );

  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells: { day: number; isToday: boolean; selected: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: 0, isToday: false, selected: false });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      cells.push({
        day: d,
        isToday:
          today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear,
        selected:
          selectedDate?.getDate() === d &&
          selectedDate?.getMonth() === currentMonth &&
          selectedDate?.getFullYear() === currentYear,
      });
    }
    return cells;
  }, [currentMonth, currentYear, selectedDate, today]);

  const changeMonth = (dir: number) => {
    let newMonth = currentMonth + dir;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const events = [
    { time: "09:00", title: "Team stand-up" },
    { time: "13:30", title: "Design review" },
    { time: "18:00", title: "Dinner with Bob" },
  ];

  return (
    <div className="flex flex-col h-full bg-background px-6 pt-3 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex h-6 items-center gap-3 text-muted-foreground">
          <CalendarDays size={18} />
          <h2 className="text-base font-mono uppercase tracking-widest">Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-mono w-28 text-center">{monthLabel}</span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded-lg hover:bg-muted/40 text-muted-foreground"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-7 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <div key={d} className="text-center text-[10px] font-mono text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {days.map((cell, i) => (
              <button
                key={i}
                disabled={cell.day === 0}
                onClick={() => setSelectedDate(new Date(currentYear, currentMonth, cell.day))}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-colors ${
                  cell.day === 0
                    ? "invisible"
                    : cell.selected
                    ? "bg-primary text-primary-foreground"
                    : cell.isToday
                    ? "border border-primary/50 text-primary"
                    : "text-foreground hover:bg-muted/30"
                }`}
              >
                {cell.day > 0 ? cell.day : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="w-64 border-l border-border/30 pl-6 flex flex-col">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
            {selectedDate?.toLocaleDateString("default", { weekday: "long", month: "short", day: "numeric" })}
          </h3>
          <div className="space-y-3">
            {events.map((evt, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/20">
                <span className="text-[10px] font-mono text-primary">{evt.time}</span>
                <span className="text-xs">{evt.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarAppView;
