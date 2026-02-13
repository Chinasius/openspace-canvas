import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Layers, Code, MousePointer, Move, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-gold animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            "--duration": `${s.duration}s`,
            "--delay": `${s.delay}s`,
            opacity: 0.4,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

const features = [
  {
    icon: MousePointer,
    title: "Drag & Drop",
    desc: "Перетаскивайте элементы на холст и стройте интерфейсы визуально",
  },
  {
    icon: Code,
    title: "XAML Engine",
    desc: "Двусторонняя синхронизация визуального редактора и XAML-разметки",
  },
  {
    icon: Layers,
    title: "Слои и группы",
    desc: "Многоуровневая иерархия элементов с блокировкой и группировкой",
  },
  {
    icon: Move,
    title: "Бесконечный холст",
    desc: "Зум, панорамирование и сетка для точного позиционирования",
  },
  {
    icon: Sparkles,
    title: "Премиальные компоненты",
    desc: "Window, Panel, Grid, Button, Slider, TabControl и другие",
  },
  {
    icon: Zap,
    title: "Горячие клавиши",
    desc: "Undo/Redo, копирование, множественное выделение — всё под рукой",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <StarField />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-gold/70 font-sans font-medium">
            by Olympus Team
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-gradient-gold animate-gold-glow mb-6"
        >
          OpenSpace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-sans"
        >
          Визуальный движок для создания интерфейсов с XAML-разметкой.
          Создавайте, перетаскивайте, стилизуйте — ваш интерфейс, ваши правила.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/editor")}
            className="bg-gold text-background hover:bg-gold-light font-display text-lg px-10 py-6 tracking-wider shadow-[0_0_30px_hsl(43_52%_54%/0.3)] hover:shadow-[0_0_50px_hsl(43_52%_54%/0.5)] transition-all duration-300"
          >
            Открыть редактор
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-5 h-8 border-2 border-gold/40 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-gold/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-32 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display text-gradient-gold text-center mb-16"
        >
          Возможности
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-lg p-6 hover:border-gold/30 transition-colors group"
            >
              <f.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          <span className="text-gradient-gold font-display">OpenSpace</span> — by Olympus Team
        </p>
      </footer>
    </div>
  );
}
