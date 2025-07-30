
"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, Label } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

type ProjectionChartProps = {
  currentWeight: number;
  weightGoal: string;
};

const parseWeightGoal = (goal: string): number => {
    if (!goal) return 0;
    const match = goal.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const ProjectionChart: React.FC<ProjectionChartProps> = ({ currentWeight, weightGoal }) => {
  const weightLossKg = parseWeightGoal(weightGoal);
  const targetWeight = currentWeight - weightLossKg;

  const data = [
    { week: 0, weight: currentWeight },
    { week: 1, weight: parseFloat((currentWeight - weightLossKg * 0.25).toFixed(1)) },
    { week: 2, weight: parseFloat((currentWeight - weightLossKg * 0.5).toFixed(1)) },
    { week: 3, weight: parseFloat((currentWeight - weightLossKg * 0.75).toFixed(1)) },
    { week: 4, weight: parseFloat(targetWeight.toFixed(1)) },
  ];

  const yDomain = [Math.floor(data[data.length - 1].weight) - 2, Math.ceil(data[0].weight) + 2];

  return (
    <div className="w-full text-center space-y-4 p-2">
      <div className="mb-4 text-lg text-gray-700">
        Seguindo o plano SlimWalk, você pode chegar de <b>{currentWeight} kg</b> até <b>{targetWeight.toFixed(1)} kg</b> em <b>4 semanas</b>.
      </div>
      
      <div className="aspect-video">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="week" hide />
            <YAxis domain={yDomain} hide />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                formatter={(value: number, name, props) => [`${value} kg`, `Semana ${props.payload.week}`]}
            />
            <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" fill="url(#colorUv)" strokeWidth={4} />

            {/* Current Weight Dot */}
            <ReferenceDot x={0} y={currentWeight} r={8} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} isFront={true}>
                 <Label value="Tú" position="top" offset={10} style={{ fill: 'hsl(var(--foreground))', fontWeight: 'bold' }} />
            </ReferenceDot>

            {/* Mid point dots */}
            <ReferenceDot x={1} y={data[1].weight} r={6} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={2} isFront={true} />
            <ReferenceDot x={2} y={data[2].weight} r={6} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={2} isFront={true} />
            <ReferenceDot x={3} y={data[3].weight} r={6} fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth={2} isFront={true} />

            {/* Target Weight Dot */}
             <ReferenceDot x={4} y={targetWeight} r={8} fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth={2} isFront={true}>
                <Label value="Meta" position="bottom" offset={10} style={{ fill: 'hsl(var(--foreground))', fontWeight: 'bold' }} />
            </ReferenceDot>
          </AreaChart>
        </ResponsiveContainer>
      </div>

       <div className="text-green-700 font-semibold mb-2">
          Cada passo é um avanço. Milhares já conseguiram, agora é sua vez!
      </div>
    </div>
  );
};

export default ProjectionChart;
