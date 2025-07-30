
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ShieldCheck, Footprints, Target } from 'lucide-react';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CountdownTimer from '@/app/plan/CountdownTimer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ProgressChart from '@/app/plan/ProgressChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { Star } from 'lucide-react';
import { trackEvent } from '@/services/tracking';
import Link from 'next/link';

const planParamsSchema = z.object({
  weightGoal: z.string().optional(),
  weightKg: z.string().optional(),
});

const MAX_HEALTHY_LOSS = 6;

const benefits = [
    { text: "Rutinas fáciles, solo 20-30 minutos al día", icon: Check },
    { text: "Ejercicios y consejos adaptados a tu nivel", icon: Check },
    { text: "Motivación diaria y guía digital descargable", icon: Check },
    { text: "Garantía de satisfacción de 30 días", icon: Check }
];

const howItWorks = [
  {
    step: "1",
    title: "Adquiere tu acceso",
    description: "Realiza el pago para desbloquear tu plan de 30 días y comenzar tu transformación."
  },
  {
    step: "2",
    title: "Accede a tu plan personal",
    description: "Recibe un plan de caminata único, creado solo para ti."
  },
  {
    step: "3",
    title: "Sigue el paso a paso",
    description: "Nota la diferencia en tu energía y bienestar cada día que caminas."
  }
];

const landingPageTestimonials = [
    {
    name: 'Sofia L.',
    avatar: 'SL',
    image: '/sofia-l.png',
    text: 'El plan se adaptó perfectamente a mi rutina de mamá ocupada. ¡Me siento con más energía que nunca!',
    rating: 4.8,
  },
  {
    name: 'Javier R.',
    avatar: 'JR',
    image: '/javier-r.png',
    text: 'Pensé que necesitaba hacer dietas extremas. Solo con caminar, mi salud y energía mejoraron muchísimo.',
    rating: 5,
  },
  {
    name: 'Maria G.',
    avatar: 'MG',
    image: '/maria-g.png',
    text: '¡Perdí 5 kilos en mi primer mes! Nunca pensé que caminar podría ser tan efectivo y divertido.',
    rating: 5,
  },
  {
    name: 'Ana P.',
    avatar: 'AP',
    image: '/ana-p.png',
    text: 'Lo mejor es la comunidad y el apoyo. Sabes que no estás sola en este camino. ¡Recomendadísimo!',
    rating: 5,
  },
   {
    name: 'Daniela F.',
    avatar: 'DF',
    image: '/daniela-f.png',
    text: 'Lo que más me gustó fue la flexibilidad. Pude adaptar las caminatas a mis horarios y aun así vi resultados sorprendentes. ¡Muy recomendado!',
    rating: 5,
  },
  {
    name: 'Roberto M.',
    avatar: 'RM',
    image: '/roberto-m.png',
    text: 'Era escéptico al principio, pero los resultados hablan por sí solos. Bajé de peso, mejoré mi postura y me siento más activo que nunca.',
    rating: 4.9,
  },
  {
    name: 'Isabella C.',
    avatar: 'IC',
    image: '/isabella-c.png',
    text: 'Este plan fue mi punto de partida. Ahora caminar es mi terapia. ¡Perdí 4 kilos y gané muchísima confianza en mí misma!',
    rating: 5,
  },
  {
    name: 'Miguel L.',
    avatar: 'ML',
    image: '/miguel-l.png',
    text: 'Como hombre, a veces uno es escéptico. Pero el plan es simple, directo y funciona. Bajé de talla y me siento mucho más ágil.',
    rating: 5,
  },
  {
    name: 'Patricia T.',
    avatar: 'PT',
    image: '/patricia-t.png',
    text: 'Tengo 58 años y este plan me devolvió la vitalidad. Mis rodillas ya no duelen y duermo mucho mejor. ¡Gracias SlimWalk!',
    rating: 5,
  },
  {
    name: 'Daniela F.',
    avatar: 'DF',
    image: '/daniela-f.png',
    text: 'Lo que más me gustó fue la flexibilidad. Pude adaptar las caminatas a mis horarios y aun así vi resultados sorprendentes. ¡Muy recomendado!',
    rating: 5,
  },
  {
    name: 'Roberto M.',
    avatar: 'RM',
    image: '/roberto-m.png',
    text: 'Era escéptico al principio, pero los resultados hablan por sí solos. Bajé de peso, mejoré mi postura y me siento más activo que nunca.',
    rating: 4.9,
  },
  {
    name: 'Isabella C.',
    avatar: 'IC',
    image: '/isabella-c.png',
    text: 'Este plan fue mi punto de partida. Ahora caminar es mi terapia. ¡Perdí 4 kilos y gané muchísima confianza en mí misma!',
    rating: 5,
  },
];


