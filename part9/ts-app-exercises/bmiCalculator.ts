interface userValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): userValues => {
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

const calculator = (height: number, weight: number, printText: string) => {
  const value: number = weight / (((height / 100) * height) / 100);
  let result: string = "";

  if (value < 18.5) {
    result = "Underweight";
  } else if (value > 18.4 && value < 25) {
    result = "Normal range";
  } else if (value > 24.9 && value < 30) {
    result = "Overweight";
  } else if (value > 29.9) {
    result = "Obese";
  }

  console.log(printText, result);
};

try {
  const { height, weight } = parseArguments(process.argv);
  calculator(
    height,
    weight,
    `According to Height: ${height} and Weight: ${weight}, the BMI is: `
  );
} catch (error: unknown) {
  let errorMessage = "Something bad happened";
  if (error instanceof Error) {
    errorMessage += "Error: " + error.message;
  }
  console.log(errorMessage);
}
