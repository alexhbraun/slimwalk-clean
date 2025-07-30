export type QuizData = {
  consent?: boolean;
  gender?: 'Mujer' | 'Hombre';
  ageRange?: '18-29' | '30-39' | '40-49' | '50-59' | '60+';
  heightCm?: number;
  weightKg?: number;
  weightGoal?: string;
  resultsTiming?: 'En 30 días' | 'En 3 meses' | 'Sin prisa';
  triedEverything?: 'Sí' | 'No';
  lifestyle?: 'Sedentario' | 'Moderado' | 'Activo';
  bodyType?: string;
  activityLevel?: string;
  dailyRoutine?: string;
  walkingExperience?: string;
  commitmentDays?: string;
  motivation?: string;
  biggestObstacle?: string;
  medicalConditions?: string[];
  waterIntake?: string;
  sleepQuality?: string;
  beliefInWalking?: 'Sí' | 'No' | 'No estoy segura';
  [key: string]: any; // Allow for flexible key access
};
