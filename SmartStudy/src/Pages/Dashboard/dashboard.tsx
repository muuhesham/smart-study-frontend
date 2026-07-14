import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Plus,
  Timer,
  Loader,
} from "lucide-react";
import { backendUrl } from "../../constants/backendUrl";
import CompletionDonutChart from "../../components/CompletionDonutChart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import api from "../../services/axios";
import Breadcrumbs from "../../components/Breadcrumbs";

interface WeeklyHoursEntry {
  day: string;
  date: string;
  hours: number;
}

interface SubjectProgressEntry {
  subjectId: string;
  name: string;
  percent: number;
}

interface DashboardData {
  studyHoursThisWeek: number;
  studyHoursDeltaVsLastWeek: number;
  subjectsCount: number;
  examsThisWeek: number;
  tasksCompletedPercent: number;
  pomodorosToday: number;
  pomodoroGoalToday: number;
  weeklyStudyHours: WeeklyHoursEntry[];
  subjectProgress: SubjectProgressEntry[];
  todaysSessionsCount: number;
}

const COLOR_CYCLE = ["teal", "indigo", "orange", "red", "purple", "blue"];
const COLOR_MAP: Record<string, string> = {
  teal: "bg-[#10b981]",
  indigo: "bg-indigo-400",
  orange: "bg-amber-400",
  red: "bg-rose-500",
  purple: "bg-purple-500",
  blue: "bg-blue-400",
};

const getStatusLabel = (percent: number) => {
  if (percent >= 70) return "On track";
  if (percent >= 40) return "Needs attention";
  return "Behind schedule";
};

