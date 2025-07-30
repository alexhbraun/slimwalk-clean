
"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';

export type FunnelStep = string;

export interface EventData {
  id: string;
  sessionId: string;
  step: FunnelStep;
  timestamp: Timestamp;
  path: string;
}

export interface StepData {
  totalEvents: number;
  uniqueUsers: number;
}

export function useFunnelData(steps: FunnelStep[], date?: Date) {
  const [data, setData] = useState<Record<FunnelStep, StepData>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedSteps = useMemo(() => steps, [steps]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const eventsCollection = collection(db, 'funnel_events');
        let q = query(eventsCollection);

        if (date) {
            const beginningOfDay = startOfDay(date);
            const endOfDayTimestamp = endOfDay(date);
            q = query(q, 
                where('timestamp', '>=', Timestamp.fromDate(beginningOfDay)),
                where('timestamp', '<=', Timestamp.fromDate(endOfDayTimestamp))
            );
        }

        const querySnapshot = await getDocs(q);

        const events = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as EventData[];
        
        const initialData = memoizedSteps.reduce((acc, step) => {
            acc[step] = { totalEvents: 0, uniqueUsers: 0 };
            return acc;
        }, {} as Record<FunnelStep, StepData>);

        const uniqueUsersPerStep = memoizedSteps.reduce((acc, step) => {
            acc[step] = new Set<string>();
            return acc;
        }, {} as Record<FunnelStep, Set<string>>);


        for (const event of events) {
          if (event.step && initialData[event.step]) {
            initialData[event.step].totalEvents += 1;
            uniqueUsersPerStep[event.step].add(event.sessionId);
          }
        }

        (Object.keys(initialData) as FunnelStep[]).forEach(step => {
            initialData[step].uniqueUsers = uniqueUsersPerStep[step].size;
        });

        setData(initialData);
      } catch (e: any) {
        setError("Failed to fetch funnel data: " + e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [date, memoizedSteps]);

  return { data, loading, error };
}
