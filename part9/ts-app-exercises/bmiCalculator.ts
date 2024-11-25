// bmiCalculator.ts
export interface UserValues {
  height: number;
  weight: number;
}

export const parseArguments = (args: string[]): UserValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculator = (height: number, weight: number): string => {
  const bmi = weight / (((height / 100) * height) / 100);
  let result = '';

  if (bmi < 18.5) {
    result = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    result = "Normal range";
  } else if (bmi >= 25 && bmi < 30) {
    result = "Overweight";
  } else if (bmi >= 30) {
    result = "Obese";
  }

  return result;
};

// Check if the module is the main one being executed
if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    const bmiCategory = calculator(height, weight);
    console.log(`According to Height: ${height} and Weight: ${weight}, the BMI is: ${bmiCategory}`);
  } catch (error) {
    let errorMessage = "Something bad happened";
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    console.log(errorMessage);
  }
}
