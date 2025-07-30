

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { LucideIcon } from 'lucide-react';
import type { QuizData } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { trackEvent } from '@/services/tracking';
import ProjectionChart from './ProjectionChart';
import QuizProgress from './QuizProgress';

// Dynamically import lucide-react icons
const dynamicIconImports = {
  ArrowLeft: () => import('lucide-react').then(mod => ({ default: mod.ArrowLeft })),
  Star: () => import('lucide-react').then(mod => ({ default: mod.Star })),
  MoveUp: () => import('lucide-react').then(mod => ({ default: mod.MoveUp })),
  ShieldCheck: () => import('lucide-react').then(mod => ({ default: mod.ShieldCheck })),
  HeartPulse: () => import('lucide-react').then(mod => ({ default: mod.HeartPulse })),
  PartyPopper: () => import('lucide-react').then(mod => ({ default: mod.PartyPopper })),
  CheckCircle2: () => import('lucide-react').then(mod => ({ default: mod.CheckCircle2 })),
  User: () => import('lucide-react').then(mod => ({ default: mod.User })),
  GraduationCap: () => import('lucide-react').then(mod => ({ default: mod.GraduationCap })),
  Briefcase: () => import('lucide-react').then(mod => ({ default: mod.Briefcase })),
  Users: () => import('lucide-react').then(mod => ({ default: mod.Users })),
  Leaf: () => import('lucide-react').then(mod => ({ default: mod.Leaf })),
  Sprout: () => import('lucide-react').then(mod => ({ default: mod.Sprout })),
  Bed: () => import('lucide-react').then(mod => ({ default: mod.Bed })),
  Footprints: () => import('lucide-react').then(mod => ({ default: mod.Footprints })),
  Zap: () => import('lucide-react').then(mod => ({ default: mod.Zap })),
  Laptop: () => import('lucide-react').then(mod => ({ default: mod.Laptop })),
  Wrench: () => import('lucide-react').then(mod => ({ default: mod.Wrench })),
  Home: () => import('lucide-react').then(mod => ({ default: mod.Home })),
  Sunrise: () => import('lucide-react').then(mod => ({ default: mod.Sunrise })),
  ClipboardPen: () => import('lucide-react').then(mod => ({ default: mod.ClipboardPen })),
  Trophy: () => import('lucide-react').then(mod => ({ default: mod.Trophy })),
  Scale: () => import('lucide-react').then(mod => ({ default: mod.Scale })),
  BatteryCharging: () => import('lucide-react').then(mod => ({ default: mod.BatteryCharging })),
  Wind: () => import('lucide-react').then(mod => ({ default: mod.Wind })),
  Hourglass: () => import('lucide-react').then(mod => ({ default: mod.Hourglass })),
  Battery: () => import('lucide-react').then(mod => ({ default: mod.Battery })),
  CircleDashed: () => import('lucide-react').then(mod => ({ default: mod.CircleDashed })),
  Droplets: () => import('lucide-react').then(mod => ({ default: mod.Droplets })),
  MoonStar: () => import('lucide-react').then(mod => ({ default: mod.MoonStar })),
  ThumbsUp: () => import('lucide-react').then(mod => ({ default: mod.ThumbsUp })),
  ThumbsDown: () => import('lucide-react').then(mod => ({ default: mod.ThumbsDown })),
  HelpCircle: () => import('lucide-react').then(mod => ({ default: mod.HelpCircle })),
  Dumbbell: () => import('lucide-react').then(mod => ({ default: mod.Dumbbell })),
  BarChart3: () => import('lucide-react').then(mod => ({ default: mod.BarChart3 })),
  Medal: () => import('lucide-react').then(mod => ({ default: mod.Medal })),
  Weight: () => import('lucide-react').then(mod => ({ default: mod.Weight })),
  Target: () => import('lucide-react').then(mod => ({ default: mod.Target })),
  Apple: () => import('lucide-react').then(mod => ({ default: mod.Apple })),
  Beef: () => import('lucide-react').then(mod => ({ default: mod.Beef })),
  Waves: () => import('lucide-react').then(mod => ({ default: mod.Waves })),
  PersonStanding: () => import('lucide-react').then(mod => ({ default: mod.PersonStanding })),
  Smile: () => import('lucide-react').then(mod => ({ default: mod.Smile })),
  Meh: () => import('lucide-react').then(mod => ({ default: mod.Meh })),
  Frown: () => import('lucide-react').then(mod => ({ default: mod.Frown })),
  Droplet: () => import('lucide-react').then(mod => ({ default: mod.Droplet })),
  CalendarClock: () => import('lucide-react').then(mod => ({ default: mod.CalendarClock })),
  Rocket: () => import('lucide-react').then(mod => ({ default: mod.Rocket })),
  Sofa: () => import('lucide-react').then(mod => ({ default: mod.Sofa })),
  Bike: () => import('lucide-react').then(mod => ({ default: mod.Bike })),
  TrendingUp: () => import('lucide-react').then(mod => ({ default: mod.TrendingUp })),
  Group: () => import('lucide-react').then(mod => ({ default: mod.Group })),
  ArrowRight: () => import('lucide-react').then(mod => ({ default: mod.ArrowRight })),
  Badge: () => import('lucide-react').then(mod => ({ default: mod.Badge })),
  Check: () => import('lucide-react').then(mod => ({ default: mod.Check })),
  Sparkles: () => import('lucide-react').then(mod => ({ default: mod.Sparkles })),
  Shield: () => import('lucide-react').then(mod => ({ default: mod.Shield })),
  HeartCrack: () => import('lucide-react').then(mod => ({ default: mod.HeartCrack })),
  Bone: () => import('lucide-react').then(mod => ({ default: mod.Bone })),
};

