import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Github, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "source" | "name";

interface ProjectSetupDialogProps {
  onComplete: (projectName: string) => void;
}

export default function ProjectSetupDialog({ onComplete }: ProjectSetupDialogProps) {
  const [step, setStep] = useState<Step>("source");
  const [projectName, setProjectName] = useState("");

  const handleSourceSelect = (_source: string) => {
    setStep("name");
  };

  const handleCreate = () => {
    if (projectName.trim()) {
      onComplete(projectName.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
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

      {/* Glow orb */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === "source" && (
          <motion.div
            key="source"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center"
            >
              <Sparkles className="w-8 h-8 text-gold/60 mx-auto mb-4" />
              <h1 className="font-display text-2xl text-gradient-gold mb-2">OpenSpace</h1>
              <p className="text-sm text-muted-foreground">Выберите источник проекта</p>
            </motion.div>

            <div className="w-full space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={() => handleSourceSelect("olympus")}
                  className="w-full p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-gold/30 transition-all duration-300 flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Github className="w-5 h-5 text-gold/70" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-foreground">Проект Olympus</p>
                    <p className="text-xs text-muted-foreground">Установить с GitHub</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold/70 transition-colors" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => handleSourceSelect("local")}
                  className="w-full p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover hover:border-gold/30 transition-all duration-300 flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <FolderOpen className="w-5 h-5 text-gold/70" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-foreground">Открыть проект</p>
                    <p className="text-xs text-muted-foreground">Выбрать существующий репозиторий</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold/70 transition-colors" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-6 max-w-sm w-full px-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center"
            >
              <h2 className="font-display text-xl text-gradient-gold mb-2">Название проекта</h2>
              <p className="text-xs text-muted-foreground">Как будет называться ваш проект?</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full space-y-4"
            >
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="MyApp"
                autoFocus
                className="h-11 text-center text-base bg-surface border-border focus:border-gold/50 placeholder:text-muted-foreground/40"
              />
              <Button
                onClick={handleCreate}
                disabled={!projectName.trim()}
                className="w-full h-10 bg-gold/90 text-background hover:bg-gold font-medium transition-all duration-300"
              >
                Создать проект
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <button
              onClick={() => setStep("source")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Назад
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
