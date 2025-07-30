
"use client";

import React, { useState } from 'react';
import { useFunnelData, FunnelStep, StepData } from '@/hooks/useFunnelData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowDown, Users, ShoppingCart, CheckCircle, MousePointerClick, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { quizSteps } from '@/app/quiz/page';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MAIN_FUNNEL_STEPS_ORDER: FunnelStep[] = [
  'page_view_home',
  'start_quiz',
  'complete_quiz',
  'view_plan',
  'click_checkout'
];

const DYNAMIC_QUIZ_STEPS_ORDER: FunnelStep[] = quizSteps.map((_, index) => `quiz_step_${index}`);

const getStepLabel = (step: FunnelStep): string => {
    const mainLabels: Record<string, string> = {
        page_view_home: 'Visitaron Home',
        start_quiz: 'Iniciaron Quiz',
        complete_quiz: 'Completaron Quiz',
        view_plan: 'Vieron el Plan',
        click_checkout: 'Clic en Pagar',
    };

    if (mainLabels[step]) {
        return mainLabels[step];
    }

    if (step.startsWith('quiz_step_')) {
        const index = parseInt(step.replace('quiz_step_', ''), 10);
        const quizStep = quizSteps[index];
        if (quizStep) {
            // Shorten long titles
            const title = quizStep.title;
            return `Paso ${index + 1}: ${title.length > 40 ? title.substring(0, 40) + '...' : title}`;
        }
    }

    return step;
}

const COLORS = ['#194f2a', '#2b8a4a', '#4CAF50', '#8BC34A', '#A7D1AB'];

const DataCard: React.FC<{ title: string; value: string | number; icon: React.ElementType, description?: string }> = ({ title, value, icon: Icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
    <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
                 <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-12" />
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                     <Skeleton className="w-full h-[400px] rounded-2xl" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                </CardHeader>
                <CardContent className="w-full h-[400px] flex justify-center items-center">
                    <Skeleton className="w-full h-full" />
                </CardContent>
            </Card>
        </div>
    </div>
);

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { data, loading, error } = useFunnelData([...MAIN_FUNNEL_STEPS_ORDER, ...DYNAMIC_QUIZ_STEPS_ORDER], date);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard de Ventas</h2>
          <Skeleton className="h-10 w-60" />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
            <AlertCircle className="h-12 w-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error al cargar los datos</h2>
            <p>{error}</p>
        </div>
    );
  }

  const mainFunnelChartData = MAIN_FUNNEL_STEPS_ORDER.map((step, index) => {
    const fromCount = index > 0 ? data[MAIN_FUNNEL_STEPS_ORDER[index - 1]]?.uniqueUsers || 0 : 0;
    const toCount = data[step]?.uniqueUsers || 0;
    const conversionRate = fromCount > 0 ? ((toCount / fromCount) * 100).toFixed(1) + '%' : '100%';
    return {
        name: getStepLabel(step),
        usuarios: toCount,
        conversion: conversionRate
    };
  });

  const quizDropOffs: { from: string; fromCount: number, to: string; toCount: number, dropOff: number, dropOffPercentage: string }[] = [];
  const quizStepsWithStart = ['start_quiz', ...DYNAMIC_QUIZ_STEPS_ORDER];

  for (let i = 0; i < quizStepsWithStart.length - 1; i++) {
    const fromStep = quizStepsWithStart[i];
    const toStep = quizStepsWithStart[i+1];
    const fromCount = data[fromStep]?.uniqueUsers || 0;
    const toCount = data[toStep]?.uniqueUsers || 0;
    const dropOff = fromCount - toCount;
    const dropOffPercentage = fromCount > 0 ? ((dropOff / fromCount) * 100).toFixed(1) : '0.0';

    if (dropOff > 0) {
      quizDropOffs.push({
          from: getStepLabel(fromStep),
          fromCount,
          to: getStepLabel(toStep),
          toCount,
          dropOff,
          dropOffPercentage: `${dropOffPercentage}%`,
      });
    }
  }

  const totalVisitors = data['page_view_home']?.uniqueUsers || 0;
  const totalStartedQuiz = data['start_quiz']?.uniqueUsers || 0;
  const totalCompletedQuiz = data['complete_quiz']?.uniqueUsers || 0;
  const totalCheckouts = data['click_checkout']?.uniqueUsers || 0;
  
  const overallConversionRate = totalVisitors > 0 ? ((totalCheckouts / totalVisitors) * 100).toFixed(2) : 0;
  const quizStartRate = totalVisitors > 0 ? ((totalStartedQuiz / totalVisitors) * 100).toFixed(2) : 0;
  const quizCompletionRate = totalStartedQuiz > 0 ? ((totalCompletedQuiz / totalStartedQuiz) * 100).toFixed(2) : 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard de Ventas</h2>
        <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {date && <Button onClick={() => setDate(undefined)}>Limpiar</Button>}
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DataCard title="Visitantes Totales (Home)" value={totalVisitors} icon={Users} />
          <DataCard title="Tasa de Inicio de Quiz" value={`${quizStartRate}%`} icon={MousePointerClick} description={`${totalStartedQuiz} usuarios iniciaron`} />
          <DataCard title="Tasa de Conversión General" value={`${overallConversionRate}%`} icon={ShoppingCart} description={`${totalCheckouts} ventas`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 lg:col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">Embudo de Ventas Principal</CardTitle>
                <CardDescription>Rendimiento desde la visita hasta el pago.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={mainFunnelChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} fontSize={12} interval={0} />
                        <Tooltip
                            formatter={(value, name) => [value, name === 'usuarios' ? 'Usuarios' : 'Conversión']}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="usuarios" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-7 lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Completitud del Quiz</CardTitle>
                <CardDescription>De los que inician, cuántos completan el quiz.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                   <PieChart>
                      <Pie
                        data={[
                            { name: 'Completaron', value: totalCompletedQuiz },
                            { name: 'Abandonaron', value: totalStartedQuiz - totalCompletedQuiz },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                         <Cell key={`cell-0`} fill={COLORS[0]} />
                         <Cell key={`cell-1`} fill={COLORS[2]} />
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))'
                        }}
                      />
                      <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Análisis de Abandono del Cuestionario</CardTitle>
          <CardDescription>Usuarios que abandonaron el cuestionario en cada paso.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Paso de Origen</TableHead>
                        <TableHead className="w-[40%]">Paso Siguiente</TableHead>
                        <TableHead className="text-right">Abandono</TableHead>
                        <TableHead className="text-right">% Abandono</TableHead>
                    </TableRow>
                </TableHeader>
                 <TableBody>
                    {quizDropOffs.map((drop, index) => (
                      <TableRow key={index}>
                        <TableCell>
                            <div className="font-medium">{drop.from}</div>
                            <div className="text-sm text-muted-foreground">{drop.fromCount} usuarios</div>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{drop.to}</div>
                             <div className="text-sm text-muted-foreground">{drop.toCount} usuarios</div>
                        </TableCell>
                        <TableCell className="text-right">{drop.dropOff}</TableCell>
                        <TableCell className={`text-right font-bold ${parseFloat(drop.dropOffPercentage) > 50 ? 'text-red-500' : 'text-yellow-500'}`}>
                            {drop.dropOffPercentage}
                        </TableCell>
                      </TableRow>
                    ))}
                    {quizDropOffs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">¡No se registraron abandonos en el cuestionario para esta fecha!</TableCell>
                        </TableRow>
                    )}
                 </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