type IconName = keyof typeof dynamicIconImports;

const IconRenderer = ({ name, ...props }: { name: IconName; [key: string]: any }) => {
  const LazyIcon = React.lazy(dynamicIconImports[name]);
  return (
    <Suspense fallback={<div className="w-6 h-6" />}>
      <LazyIcon {...props} />
    </Suspense>
  );
};

const ArrowLeft = React.lazy(dynamicIconImports.ArrowLeft);
const Sparkles = React.lazy(dynamicIconImports.Sparkles);
const CheckCircle2 = React.lazy(dynamicIconImports.CheckCircle2);
const Group = React.lazy(dynamicIconImports.Group);
const ArrowRight = React.lazy(dynamicIconImports.ArrowRight);
const BadgeIcon = React.lazy(dynamicIconImports.Badge);
const MoveUp = React.lazy(dynamicIconImports.MoveUp);

const chartData = [
  { name: 'Semana 1', "Sin seguimiento": 10, "Con SlimWalk": 10 },
  { name: 'Semana 2', "Sin seguimiento": 12, "Con SlimWalk": 25 },
  { name: 'Semana 3', "Sin seguimiento": 11, "Con SlimWalk": 50 },
  { name: 'Semana 4', "Sin seguimiento": 15, "Con SlimWalk": 85 },
];

