export interface HoursDaily {
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
  target: number;
}

export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const parseArguments = (args: string[]): HoursDaily => {
  if (args.length < 10) throw new Error("Not enough arguments");
  if (args.length > 10) throw new Error("Too many arguments");

  // Extrae los días del 3 al 9
  const days = args.slice(3, 10).map((arg, index) => {
    const num = Number(arg);
    if (isNaN(num))
      throw new Error(
        `Argument at position ${index + 2} is not a valid number`
      );
    return num;
  });

  //Partial crea una instancia del arreglo que permite que los campos sean opcionales mientras se construye en su totalidad.
  const hoursDaily: Partial<HoursDaily> = {};
  days.forEach((day, index) => {
    hoursDaily[`day${index + 1}` as keyof HoursDaily] = day;
  });

  return {
    ...hoursDaily,
    target: days[days.length - 1],
  } as HoursDaily;
};

export const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;
  const deviation = average - target;

  if (deviation >= 0) {
    rating = 3;
    ratingDescription = "Great job, you met or exceeded your target!";
  } else if (deviation >= -0.5) {
    rating = 2;
    ratingDescription = "Not too bad, but could be better";
  } else {
    rating = 1;
    ratingDescription = "You need to improve your daily exercise hours.";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};
if (require.main === module) {
  try {
    const { day1, day2, day3, day4, day5, day6, day7, target } = parseArguments(
      process.argv
    );
    const result = calculateExercises(
      [day1, day2, day3, day4, day5, day6, day7],
      target
    );
    console.log(result);
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  } // Check if the module is the main one being executed
}