const faqs = [
    {
        question: "¿Y si no consigo terminar el plan?",
        answer: "¡No te preocupes! El plan está diseñado para ser flexible y adaptarse a tu ritmo. No se trata de una carrera, sino de crear un hábito saludable. Si te saltas un día, puedes retomarlo al siguiente. Además, tendrás acceso vitalicio, así que puedes repetirlo o ajustarlo siempre que lo necesites. Lo importante es no rendirse, ¡cada paso cuenta!"
    },
    {
        question: "Nunca conseguí adelgazar con otros métodos, ¿por qué este sería diferente?",
        answer: "Entendemos tu escepticismo. La diferencia de SlimWalk es su simplicidad y personalización. No te pedimos dietas extremas ni ejercicios agotadores, sino que integramos un hábito poderoso y natural (caminar) en tu vida, de una forma que se adapta a TI. Por eso es sostenible y por eso funciona."
    },
    {
        question: "¿Necesito seguimiento médico?",
        answer: "Siempre recomendamos consultar a un médico antes de iniciar cualquier nuevo programa de ejercicios, especialmente si tienes condiciones médicas preexistentes. Nuestro plan se basa en caminar, una actividad de bajo impacto, pero tu seguridad es lo primero. Él podrá darte la mejor orientación para tu caso particular."
    },
    {
        question: "¿Cuándo empiezo a ver resultados?",
        answer: "Cada cuerpo es diferente, pero muchas de nuestras usuarias notan un aumento de energía y bienestar en la primera semana. La pérdida de peso visible suele comenzar a notarse a partir de la segunda o tercera semana si sigues el plan."
    },
    {
        question: "¿Qué pasa si no puedo caminar todos los días?",
        answer: "¡No hay problema! El plan está diseñado para ser flexible. Se basa en los días que dijiste que podías comprometerte. Si un día no puedes, simplemente retómalo al día siguiente. La clave es la constancia, no la perfección."
    },
    {
        question: "¿Necesito algún equipo especial?",
        answer: "No, solo necesitas un par de zapatillas cómodas y ganas de empezar. No es necesario ir a un gimnasio ni comprar equipo costoso. Puedes hacer tus caminatas al aire libre o incluso en una cinta si lo prefieres."
    },
    {
        question: "¿Este plan incluye una dieta?",
        answer: "El plan principal se centra en la caminata, pero te daremos consejos de nutrición sencillos y prácticos para potenciar tus resultados. No se trata de una dieta estricta, sino de aprender a comer de forma más inteligente."
    },
    {
        question: "¿El pago es seguro?",
        answer: "Sí, tu pago es 100% seguro. Es procesado por Hotmart, una de las plataformas de pagos más grandes y seguras del mundo. Hotmart utiliza encriptación de última generación para proteger tus datos en todo momento. Aceptamos las principales tarjetas de crédito y débito."
    },
    {
        question: "¿Qué ocurre después de los 30 días?",
        answer: "El acceso a tu plan es vitalicio. Después de los 30 días, puedes repetir el plan, aumentar la intensidad o simplemente mantener el hábito de caminar que ya habrás creado. Muchas usuarias siguen usando los principios del plan por meses."
    },
    {
        question: "¿Es adecuado para principiantes?",
        answer: "¡Totalmente! El plan se personaliza según tu nivel de actividad actual. Si eres principiante, comenzaremos con metas realistas y aumentaremos la intensidad gradualmente para que tu cuerpo se adapte sin riesgo de lesiones."
    },
    {
        question: "¿Hay alguna garantía?",
        answer: "¡Sí! Confiamos tanto en nuestro método que te ofrecemos una garantía de satisfacción de 30 días. Si después de seguir el plan no estás contenta con tus resultados, te devolvemos tu dinero sin hacer preguntas."
    },
    {
        question: "¿En qué se diferencia de una app gratuita?",
        answer: "A diferencia de las apps genéricas, SlimWalk crea un plan basado en TUS respuestas: tu edad, peso, meta, y estilo de vida. Es como tener un entrenador personal que diseña la rutina perfecta para ti, no una solución única para todos."
    },
    {
        question: "¿Cómo recibo el acceso?",
        answer: "El acceso es inmediato. Justo después de completar tu pago, recibirás un correo electrónico con un enlace para acceder a tu plan personalizado. Podrás verlo en tu teléfono, tablet o computadora al instante."
    }
]