const allTestimonialImages = [
    '/sofia-l.png',
    '/javier-r.png',
    '/maria-g.png',
    '/ana-p.png',
    '/carlos-v.png',
    '/lucia-m.png',
    '/camila-s.png',
    '/miguel-l.png',
    '/patricia-t.png',
    '/daniela-f.png',
    '/roberto-m.png',
    '/isabella-c.png'
];

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export const quizSteps = [
    // Bloco 1: Identidade e Objetivo
    { key: 'gender', title: '¿Cuál es tu género?', type: 'radio-group', options: [{ value: 'Mujer', label: 'Mujer', icon: 'User' }, { value: 'Hombre', label: 'Hombre', icon: 'User' }] },
    { key: 'ageRange', title: '¿Cuál es tu grupo de edad?', type: 'radio-group', options: [{ value: '18-29', label: '18-29', icon: 'GraduationCap' }, { value: '30-39', label: '30-39', icon: 'Briefcase' }, { value: '40-49', label: '40-49', icon: 'Users' }, { value: '50-59', label: '50-59', icon: 'Leaf' }, { value: '60+', label: '60+', icon: 'Sprout' }] },
    { key: 'heightCm', title: '¿Cuál es tu estatura?', type: 'number-input', placeholder: '165 cm' },
    { key: 'weightKg', title: '¿Cuál es tu peso actual?', type: 'number-input', placeholder: '70 kg' },
    { key: 'weightGoal', title: '¿Cuál es tu meta de peso?', description: 'Selecciona cuántos kilos quieres perder.', type: 'select', options: Array.from({ length: 10 }, (_, i) => ({ value: `Perder ${i + 1}kg`, label: `Perder ${i + 1} kg` })) },

    // Bloco 2: Corpo, Rotina e Estilo de Vida
    { key: 'bodyType', title: '¿Con cuál tipo de cuerpo te identificas más?', description: 'Cada cuerpo es único. Elige el que más se parezca al tuyo.', type: 'image-select', options: [{ value: 'Rectángulo', image: '/body-type-rectangle.png' }, { value: 'Reloj de arena', image: '/body-type-hourglass.png' }, { value: 'Pera', image: '/body-type-pear.png' }] },
    { key: 'activityLevel', title: '¿Cómo describirías tu nivel de actividad?', type: 'radio-group', options: [{ value: 'Sedentario', label: 'Sedentaria (poco o nada de ejercicio)', icon: 'Bed' }, { value: 'Activo', label: 'Activa (ejercicio 1-3 días/semana)', icon: 'Footprints' }, { value: 'Muy activo', label: 'Muy activa (ejercicio 4-7 días/semana)', icon: 'Zap' }] },
    { key: 'dailyRoutine', title: '¿Cómo es un día típico para ti?', type: 'radio-group', options: [
        { value: 'Mayormente sentado/a', label: 'Mayormente sentado/a', icon: 'Sofa' },
        { value: 'De pie o me muevo algo', label: 'De pie o me muevo algo', icon: 'PersonStanding' },
        { value: 'Trabajo físico pesado', label: 'Trabajo físico pesado', icon: 'Dumbbell' },
        { value: 'Activo/a, camino o hago ejercicio', label: 'Activo/a, camino o hago ejercicio', icon: 'Bike' },
        { value: 'Otro', label: 'Otro', icon: 'ClipboardPen' }
    ]},
    { key: 'before-after', title: '¡Resultados reales son posibles!', description: 'Personas como tú ya lo han logrado.', type: 'before-after', image: '/antes-despues.png', buttonText: '¡Yo también quiero!' },
    { key: 'walkingExperience', title: '¿Tienes experiencia caminando para hacer ejercicio?', type: 'radio-group', options: [{ value: 'Soy nueva en esto', label: 'Soy nueva en esto', icon: 'Sprout' }, { value: 'Lo he intentado antes', label: 'Lo he intentado antes', icon: 'PersonStanding' }, { value: 'Camino regularmente', label: 'Camino regularmente', icon: 'Footprints' }] },
    { key: 'commitmentDays', title: '¿Cuántos días por semana podrías comprometerte a caminar?', type: 'radio-group', options: [{ value: '1-2 días', label: '1-2 días', icon: 'BarChart3' }, { value: '3-4 días', label: '3-4 días', icon: 'Medal' }, { value: '5-7 días', label: '5-7 días', icon: 'Trophy' }] },
    
    // Bloco 3: Saúde e Bem-estar
    { key: 'medicalConditions', title: '¿Sufres alguna de estas condiciones médicas?', type: 'checkbox', options: [{ value: 'Diabetes', label: 'Diabetes', icon: 'Droplet' }, { value: 'Hipertensión', label: 'Hipertensión', icon: 'HeartPulse' }, { value: 'Dolor en las articulaciones', label: 'Dolor articular', icon: 'Bone' }, { value: 'Problemas de espalda', label: 'Dolor de espalda', icon: 'PersonStanding' }, { value: 'Problemas cardíacos', label: 'Problemas cardíacos', icon: 'HeartCrack' }, { value: 'Ninguna', label: 'Ninguna', icon: 'ThumbsUp' }] },
    { key: 'waterIntake', title: '¿Cuánta agua tomas al día?', type: 'radio-group', options: [{ value: 'Menos de 1 litro', label: 'Menos de 1 litro', icon: 'Droplet' }, { value: '1-2 litros', label: '1-2 litros', icon: 'Droplets' }, { value: 'Más de 2 litros', label: 'Más de 2 litros', icon: 'Waves' }] },
    { key: 'sleepQuality', title: '¿Cómo es la calidad de tu sueño?', type: 'radio-group', options: [{ value: 'Mala', label: 'Mala', icon: 'Frown' }, { value: 'Regular', label: 'Regular', icon: 'Meh' }, { value: 'Buena', label: 'Buena', icon: 'Smile' }] },
    
    // Bloco 4: Motivação e Obstáculos
    { key: 'projection', title: '¡Tu progreso comienza ahora!', type: 'projection-chart', buttonText: '¡Sí, quiero este resultado!' },
    { key: 'motivation', title: '¿Qué te motiva más para empezar?', type: 'radio-group', options: [{ value: 'Mejorar mi salud', label: 'Mejorar mi salud', icon: 'HeartPulse' }, { value: 'Perder peso', label: 'Perder peso', icon: 'Scale' }, { value: 'Tener más energía', label: 'Tener más energía', icon: 'BatteryCharging' }, { value: 'Reducir el estrés', label: 'Reducir el estrés', icon: 'Wind' }] },
    { key: 'biggestObstacle', title: '¿Cuál es tu mayor obstáculo?', type: 'radio-group', options: [{ value: 'Falta de tiempo', label: 'Falta de tiempo', icon: 'Hourglass' }, { value: 'Falta de motivación', label: 'Falta de motivación', icon: 'Battery' }, { value: 'Cansancio', label: 'Cansancio', icon: 'Bed' }, { value: 'Dolor en articulaciones', label: 'Dolor en articulaciones', icon: 'CircleDashed' }] },
    { key: 'beliefInWalking', title: '¿Crees que caminar puede ayudarte a perder peso?', type: 'radio-group', options: [{ value: 'Sí', label: 'Sí, totalmente', icon: 'ThumbsUp' }, { value: 'No', label: 'No, para nada', icon: 'ThumbsDown' }, { value: 'No estoy segura', label: 'No estoy segura', icon: 'HelpCircle' }] },
    
    // Bloco 5: Emoção e Timing
    { key: 'triedEverything', title: 'Siento que ya intenté de todo y nada funciona por mucho tiempo', type: 'radio-group', options: [{ value: 'tried-yes', label: 'Me identifico', icon: 'ThumbsUp' }, { value: 'tried-no', label: 'No, es mi primera vez', icon: 'ThumbsDown' }] },
    { key: 'resultsTiming', title: '¿En cuánto tiempo te gustaría ver resultados?', type: 'radio-group', options: [{ value: 'En 30 días', label: 'Quiero resultados rápidos (30 días)', icon: 'Rocket' }, { value: 'En 3 meses', label: 'Prefiero un cambio gradual (3 meses)', icon: 'CalendarClock' }, { value: 'Sin prisa', label: 'No tengo apuro, busco constancia', icon: 'Hourglass' }] },

    // Bloco 6: Provas Visuais e Sociais
    { key: 'comparison', title: 'Descubra o impacto de um plano guiado SlimWalk', description: 'Com base nas suas respostas, aqui está a projeção para os próximos 30 dias:', type: 'comparison-chart', buttonText: '¡Quiero esos resultados!' },
    
    // Bloco 7: Loading final (simulado)
    { key: 'final', title: '¡Felicidades!', description: 'Diste el paso más importante para comenzar tu transformación.\nAhora es tu momento.', type: 'final', buttonText: 'Conocer mi plano exclusivo' }
];

