import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Github, ArrowRight, Sparkles, Download, Check, Loader2, MapPin, FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Step = "source" | "install" | "locate" | "create";

interface ProjectSetupDialogProps {
  onComplete: (projectName: string) => void;
}

function Stars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] bg-gold/40 rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            "--duration": `${2 + Math.random() * 4}s`,
            "--delay": `${Math.random() * 3}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function ProjectSetupDialog({ onComplete }: ProjectSetupDialogProps) {
  const [step, setStep] = useState<Step>("source");
  const [projectName, setProjectName] = useState("");
  const [installProgress, setInstallProgress] = useState(0);
  const [installDone, setInstallDone] = useState(false);
  const [locationPath, setLocationPath] = useState("");
  const [storageOptions, setStorageOptions] = useState({
    localFolder: true,
    projectRoot: false,
  });

  // Simulate installation progress
  useEffect(() => {
    if (step !== "install") return;
    setInstallProgress(0);
    setInstallDone(false);
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallDone(true);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [step]);

  const handleCreate = () => {
    if (projectName.trim()) {
      onComplete(projectName.trim());
    }
  };

  const pageTransition = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      <Stars />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-[150px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* Step 1: Choose source */}
        {step === "source" && (
          <motion.div key="source" {...pageTransition} className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6">
            <div className="text-center">
              <Sparkles className="w-7 h-7 text-gold/50 mx-auto mb-3" />
              <h1 className="font-display text-2xl text-gradient-gold mb-1.5">Добро пожаловать</h1>
              <p className="text-sm text-muted-foreground">Выберите способ начала работы</p>
            </div>

            <div className="w-full space-y-3">
              <motion.button
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                onClick={() => setStep("install")}
                className="w-full p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-gold/30 transition-all duration-300 flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Download className="w-5 h-5 text-gold/70" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-foreground">Скачать сборку</p>
                  <p className="text-xs text-muted-foreground">Установить с GitHub Olympus</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold/60 transition-colors" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => setStep("locate")}
                className="w-full p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-gold/30 transition-all duration-300 flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <FolderOpen className="w-5 h-5 text-gold/70" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-foreground">Есть сборка</p>
                  <p className="text-xs text-muted-foreground">Указать существующую папку проекта</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold/60 transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2a: Install from GitHub */}
        {step === "install" && (
          <motion.div key="install" {...pageTransition} className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full px-6">
            <div className="text-center">
              <Github className="w-7 h-7 text-gold/50 mx-auto mb-3" />
              <h2 className="font-display text-xl text-gradient-gold mb-1.5">Установка сборки</h2>
              <p className="text-xs text-muted-foreground">Загрузка из GitHub репозитория</p>
            </div>

            <div className="w-full space-y-4">
              <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Github className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-muted-foreground font-mono">github.com/Olympus14/Olympus.git</span>
                </div>

                <Progress value={Math.min(installProgress, 100)} className="h-1.5" />

                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>
                    {installDone ? (
                      <span className="flex items-center gap-1 text-gold/80">
                        <Check className="w-3 h-3" /> Установлено
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Загрузка...
                      </span>
                    )}
                  </span>
                  <span>{Math.min(Math.round(installProgress), 100)}%</span>
                </div>

                {!installDone && (
                  <div className="space-y-1 pt-1">
                    {[
                      installProgress > 10 && "Клонирование репозитория...",
                      installProgress > 30 && "Загрузка зависимостей...",
                      installProgress > 55 && "Сборка проекта...",
                      installProgress > 80 && "Финализация...",
                    ]
                      .filter(Boolean)
                      .map((msg, i) => (
                        <p key={i} className="text-[10px] text-muted-foreground/60 font-mono">{msg}</p>
                      ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStep("create")}
                disabled={!installDone}
                className="w-full h-9 bg-gold/90 text-background hover:bg-gold font-medium transition-all"
              >
                Продолжить
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <button onClick={() => setStep("source")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Назад
            </button>
          </motion.div>
        )}

        {/* Step 2b: Locate existing build */}
        {step === "locate" && (
          <motion.div key="locate" {...pageTransition} className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full px-6">
            <div className="text-center">
              <FolderSearch className="w-7 h-7 text-gold/50 mx-auto mb-3" />
              <h2 className="font-display text-xl text-gradient-gold mb-1.5">Выбор сборки</h2>
              <p className="text-xs text-muted-foreground">Укажите путь к папке проекта</p>
            </div>

            <div className="w-full space-y-4">
              <div className="flex gap-2">
                <Input
                  value={locationPath}
                  onChange={(e) => setLocationPath(e.target.value)}
                  placeholder="C:\Projects\MyApp"
                  className="h-9 text-xs bg-surface border-border font-mono flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 border-border text-muted-foreground hover:text-gold hover:border-gold/30"
                  onClick={() => setLocationPath("C:\\Projects\\Olympus")}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </Button>
              </div>

              <Button
                onClick={() => setStep("create")}
                disabled={!locationPath.trim()}
                className="w-full h-9 bg-gold/90 text-background hover:bg-gold font-medium transition-all"
              >
                Продолжить
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <button onClick={() => setStep("source")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Назад
            </button>
          </motion.div>
        )}

        {/* Step 3: Create project */}
        {step === "create" && (
          <motion.div key="create" {...pageTransition} className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full px-6">
            <div className="text-center">
              <h2 className="font-display text-xl text-gradient-gold mb-1.5">Создание проекта</h2>
              <p className="text-xs text-muted-foreground">Настройте параметры вашего проекта</p>
            </div>

            <div className="w-full space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Название проекта</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="MyApp"
                  autoFocus
                  className="h-10 text-sm bg-surface border-border focus:border-gold/50"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Хранение UI файлов</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer">
                    <Checkbox
                      checked={storageOptions.localFolder}
                      onCheckedChange={(v) => setStorageOptions((s) => ({ ...s, localFolder: !!v }))}
                      className="border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">Локальная папка</p>
                      <p className="text-[10px] text-muted-foreground">UI файлы хранятся в /ui рядом с проектом</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer">
                    <Checkbox
                      checked={storageOptions.projectRoot}
                      onCheckedChange={(v) => setStorageOptions((s) => ({ ...s, projectRoot: !!v }))}
                      className="border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">Корень проекта</p>
                      <p className="text-[10px] text-muted-foreground">UI файлы хранятся в корне репозитория</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="w-full h-10 bg-gold/90 text-background hover:bg-gold font-medium transition-all"
              >
                Создать проект
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            <button
              onClick={() => setStep("source")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← В начало
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
