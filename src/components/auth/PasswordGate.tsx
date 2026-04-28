import { useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";

const STORAGE_KEY = "infotainment_unlocked";
const PASSWORD = "pass1983";

const PasswordGate = ({ children }: { children: ReactNode }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border/50 bg-muted/40 backdrop-blur-md p-8 flex flex-col gap-5 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Lock size={22} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Locked</h1>
          <p className="text-xs text-muted-foreground">Enter the password to access the infotainment system.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            className={`w-full rounded-lg bg-background/60 border px-3 py-2 text-sm outline-none transition-colors ${
              error ? "border-destructive" : "border-border focus:border-primary"
            }`}
            placeholder="Password"
          />
          {error && <span className="text-xs text-destructive">Incorrect password</span>}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Unlock
        </button>
      </form>
    </div>
  );
};

export default PasswordGate;