// Helper function to extract number from weight goal string
const parseWeightGoal = (goal: string | undefined): number => {
    if (!goal) return 0;
    const match = goal.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};


const processingSteps = [
  "Analizando tus respuestas…",
  "Buscando el mejor plan para ti…",
  "Personalizando tu programa día a día…",
  "Añadiendo recomendaciones de expertos…",
  "¡Casi listo! Preparando tu programa especial de 30 días…",
];

const TOTAL_DURATION = 20000; // 20 seconds
const STEP_DURATION = TOTAL_DURATION / processingSteps.length;

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} fill="currentColor" className="w-5 h-5" />);
  }
  return stars;
};

// Function to shuffle the array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function ProcessingPage({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  
  const [shuffledTestimonials, setShuffledTestimonials] = useState<any[]>([]);

  useEffect(() => {
    setShuffledTestimonials(shuffleArray([...landingPageTestimonials]));
  }, []);

  useEffect(() => {
      const stepTimer = setInterval(() => {
        setCurrentStep((prevStep) => {
          if (prevStep < processingSteps.length - 1) {
            return prevStep + 1;
          }
          return prevStep;
        });
      }, STEP_DURATION);
  
      const progressTimer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(progressTimer);
            clearInterval(stepTimer);
            setTimeout(() => {
              trackEvent('view_plan');
              onComplete();
            }, 1000); // Wait a moment after completion
            return 100;
          }
          return Math.min(oldProgress + 1, 100);
        });
      }, TOTAL_DURATION / 100);
  
      return () => {
        clearInterval(stepTimer);
        clearInterval(progressTimer);
      };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background p-4 sm:p-6 text-center">
      <div className="w-full max-w-lg space-y-8 mt-12">
        <header className="space-y-4">
          <h1 className="font-headline text-4xl text-primary animate-pulse flex items-center justify-center gap-4">
            <Footprints className="h-10 w-10" />
            <span>Creando tu plan...</span>
          </h1>
          <Progress value={progress} className="w-full h-2 quiz-progress" />
        </header>

        <main className="w-full h-24 flex items-center justify-center">
          <div key={currentStep} className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
            <p className="font-body text-2xl text-foreground/90 font-semibold">
              {processingSteps[currentStep]}
            </p>
          </div>
        </main>
        
        <footer className="pt-4">
           <p className="font-body text-base text-muted-foreground/80">
            SlimWalk está creando tu plan único y personalizado.
          </p>
          <p className="font-body text-sm text-muted-foreground/60 mt-2">
            Esto puede tardar unos segundos…
          </p>
        </footer>
      </div>
      
      <section className="w-full max-w-4xl mx-auto py-8 opacity-85">
          <h3 className="font-headline text-2xl md:text-3xl text-foreground/90 mb-4">Lo que dicen nuestros caminantes:</h3>
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {shuffledTestimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="glassmorphism text-card-foreground shadow-xl border-primary/10 h-full flex flex-col">
                      <CardHeader className="items-center">
                        <Avatar className="w-20 h-20 mb-2 border-4 border-primary">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            priority={index < 2}
                            loading={index < 2 ? 'eager' : 'lazy'}
                            data-ai-hint="person portrait"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline text-xl">{testimonial.name}</CardTitle>
                        <div className="flex text-yellow-400">
                          {renderStars(testimonial.rating)}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="font-body text-base text-foreground/90 font-semibold">"{testimonial.text}"</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
    </div>
  );
}