const TOTAL_QUESTIONS = quizSteps.length;

const quizMilestones = [
  { step: 0, label: 'Inicio' },
  { step: 5, label: 'Estilo de Vida' },
  { step: 11, label: 'Salud' },
  { step: 14, label: 'Motivación' },
  { step: TOTAL_QUESTIONS -1, label: 'Final' },
];


type BmiResult = {
  bmi: number;
  interpretation: string;
};

const BmiScale = ({ bmi }: { bmi: number }) => {
  // Normalize BMI to a 0-100 scale for positioning.
  // Let's cap at BMI 15 on the low end and 40 on the high end for the visual scale.
  const minBmi = 15;
  const maxBmi = 40;
  const normalizedBmi = Math.max(0, Math.min(100, ((bmi - minBmi) / (maxBmi - minBmi)) * 100));

  const categories = [
    { name: 'Bajo peso', color: 'bg-blue-400', width: '20%' }, // up to 18.5
    { name: 'Saludable', color: 'bg-green-500', width: '30%' }, // 18.5 - 24.9
    { name: 'Sobrepeso', color: 'bg-yellow-400', width: '25%' }, // 25 - 29.9
    { name: 'Obesidad', color: 'bg-red-500', width: '25%' }, // 30+
  ];

  return (
    <div className="w-full px-2 pt-2">
      <div className="relative h-8 w-full">
        <div
          className="absolute bottom-full mb-1 flex flex-col items-center"
          style={{ left: `${normalizedBmi}%`, transform: 'translateX(-50%)' }}
        >
          <span className="text-xs font-bold text-primary">{bmi}</span>
          <Suspense>
            <MoveUp className="h-4 w-4 text-primary" style={{ transform: 'rotate(180deg)' }}/>
          </Suspense>
        </div>
        <div className="flex h-3 w-full rounded-full overflow-hidden">
          {categories.map((cat, index) => (
            <div key={index} className={`${cat.color}`} style={{ width: cat.width }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{minBmi}</span>
          <span>{maxBmi}</span>
        </div>
      </div>
    </div>
  );
};


export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<QuizData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const currentStepData = quizSteps[step];
  
  const handleNext = (currentData = formData) => {
    if (!validateStep(currentData)) {
      return;
    }
    
    trackEvent(`quiz_step_${step}`);

    if (currentStepData.type === 'final' || step >= TOTAL_QUESTIONS - 1) {
      trackEvent('complete_quiz');
      const queryParams = new URLSearchParams();
      Object.entries(currentData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item));
        } else if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      router.push(`/plan?${queryParams.toString()}`);
      return;
    }

    if (step < TOTAL_QUESTIONS - 1) {
      setStep(step + 1);
    }
  };

  const calculateBmi = (weight: number, height: number) => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      let interpretation = '';

      if (bmi < 18.5) {
        interpretation = 'Tu IMC indica un peso bajo. Un plan como SlimWalk puede ayudarte a fortalecer tu cuerpo y mejorar tu bienestar general de forma saludable.';
      } else if (bmi >= 18.5 && bmi < 25) {
        interpretation = '¡Excelente! Tu IMC está en un rango saludable. SlimWalk es perfecto para mantenerte activa, tonificar tu cuerpo y conservar tu bienestar.';
      } else if (bmi >= 25 && bmi < 30) {
        interpretation = 'Tu IMC indica sobrepeso. ¡No te preocupes! Estás en el lugar ideal. SlimWalk está diseñado para ayudarte a perder peso de forma gradual y sostenible.';
      } else {
        interpretation = 'Tu IMC indica obesidad. Dar el primer paso es lo más importante, y SlimWalk te guiará en un camino seguro y efectivo para transformar tu salud.';
      }
      setBmiResult({ bmi: parseFloat(bmi.toFixed(1)), interpretation });
    } else {
      setBmiResult(null);
    }
  };

  const validateStep = (data: QuizData) => {
    const stepConf = quizSteps[step];
    if (['testimonial', 'final', 'custom-content', 'comparison-chart', 'social-proof', 'projection-chart', 'social-proof-before-result', 'before-after'].includes(stepConf.type) || (stepConf as any).content) {
      return true;
    }
    
    const newErrors: Record<string, string> = {};
    const key = stepConf.key as keyof QuizData;
    const value = data[key];

    switch (stepConf.type) {
    case 'radio-group':
    case 'select':
    case 'image-select':
        if (!value) {
            newErrors[key] = 'Por favor, selecciona una opción.';
        }
        break;
    case 'number-input':
        if (!value) {
            newErrors[key] = 'Este campo es requerido.';
        }
        break;
    case 'text-input':
        if (!data.weightGoal) newErrors.weightGoal = 'Este campo es requerido.';
        break;
    case 'checkbox':
        if ((!data.medicalConditions || data.medicalConditions.length === 0)) {
            newErrors[key] = 'Por favor, selecciona al menos una opción.';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleBack = () => {
    if (step > 0) {
      if (step === 3) setBmiResult(null); // Clear BMI result when going back from weight
      setStep(step - 1);
    }
  };

  const handleSelectAndAdvance = (key: keyof QuizData, value: any) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);
    handleNext(newFormData);
  };
  
  const handleFieldChange = (key: keyof QuizData, value: any) => {
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);

    if (key === 'weightKg') {
      const weight = parseFloat(value);
      const height = newFormData.heightCm;
      if (height) {
        calculateBmi(weight, height);
      }
    }
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentConditions = formData.medicalConditions || [];
    let updatedConditions: string[];

    if (checked) {
      if (option === 'Ninguna') {
        // If "Ninguna" is checked, clear all other options.
        updatedConditions = ['Ninguna'];
      } else {
        // If another option is checked, add it and remove "Ninguna".
        updatedConditions = [...currentConditions.filter(item => item !== 'Ninguna'), option];
      }
    } else {
      // If an option is unchecked, just remove it.
      updatedConditions = currentConditions.filter(item => item !== option);
    }
    
    handleFieldChange('medicalConditions', updatedConditions);
  }


  const progressValue = ((step + 1) / TOTAL_QUESTIONS) * 100;
  const key = currentStepData.key as keyof QuizData;

  const showContinueButton = !['radio-group', 'image-select', 'select'].includes(currentStepData.type);
  const showFinalButton = currentStepData.type === 'final';

  return (
    <div className="flex flex-col min-h-screen font-body quiz-bg-pattern">
      <main className="flex-grow flex flex-col items-center p-4 w-full">
        <div className="w-full max-w-2xl">
          <QuizProgress 
            currentStep={step}
            totalSteps={TOTAL_QUESTIONS}
            milestones={quizMilestones}
            onBack={handleBack}
          />
          
          {currentStepData.type === 'projection-chart' ? (
             <div className="result-block mx-auto max-w-lg rounded-xl shadow-lg bg-white/90 p-6 text-center relative">
                  <h2 className="font-headline text-2xl md:text-3xl font-bold mb-2" style={{ color: '#194f2a' }}>
                      {currentStepData.title}
                  </h2>
                  
                   <ProjectionChart
                      currentWeight={formData.weightKg || 0}
                      weightGoal={formData.weightGoal || ''}
                  />
                  
                  <div className="flex flex-col items-center">
                       <Button 
                          onClick={() => handleNext()} 
                          size="lg" 
                          className="w-full h-14 text-xl font-bold font-headline rounded-lg shadow-md hover:scale-105 transition bg-gradient-to-r from-orange-400 to-orange-600 text-white"
                      >
                          <span>{currentStepData.buttonText || 'Continuar'}</span>
                          <Suspense>
                            <ArrowRight className="w-6 h-6 ml-2" />
                          </Suspense>
                      </Button>
                      <p className="mt-3 text-xs text-gray-500">
                          Garantia de satisfação: resultados reais ou seu dinheiro de volta.
                      </p>
                  </div>
              </div>
          ) : (
            <Card className="w-full shadow-2xl border-none glassmorphism">
              <CardHeader className="pb-4">
                <h2
                  className="font-headline text-3xl md:text-4xl text-center"
                  style={{ color: "#014946" }}
                >
                  {currentStepData.title}
                </h2>
                {currentStepData.description && <CardDescription className="text-center text-lg text-muted-foreground/80 whitespace-pre-line">{currentStepData.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-8">
                {currentStepData.type === 'radio-group' && (
                  <div className="space-y-2">
                    <RadioGroup onValueChange={(value) => handleSelectAndAdvance(key, value)} value={formData[key] as string} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {currentStepData.options?.map((opt) => (
                        <Label key={opt.value} htmlFor={`${key}-${opt.value}`} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-primary has-[:checked]:bg-primary text-primary-foreground has-[:checked]:border-primary-foreground transition-all duration-300 transform hover:scale-105" style={{ color: '#014946' }}>
                          <RadioGroupItem value={opt.value} id={`${key}-${opt.value}`} />
                          <IconRenderer name={opt.icon as IconName} className="w-6 h-6 mr-2 shrink-0" />
                          <span className="flex-1 text-xl md:text-2xl">{opt.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                    {errors[key] && <p className="text-sm font-medium text-destructive">{errors[key]}</p>}
                  </div>
                )}
                
                {currentStepData.type === 'number-input' && (
                   <div className="space-y-4">
                    <Input id={key} type='number' placeholder={currentStepData.placeholder} onChange={(e) => handleFieldChange(key, e.target.value)} value={(formData[key] as string) || ''} className="h-14 text-2xl text-center" />
                    {errors[key] && <p className="text-sm font-medium text-destructive text-center mt-2">{errors[key]}</p>}
                    
                    {key === 'weightKg' && bmiResult && (
                      <Card className="bg-background/80 mt-4 border-primary/20 shadow-lg animate-in fade-in-50 duration-500">
                        <CardContent className="p-4 text-center">
                          <CardTitle className="font-headline text-2xl mb-2" style={{ color: '#194f2a' }}>Tu IMC es {bmiResult.bmi}</CardTitle>
                          <BmiScale bmi={bmiResult.bmi} />
                          <CardDescription className="text-base font-semibold mt-3" style={{ color: '#194f2a' }}>
                             {bmiResult.interpretation}
                          </CardDescription>
                           <p className="text-xs text-muted-foreground mt-2">*El IMC es una estimación y no reemplaza el consejo médico profesional.</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
                
                {currentStepData.type === 'text-input' && currentStepData.questions?.map((q: any) => (
                  <div key={q.key} className="space-y-2">
                    <Label htmlFor={q.key} className="text-lg font-semibold">{q.question}</Label>
                    <Input id={q.key} type="text" placeholder={q.placeholder} onChange={(e) => handleFieldChange(q.key as keyof QuizData, e.target.value)} value={(formData[q.key as keyof QuizData] as string) || ''} className="h-12 text-lg" />
                    {errors[q.key] && <p className="text-sm font-medium text-destructive">{errors[q.key]}</p>}
                  </div>
                ))}

                 {currentStepData.type === 'select' && (
                   <div className="space-y-2">
                      <Select onValueChange={(value) => handleSelectAndAdvance(key, value)} value={formData[key] as string}>
                          <SelectTrigger className="w-full h-14 text-lg">
                              <SelectValue placeholder="Selecciona tu meta" />
                          </SelectTrigger>
                          <SelectContent>
                              {currentStepData.options?.map((opt: { value: string; label: string }) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-lg">
                                      {opt.label}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                      {errors[key] && <p className="text-sm font-medium text-destructive text-center">{errors[key]}</p>}
                  </div>
                )}

                {currentStepData.type === 'image-select' && (
                  <div className="space-y-4">
                    <div className="flex justify-center items-start gap-2 md:gap-4">
                      {currentStepData.options.map((opt: any) => (
                        <div key={opt.value} onClick={() => handleSelectAndAdvance('bodyType', opt.value)} className={`flex flex-col items-center text-center p-2 border-4 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${formData.bodyType === opt.value ? 'border-primary shadow-2xl' : 'border-transparent hover:border-primary/50'}`}>
                          <div className="w-24 h-40 md:w-28 md:h-48 relative">
                            <Image src={opt.image} alt={`Tipo de cuerpo ${opt.value}`} layout="fill" objectFit="contain" className="rounded-md" />
                          </div>
                          <div className="h-14 flex items-center justify-center">
                            <p className="font-bold text-lg text-primary mt-2">{opt.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                     {errors.bodyType && <p className="text-sm font-medium text-destructive text-center">{errors.bodyType}</p>}
                  </div>
                )}

                 {currentStepData.type === 'checkbox' && (
                   <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {currentStepData.options.map((option) => (
                                <Label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary has-[:checked]:bg-primary text-primary-foreground has-[:checked]:border-primary-foreground transition-colors" style={{ color: '#014946' }}>
                                    <Checkbox 
                                      id={option.value} 
                                      onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)} 
                                      checked={(formData.medicalConditions || []).includes(option.value)}
                                    />
                                    <IconRenderer name={option.icon as IconName} className="w-6 h-6 mr-2 shrink-0" />
                                    <label htmlFor={option.value} className="font-medium leading-none flex-1 cursor-pointer text-xl md:text-2xl">
                                        {option.label}
                                    </label>
                                </Label>
                            ))}
                        </div>
                         {errors.medicalConditions && <p className="text-sm font-medium text-destructive text-center mt-2">{errors.medicalConditions}</p>}
                    </div>
                )}
                
                 {currentStepData.type === 'before-after' && (
                  <div className="w-full text-center space-y-4">
                    <div className="relative w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg">
                       <Image 
                        src={currentStepData.image || ''} 
                        alt="Antes y después" 
                        width={400} 
                        height={400} 
                        className="w-full" 
                        data-ai-hint="woman fitness progress" 
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                      />
                    </div>
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4 text-left max-w-sm mx-auto">
                      "Perdí 6kg en 30 días, sin dietas locas. ¡Solo caminando y siguiendo mi plan SlimWalk! Mi energía y confianza están por las nubes." — Lucía M.
                    </blockquote>
                  </div>
                )}

                {currentStepData.type === 'comparison-chart' && (
                  <div className="w-full text-center space-y-4">
                    <div className="aspect-video p-4">
                      <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-4">
                        <Suspense>
                            <BadgeIcon className="mr-2" />
                        </Suspense>
                        Proyección personalizada solo para ti 🚶‍♀️✨
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: 'Progreso esperado (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--background))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: 'var(--radius)',
                            }}
                          />
                          <Legend />
                          <Line type="monotone" name="Sin seguimiento" dataKey="Sin seguimiento" stroke="#ef4444" activeDot={{ r: 6 }} />
                          <Line type="monotone" name="Con SlimWalk" dataKey="Con SlimWalk" stroke="hsl(var(--primary))" strokeWidth={3} activeDot={{ r: 8 }} dot={(props) => {
                            const { key, dataKey, ...rest } = props;
                            if (rest.index === chartData.length - 1) {
                              return <circle key={key} {...rest} r={8} fill="hsl(var(--primary))" />;
                            }
                            return <circle key={key} {...rest} r={4} />;
                          }}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground italic px-4">
                      Con SlimWalk, mujeres reales consiguen mantener el ritmo y ver resultados ya en las primeras semanas. Sin seguimiento, es común desanimarse antes de alcanzar la meta.
                    </p>
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
                      "Con el plano SlimWalk, finalmente conseguí adelgazar sin sufrimiento. ¡El seguimiento diario marca toda la diferencia!" — María, 54 años
                    </blockquote>
                     <p className="text-xs text-muted-foreground/80 px-4">Resultados reales pueden variar de persona a persona.</p>
                  </div>
                )}

                {currentStepData.type === 'final' && (
                    <div className="text-center space-y-6 p-4 md:p-8">
                       <div className='space-y-4'>
                          <p className="font-semibold text-foreground">Esto es lo que te espera:</p>
                          <ul className="text-lg text-muted-foreground space-y-2 inline-block text-left">
                              <li className="flex items-start gap-2">
                                  <span>✔️</span>
                                  <span>Un plan hecho a tu medida, pensado para tus metas y tu día a día.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <span>✔️</span>
                                  <span>Consejos simples y motivadores de expertos que te acompañarán en cada paso.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                  <span>✔️</span>
                                  <span>El inicio de una vida más activa, ligera y feliz — y lo mejor, ¡hecho para ti!</span>
                              </li>
                          </ul>
                       </div>
                    </div>
                )}
                
                {(showContinueButton || currentStepData.type === 'before-after' || currentStepData.type === 'comparison-chart' ) && !showFinalButton && (
                    <div className="flex justify-center pt-6">
                    <Button 
                      onClick={() => handleNext()} 
                      size="lg" 
                      className="w-full max-w-sm h-14 text-xl font-bold font-headline rounded-full shadow-lg transform hover:scale-105"
                      variant="cta"
                    >
                        {currentStepData.buttonText || 'Continuar'}
                    </Button>
                    </div>
                )}

                {showFinalButton && (
                    <div className="flex justify-center pt-6">
                      <Button 
                        onClick={() => handleNext()} 
                        size="lg" 
                        className="w-full max-w-sm h-14 text-xl font-bold font-headline rounded-full shadow-lg transform hover:scale-105 bg-gradient-to-r from-cta to-cta-accent text-cta-foreground hover:from-cta/90 hover:to-cta-accent/90"
                      >
                        {currentStepData.buttonText || 'Conocer mi plano exclusivo'}
                      </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