const getStatusColor = (percent: number) => {
  if (percent >= 70) return "text-[#10b981]";
  if (percent >= 40) return "text-amber-400";
  return "text-rose-400";
};

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("auth");

  useEffect(() => {
    if (!token) {
      toast.error(`You aren't logged in. Return to Login Page!`);
      setTimeout(() => {
        navigate("/");
      }, 3000);
      setLoading(false);
      return;
    }

    api
      .get(`${backendUrl}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.data))
      .catch(() => {
        toast.error(`Failed to load user data`);
        <Loader
          size={48}
          className="animate-spin"
          style={{ animationDuration: "0.5s" }}
        />;
      })
      .finally(() => setLoading(false));

    api
      .get(`${backendUrl}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data.data))
      .catch(() => {
        toast.error(`Failed to load dashboard`);
        <Loader
          size={48}
          className="animate-spin"
          style={{ animationDuration: "0.5s" }}
        />;
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center w-full">
        <p className="text-zinc-400 animate-pulse">
          <Loader
            size={48}
            className="animate-spin"
            style={{ animationDuration: "0.5s" }}
          />
        </p>
      </div>
    );
  if (error || !data)
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <p className="text-rose-400">
          <Loader
            size={48}
            className="animate-spin"
            style={{ animationDuration: "0.5s" }}
          />
        </p>
      </div>
    );

  const {
    studyHoursThisWeek,
    studyHoursDeltaVsLastWeek,
    subjectsCount,
    examsThisWeek,
    tasksCompletedPercent,
    pomodorosToday,
    pomodoroGoalToday,
    weeklyStudyHours,
    subjectProgress,
    todaysSessionsCount,
  } = data;

  const isImprovement = studyHoursDeltaVsLastWeek >= 0;
  const subjectsForChart = subjectProgress.map((s, i) => ({
    id: s.subjectId,
    name: s.name,
    color: COLOR_CYCLE[i % COLOR_CYCLE.length],
    progress: s.percent,
  }));

  const scaleMax = Math.max(10, ...weeklyStudyHours.map((d) => d.hours));
  const scaleTicks = [
    scaleMax,
    scaleMax * 0.8,
    scaleMax * 0.6,
    scaleMax * 0.4,
    scaleMax * 0.2,
    0,
  ].map((n) => Math.round(n));

  return (
    <div className="text-slate-100 flex flex-col items-center justify-start selection:bg-emerald-500/30 font-sans">
      <div
        className="w-full max-w-8xl mx-auto px-6 py-10 space-y-12"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          minHeight: "auto",
        }}
        >
        <Breadcrumbs/>
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4 border-b border-slate-800/40">
          <div className="space-y-5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back,{" "}
              <span className="text-emerald-400">{user?.name}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              {todaysSessionsCount > 0
                ? `You have ${todaysSessionsCount} sessions scheduled today. Stay focused!`
                : "Your schedule is clear for today. Time to plan your next victory."}
            </p>
          </div>
          <button
            className="group flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-500/20"
            onClick={() => navigate("/studyplan")}
            style={{
              padding: "8px",
            }}
          >
            <Plus className="h-6 w-6 transition-transform duration-200" />
            <span>New Plan</span>
          </button>
        </header>

        {/* Key Metrics Grid*/}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {/* Study Hours Card */}
          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-emerald-500/50 shadow-md"
            style={{
              padding: "32px 28px",
              minHeight: "190px",
            }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Flame className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Study hours
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${isImprovement ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
              >
                <ArrowUpRight className="h-3 w-3" /> {isImprovement ? "+" : ""}
                {studyHoursDeltaVsLastWeek}%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                {studyHoursThisWeek}
                <span className="text-lg text-slate-500 font-bold">hrs</span>
              </h3>
            </div>
          </div>

          {/* Subjects Card */}
          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl  flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-indigo-500/50 shadow-md"
            style={{
              padding: "32px 28px",
              minHeight: "190px",
            }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <BookOpen className="h-8 w-8 text-indigo-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Subjects
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-4xl font-black text-white tracking-tight">
                {subjectsCount}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {examsThisWeek} exams approaching
              </p>
            </div>
          </div>

          {/* Tasks Card */}
          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-emerald-500/50 shadow-md"
            style={{
              padding: "32px 28px",
              minHeight: "190px",
            }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Tasks
                </span>
              </div>
              <div
                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${getStatusColor(tasksCompletedPercent)} bg-opacity-10`}
              >
                {getStatusLabel(tasksCompletedPercent)}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-white tracking-tight">
                {tasksCompletedPercent}%
              </h3>
            </div>
          </div>

          {/* Pomodoro Card */}
          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-amber-500/50 shadow-md"
            style={{
              padding: "32px 28px",
              minHeight: "190px",
            }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <Timer className="h-8 w-8 text-amber-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Pomodoros
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                Daily
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-black text-white tracking-tight flex items-baseline gap-1">
                {pomodorosToday}
                <span className="text-lg text-slate-500 font-bold">
                  /{pomodoroGoalToday}
                </span>
              </h3>
            </div>
          </div>
        </section>

        {/* Analytics Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Weekly Study Hours Chart */}
          <div
            className="lg:col-span-7 bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-slate-700 shadow-lg"
            style={{
              padding: "32px 28px",
              minHeight: "190px",
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Weekly Activity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Performance overview (Mon—Sun)
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full">
                Live Updates
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 h-64 sm:h-72">
              <div className="flex flex-col justify-between text-[11px] text-slate-500 font-mono pt-1">
                {scaleTicks.map((t) => (
                  <span key={t} className="opacity-70">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex-1 flex items-end gap-3 sm:gap-5">
                {weeklyStudyHours.map((entry, i) => {
                  const height = Math.round((entry.hours / scaleMax) * 100);
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center h-full group/bar"
                    >
                      <div className="w-full bg-slate-800/40 rounded-t-xl flex-1 flex items-end overflow-hidden transition-colors duration-200 group-hover/bar:bg-slate-800/70">
                        <div
                          className="bg-emerald-500 w-full rounded-t-xl transition-all duration-300 ease-out group-hover/bar:bg-emerald-400"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs mt-3 font-semibold text-slate-500 group-hover/bar:text-slate-300 transition-colors duration-200">
                        {entry.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Subject Progress List */}
          <div
            className="lg:col-span-5 bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-slate-700 shadow-lg"
            style={{
              padding: "32px 28px",
              minHeight: "190px",
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Course Progress
              </h2>
              <div className="p-2 bg-slate-800/60 rounded-xl">
                <BookOpen className="h-8 w-8 text-slate-400" />
              </div>
            </div>

            {subjectsForChart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <div className="p-4 bg-slate-800/40 rounded-full">
                  <BookOpen className="h-8 w-8 text-slate-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-semibold text-base">
                    No courses active
                  </p>
                  <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                    Add subjects to track your learning journey
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-2">
                {subjectsForChart.map((s) => (
                  <div key={s.id} className="group">
                    <div className="flex justify-between mb-2.5 text-sm">
                      <span className="font-bold text-slate-300 group-hover:text-white transition-colors duration-200">
                        {s.name}
                      </span>
                      <span className="font-mono font-extrabold text-white">
                        {s.progress}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-850 rounded-full overflow-hidden border border-slate-800/40">
                      <div
                        className={`${COLOR_MAP[s.color]} h-full rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Chart Section */}
        <div
          className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-slate-700 shadow-lg"
          style={{
            padding: "32px 28px",
            minHeight: "190px",
          }}
        >
          <CompletionDonutChart subjects={subjectsForChart} />
        </div>
      </div>
    </div>
  );
}