function PlanContent() {
  const searchParams = useSearchParams();
  const [weightGoalText, setWeightGoalText] = useState('');
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [weightLossGoal, setWeightLossGoal] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState<number | null>(null);
  
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const [shuffledTestimonials, setShuffledTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const parsedParams = planParamsSchema.safeParse(params);
    if (parsedParams.success) {
      setWeightGoalText(parsedParams.data.weightGoal || '');
      
      const goalKg = parseWeightGoal(parsedParams.data.weightGoal);
      setWeightLossGoal(goalKg);

      if (parsedParams.data.weightKg) {
          const cw = parseFloat(parsedParams.data.weightKg);
          setCurrentWeight(cw);
          if (goalKg) {
            setTargetWeight(cw - goalKg);
          }
      }
    } else {
      console.error(parsedParams.error);
    }
    
    setShuffledTestimonials(shuffleArray([...landingPageTestimonials]));
  }, [searchParams]);

  if (searchParams === null) {
      return null; 
  }
  
  const showExceedsGoalMessage = weightLossGoal !== null && weightLossGoal > MAX_HEALTHY_LOSS;

  return (
    <main className="min-h-screen bg-background font-body">
      {/* 1. Sticky Urgency Banner */}
      <div className="bg-gradient-to-r from-cta to-cta-accent text-cta-foreground p-3 text-center font-semibold sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-center gap-2 text-lg md:text-xl">
            <p>✓ Tu plan personalizado está listo. Reserva exclusiva por <CountdownTimer /></p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-20 md:space-y-24">
        
        {/* 2. Hero Section */}
        <header className="text-center space-y-4">
          <h1 className="font-headline text-4xl md:text-5xl text-center mb-4">
            ¡Transforma tu cuerpo y mente en solo 30 días… <span className="gradient-text-accent">caminando</span>!
          </h1>
          <p className="text-xl md:text-2xl text-center text-muted-foreground mb-6">
            Recibe un plan hecho para ti, sin complicaciones, sin dietas imposibles—solo pasos sencillos y motivación diaria.
          </p>
        </header>

        {/* 3. Emotional Hook */}
        <section className="text-center">
            <p className="font-body text-2xl md:text-3xl text-foreground/90 max-w-3xl mx-auto italic">
                "Elige un nuevo comienzo. Si puedes caminar, puedes transformar tu cuerpo y tu energía, desde hoy mismo."
            </p>
        </section>

        {/* 4. Personalization */}
        {weightGoalText && (
          <Alert className="text-center p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-[#194f2a] to-[#2b8a4a] border-none animate-in fade-in-50 duration-500">
            <AlertTitle className="font-headline text-2xl md:text-3xl !text-primary-foreground text-center">¡Tu Meta Está Clara!</AlertTitle>
            <AlertDescription className="font-body text-lg md:text-xl !text-primary-foreground/90 mt-2">
              Basado en tus respuestas, te ayudaremos a alcanzar tu meta de <span className="font-bold">{weightGoalText}</span>.
            </AlertDescription>
          </Alert>
        )}

        {/* 5. Visual Graph */}
        <section className="text-center">
            {currentWeight && weightLossGoal && targetWeight ? (
                <ProgressChart currentWeight={currentWeight} weightLossGoal={weightLossGoal} targetWeight={targetWeight} />
            ) : (
                <Skeleton className="w-full h-[400px] rounded-2xl" />
            )}
        </section>
        
        {/* 6. How It Works */}
        <section>
            <h2 className="font-headline text-3xl md:text-5xl text-center text-foreground mb-10">¿Cómo Funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {howItWorks.map((item) => (
                    <div key={item.step} className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-2xl font-headline mb-4" style={{ backgroundColor: '#194f2a' }}>
                            {item.step}
                        </div>
                        <h3 className="font-headline text-2xl md:text-3xl text-foreground mb-2">{item.title}</h3>
                        <p className="text-lg md:text-xl text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 7. Benefits Section */}
        <section>
            <h2 className="font-headline text-3xl md:text-5xl text-center text-foreground mb-10">¿Qué incluye tu plan?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg glassmorphism">
                        <benefit.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                        <span className="text-2xl font-semibold text-foreground/90">{benefit.text}</span>
                    </div>
                ))}
            </div>
        </section>
        
        {/* 8. Single Offer Section */}
        <section className="text-center">
            <Card className="max-w-md mx-auto glassmorphism shadow-2xl border-2 border-primary transform hover:-translate-y-2 transition-transform duration-300">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Acceso único al plan de 30 días</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-6xl md:text-7xl font-bold font-headline text-foreground">$9<span className="text-2xl md:text-3xl font-body text-muted-foreground"> USD</span></p>
                    <CardDescription className="mt-2 text-lg md:text-xl text-muted-foreground">Pago único. Sin mensualidades. Acceso para siempre.</CardDescription>
                </CardContent>
                <CardFooter className="flex-col gap-4 px-6 pb-6">
                    <Link href="https://pay.hotmart.com/M101068194T" className="w-full" onClick={() => trackEvent('click_checkout')}>
                      <Button variant="cta" size="lg" className="w-full h-16 text-2xl font-bold font-headline rounded-full shadow-lg">
                          Obtener mi plan de 30 días
                      </Button>
                    </Link>
                    <div className="flex items-start justify-center gap-2 text-sm font-bold text-green-800 bg-green-100 p-3 rounded-md mt-4 w-full">
                        <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0"/>
                        <div className="text-left">
                            <p className="uppercase">GARANTÍA DE SATISFACCIÓN</p>
                            <p className="font-normal text-xs">30 días o te devolvemos tu dinero.</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </section>
        
        {/* 9. Testimonials */}
        <section>
          <h2 className="font-headline text-3xl md:text-5xl text-center text-foreground mb-10">Lo que dicen nuestras caminantes</h2>
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {shuffledTestimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="glassmorphism text-card-foreground shadow-xl border-primary/10 h-full flex flex-col">
                      <CardHeader className="items-center">
                        <Avatar className="w-20 h-20 mb-2 border-4 border-primary">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            priority={index < 2}
                            loading={index < 2 ? 'eager' : 'lazy'}
                            data-ai-hint="person portrait"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          />
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="font-headline text-xl">{testimonial.name}</CardTitle>
                        <div className="flex text-yellow-400">
                          {renderStars(testimonial.rating)}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="font-body text-base text-foreground/90 font-semibold">"{testimonial.text}"</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>


        {/* 10. FAQ */}
        <section>
            <h2 className="font-headline text-3xl md:text-5xl text-center text-foreground mb-10">Preguntas Frecuentes</h2>
            <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-headline text-xl md:text-2xl text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="font-body text-lg md:text-xl text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </section>

        {/* 11. Final CTA */}
        <section className="text-center">
            <Card className="max-w-md mx-auto glassmorphism shadow-2xl border-2 border-primary">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary">¿Lista para empezar?</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-lg md:text-xl text-muted-foreground">Tu nuevo comienzo está a solo un clic de distancia.</p>
                </CardContent>
                <CardFooter className="flex-col gap-4 px-6 pb-6">
                    <Link href="https://pay.hotmart.com/M101068194T" className="w-full" onClick={() => trackEvent('click_checkout')}>
                      <Button variant="cta" size="lg" className="w-full h-16 text-2xl font-bold font-headline rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                          Obtener mi plan de 30 días
                      </Button>
                    </Link>
                    <div className="flex items-start justify-center gap-2 text-sm font-bold text-green-800 bg-green-100 p-3 rounded-md mt-4 w-full">
                        <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0"/>
                        <div className="text-left">
                           <p className="uppercase">GARANTÍA DE SATISFACCIÓN</p>
                           <p className="font-normal text-xs">30 días o te devolvemos tu dinero.</p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </section>

        {/* 12. Footer/Support */}
        <footer className="text-center space-y-4 pt-8 border-t">
            <p className="text-base md:text-lg text-muted-foreground">¿Tienes preguntas? Contacta nuestro soporte: <a href="mailto:info@slimwalk.fit" className="underline text-primary hover:text-accent">info@slimwalk.fit</a></p>
            <p className="text-sm md:text-base text-muted-foreground/80">Tus datos están protegidos – Política de Privacidad</p>
        </footer>
      </div>
    </main>
  );
}

function PlanPageContent() {
    const [showPlan, setShowPlan] = useState(false);

    // This logic replaces the immediate timeout. Now, PlanContent only shows when ProcessingPage calls onComplete.
    if (showPlan) {
        return <PlanContent />;
    }

    return <ProcessingPage onComplete={() => setShowPlan(true)} />;
}

export default function PlanPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-screen" />}>
            <PlanPageContent />
        </Suspense>
    );
}
