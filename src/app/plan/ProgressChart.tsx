
"use client"

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

type ProgressChartProps = {
  currentWeight: number;
  weightLossGoal: number;
  targetWeight: number;
};

const MAX_HEALTHY_LOSS = 6;

const CustomizedLabel: React.FC<any> = (props) => {
    const { x, y, value, index } = props;
    const fillColor = '#194f2a';

    const rectWidth = 40;
    const rectHeight = 20;
    const borderRadius = 10;

    return (
      <g>
        <rect x={x - rectWidth / 2} y={y - (rectHeight + 8)} width={rectWidth} height={rectHeight} rx={borderRadius} fill={fillColor} />
        <text x={x} y={y - 14} dy={0} fill="#fff" fontSize="0.8em" fontWeight="bold" textAnchor="middle">
          {value}
        </text>
      </g>
    );
};

const ProgressChart: React.FC<ProgressChartProps> = ({ currentWeight, weightLossGoal, targetWeight }) => {
  const displayedLoss = Math.min(weightLossGoal, MAX_HEALTHY_LOSS);
  const finalWeight = currentWeight - displayedLoss;
  const showExceedsGoalMessage = weightLossGoal > MAX_HEALTHY_LOSS;

  const data = [
    { week: 'Ahora', weight: currentWeight },
    { week: 'Semana 1', weight: parseFloat((currentWeight - displayedLoss * 0.25).toFixed(1)) },
    { week: 'Semana 2', weight: parseFloat((currentWeight - displayedLoss * 0.5).toFixed(1)) },
    { week: 'Semana 3', weight: parseFloat((currentWeight - displayedLoss * 0.75).toFixed(1)) },
    { week: 'Semana 4', weight: parseFloat(finalWeight.toFixed(1)) },
  ];
  
  const yDomain = [Math.floor(data[data.length - 1].weight) - 2, Math.ceil(data[0].weight) + 2];

  return (
    <div className="w-full text-center">
        <h3 className="font-headline text-3xl md:text-4xl text-foreground mb-2">
          Así será tu progreso personalizado con SlimWalk: <br className="sm:hidden" />
          ¡Pierde <span className="font-bold text-primary">{displayedLoss} kg</span> y llega a <span className="font-bold text-primary">{finalWeight.toFixed(1)} kg</span> en 30 días!
        </h3>
        <p className="font-body text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">Este gráfico fue creado solo para ti, usando tus datos y tu meta. Así puedes transformar tu cuerpo y salud, paso a paso, siguiendo tu plan personalizado.</p>
        
        <div className="aspect-video p-4 rounded-2xl mx-auto shadow-xl border-4 border-primary/20 bg-card/60">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart 
                data={data}
                margin={{
                    top: 40,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" tick={{ fontWeight: 'bold' }} />
                <YAxis 
                    domain={yDomain} 
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                    tick={{ fontWeight: 'bold' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                    formatter={(value: number) => [`${value} kg`, "Peso estimado"]}
                />
                <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--cta))"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    dot={{ r: 6 }}
                    label={<CustomizedLabel />}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        <Badge variant="default" className="mt-8 text-lg py-2 px-4 bg-primary text-primary-foreground font-bold" style={{ backgroundColor: '#194f2a' }}>
          <BarChart3 className="h-5 w-5 mr-2" />
          ¡Este es tu plan único, no genérico!
        </Badge>
        <p className="text-base md:text-lg text-muted-foreground mt-4 italic">
              {showExceedsGoalMessage 
                ? "Por tu seguridad, mostramos una meta máxima recomendada de 6 kg en 30 días. Si tu objetivo es mayor, ¡te ayudaremos a seguir avanzando después del primer mes!"
                : "Resultados esperados tras 30 días siguiendo tu plan personalizado."
              }
            </p>
    </div>
  );
};

export default ProgressChart;
