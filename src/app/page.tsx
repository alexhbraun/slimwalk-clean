
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

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
    name: 'Lucía M.',
    avatar: 'LM',
    image: '/lucia-m.png',
    text: 'Mi autoestima subió mucho. Ahora disfruto salir a caminar cada día. ¡Es un cambio que recomendaría a todas!',
    rating: 4.9,
  },
  {
    name: 'Carlos V.',
    avatar: 'CV',
    image: '/carlos-v.png',
    text: 'SlimWalk me motivó a ser constante. Perdí 3 kg en 4 semanas y mis caminatas ahora son parte de mi día.',
    rating: 4.9,
  },
  {
    name: 'Camila S.',
    avatar: 'CS',
    image: '/camila-s.png',
    text: '¡Increíble! Pensé que odiaba el ejercicio, pero las caminatas se sienten como un momento para mí. Ya bajé 4 kilos y mi energía está por las nubes.',
    rating: 4.9,
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

export default function Home() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    const [shuffledTestimonials, setShuffledTestimonials] = useState<any[]>([]);

    useEffect(() => {
        setShuffledTestimonials(shuffleArray([...landingPageTestimonials]));
    }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8 pt-0">
      <div className="w-full max-w-4xl mx-auto text-center mt-12 sm:mt-16">
        <header className="mb-10">
          <h1 className="font-headline text-4xl md:text-6xl text-foreground leading-tight">
            <span className="gradient-text">Miles de personas</span> ya comenzaron a transformar su vida con <span className="gradient-text">SlimWalk.</span>
          </h1>
          <p className="font-body text-xl md:text-2xl mt-6 text-muted-foreground">¿Te unes a este movimiento de bienestar?</p>
        </header>
        <section className="mb-12">
          <Link href="/quiz">
            <Button variant="cta" size="lg" className="w-full max-w-md h-16 text-2xl font-bold font-headline rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              ¡Sí, quiero mi plan!
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground font-body">Recibe un plan de caminata personalizado en 2 minutos.</p>
        </section>

        <section className="w-full mx-auto py-8">
          <h2 className="font-headline text-3xl md:text-4xl text-foreground mb-8">Lo que dicen nuestras caminantes</h2>
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

        <footer className="mt-16 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SlimWalk. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  );
}
