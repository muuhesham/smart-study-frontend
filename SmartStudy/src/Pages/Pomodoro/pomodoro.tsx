import { useState, useEffect, useRef } from "react";
import api from "../../services/axios";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { backendUrl } from "../../constants/backendUrl";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import Breadcrumbs from "../../components/Breadcrumbs";

interface PomodoroSessionAPI {
  _id: string;
  day: string;
  sessionIndex: number;
  type: "work" | "short_break" | "long_break";
  subjectId: { _id: string; name: string; icon?: string } | null;
  topic: string | null;
  durationMinutes: number;
  status: "pending" | "completed";
  completedAt: string | null;
}

interface TodayData {
  sessions: PomodoroSessionAPI[];
  currentSessionIndex: number;
  completedWorkSessions: number;
  totalWorkSessions: number;
  totalMinutesToday: number;
}

export default function PomodoroView() {
  const [data, setData] = useState<TodayData | null>(null);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const initialDurationRef = useRef(0);

  const getToken = () => localStorage.getItem("auth");

  const fetchToday = () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get(`${backendUrl}/api/pomodoro/today`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data.data))
      .catch(() => toast.error(`Failed to load pomodoro sessions`))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const activeSession =
    data?.sessions.find((s) => s.status === "pending") ?? null;

  useEffect(() => {
    if (!isTimerRunning && activeSession) {
      const secs = activeSession.durationMinutes * 60;
      setTimeLeft(secs);
      initialDurationRef.current = secs;
    }
  }, [activeSession?._id]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && activeSession) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (timerId) clearInterval(timerId);
            handleCompleteSession(activeSession._id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isTimerRunning, activeSession?._id]);

  const handleCompleteSession = async (sessionId: string) => {
    const token = getToken();
    if (!token) return;
    try {
      await api.post(
        `${backendUrl}/api/pomodoro/sessions/${sessionId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!isMuted) {
        try {
          const audioCtx = new (
            window.AudioContext || (window as any).webkitAudioContext
          )();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.5);
        } catch (err) {
          console.warn("Audio alert not supported", err);
        }
      }
      fetchToday();
    } catch (err) {
      toast.error(`Failed to complete session`);
    }
  };

  const toggleTimer = () => {
    if (!activeSession) return;
    setIsTimerRunning((r) => !r);
  };

  const skipSession = () => {
    if (!activeSession) return;
    setIsTimerRunning(false);
    handleCompleteSession(activeSession._id);
  };

  const resetTimer = () => {
    if (!activeSession) return;
    setIsTimerRunning(false);
    const secs = activeSession.durationMinutes * 60;
    setTimeLeft(secs);
    initialDurationRef.current = secs;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const percentage =
    initialDurationRef.current > 0
      ? (timeLeft / initialDurationRef.current) * 100
      : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121214] flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <Loader
            size={48}
            className="animate-spin"
            style={{ animationDuration: "0.5s" }}
          />
        </div>
      </div>
    );
  }

  const modeLabel =
    activeSession?.type === "work" || !activeSession
      ? "Focus session"
      : activeSession.type === "short_break"
        ? "Short break"
        : "Long break";

  const currentSessionLabel =
    activeSession?.type === "work"
      ? `${activeSession.subjectId?.name ?? "Unknown"} — ${activeSession.topic ?? ""}`
      : "Take a break";

  return (
    <div className="text-slate-100 flex flex-col items-center justify-start selection:bg-emerald-500/30 font-sans">
      <div
        className="w-full max-w-8xl mx-auto px-6 py-10 space-y-8"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          minHeight: "auto",
        }}
      >
                <Breadcrumbs/>
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4 border-b border-slate-800/40">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Focus mode
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Pomodoro Timer
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Stay focused with structured study sessions and keep your plan
              moving forward.
            </p>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`group flex items-center justify-center gap-2 ${isMuted ? "bg-red-500" : "bg-green-500" } text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 shadow-lg`}
            style={{
                padding: "10px"
            }}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <Volume2 className="h-5 w-5 transition-transform duration-200" />
            )}
            <span>{isMuted ? "Muted" : "Sound On"}</span>
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-emerald-500/50 shadow-md"
            style={{ padding: "32px 28px", minHeight: "190px" }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <Timer className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Current mode
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {modeLabel}
              </h3>
            </div>
          </div>

          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-indigo-500/50 shadow-md"
            style={{ padding: "32px 28px", minHeight: "190px" }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 rounded-xl">
                  <Flame className="h-8 w-8 text-indigo-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Focus blocks
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                Live
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {data?.completedWorkSessions ?? 0} /{" "}
                {data?.totalWorkSessions ?? 0}
              </h3>
            </div>
          </div>

          <div
            className="w-full bg-[#161B26] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-300 hover:border-amber-500/50 shadow-md"
            style={{ padding: "32px 28px", minHeight: "190px" }}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-amber-400" />
                </div>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                  Total today
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {data?.totalMinutesToday ?? 0} min
              </h3>
            </div>
          </div>
        </section>

        <section className="grid items-start gap-8 lg:grid-cols-[1.25fr_0.8fr]">
          <div className="w-full bg-[#161B26] border border-slate-800/80 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[520px] shadow-md">
            <div className="w-full flex items-center justify-between mb-8">
              
            </div>

            {!activeSession ? (
              <div className="max-w-md text-center">
                <p className="text-xl font-semibold text-white">
                  No sessions for today
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
                  Generate a study plan to get Pomodoro sessions here.
                </p>
              </div>
            ) : (
              <>
                <div className="relative flex items-center justify-center my-8 lg:my-10">
                  <svg className="h-56 w-56 -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r={radius}
                      className="stroke-slate-800/80"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r={radius}
                      className={
                        activeSession.type === "work"
                          ? "stroke-[#10b981]"
                          : "stroke-indigo-400"
                      }
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.3s" }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="block text-4xl font-mono font-bold tracking-tight text-white">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-slate-400">
                      {isTimerRunning ? "Running" : "Paused"}
                    </span>
                  </div>
                </div>

                <div className="mb-8 text-center lg:mb-10">
                  <h3 className="text-lg font-semibold text-slate-200">
                    {currentSessionLabel}
                  </h3>
                  <span className="mt-2 block text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-slate-500">
                    Session{" "}
                    {data!.sessions.findIndex(
                      (s) => s._id === activeSession._id,
                    ) + 1}{" "}
                    of {data!.sessions.length}
                  </span>
                </div>

                <div className="mb-8 flex items-center gap-4 sm:gap-6 lg:gap-8">
                  <button
                    onClick={toggleTimer}
                    className="flex items-center justify-center rounded-2xl bg-[#10b981] px-6 py-4 font-bold text-[#121214] shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:bg-[#059669] active:scale-95"
                    title={isTimerRunning ? "Pause Session" : "Start Focus"}
                  >
                    {isTimerRunning ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 fill-current" />
                    )}
                  </button>

                  <button
                    onClick={skipSession}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-400 transition-all duration-200 hover:text-white active:scale-90"
                    title="Mark complete & skip to next"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  <button
                    onClick={resetTimer}
                    className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-slate-400 transition-all duration-200 hover:text-white active:scale-90"
                    title="Reset Timer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-3 flex max-w-xs flex-wrap justify-center gap-2.5">
                    {data!.sessions.map((s) => (
                      <span
                        key={s._id}
                        className={`h-3 w-3 rounded-full ${
                          s._id === activeSession._id
                            ? "scale-110 bg-[#10b981] ring-4 ring-[#10b981]/20"
                            : s.status === "completed"
                              ? "bg-[#10b981]/60"
                              : "bg-slate-800"
                        }`}
                        title={s.type === "work" ? (s.topic ?? "Work") : s.type}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {data!.completedWorkSessions} of {data!.totalWorkSessions}{" "}
                    focus blocks done
                  </span>
                </div>
              </>
            )}
          </div>

          <aside className="w-full bg-[#161B26] border border-slate-800/80 rounded-3xl p-8 flex flex-col justify-between min-h-[520px] shadow-md">
            <div
              style={{
                padding: "20px",
              }}
            >
              <h2 className="mb-6 text-lg font-bold text-white">
                Today&apos;s sessions
              </h2>

              {!data || data.sessions.length === 0 ? (
                <p className="text-sm font-medium leading-6 text-slate-400">
                  No sessions scheduled yet. Generate a study plan to see
                  today&apos;s sessions here.
                </p>
              ) : (
                <div className="flex max-h-[320px] flex-col gap-3.5 overflow-y-auto pr-1">
                  {data.sessions.map((s) => {
                    const isActive = s._id === activeSession?._id;
                    const isDone = s.status === "completed";
                    const label =
                      s.type === "work"
                        ? `${s.subjectId?.name ?? "Unknown"} — ${s.topic ?? ""}`
                        : s.type === "short_break"
                          ? "Short break"
                          : "Long break";
                    return (
                      <div
                        key={s._id}
                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                          isActive
                            ? "border-[#10b981]/60 bg-slate-800/80 text-white"
                            : "border-slate-800/50 bg-slate-900/30 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isDone
                                ? "bg-[#10b981]"
                                : isActive
                                  ? "animate-pulse bg-[#10b981]"
                                  : "bg-slate-700"
                            }`}
                          />
                          <span
                            className={`text-sm font-semibold ${isActive ? "text-white" : "text-slate-300"}`}
                          >
                            {label}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {s.durationMinutes} min
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-5 text-sm font-semibold"
            style={{
                padding: "15px"
            }}>
              <span className="text-slate-400">Total today</span>
              <span className="font-mono font-bold text-white">
                {data?.totalMinutesToday ?? 0} min
              </span>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
