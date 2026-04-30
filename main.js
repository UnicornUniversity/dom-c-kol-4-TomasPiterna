/**
 * This is the main function of the application. It takes the input data and
 * calls generateEmployeeData to create a list of employees, then calls
 * getEmployeeStatistics to calculate statistics about them and returns the result.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {

  const employees  = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

/**
 * This code generates a list of {dtoIn.count} employees with randomly assigned names and surnames, gender,
 * birthdate (within the given age range) and workload (10, 20, 30, or 40). 
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  
 //male names and surnames
  const maleNames = [
    "Tomas", "Jan", "Ozzy", "Martin", "Lukas",
    "Petr", "Ondrej", "Igor", "David", "Bonifac"
  ];
  
  const maleSurnames = [
    "Novak", "Svoboda", "Skocdopole", "Dvorak", "Cerny",
    "Prochazka", "Kucera", "Vesely", "Nejezchleb", "Blazek"
  ];

  //female names and surnames
  const femaleNames = [
    "Tereza", "Jana", "Lucie", "Petra", "Katerina",
    "Martina", "Eva", "Lenka", "Monika", "Veronika"
  ];

  const femaleSurnames = [
    "Strouhalova", "Ruzickova", "Novotna", "Vintrlikova", "Bila",
    "Horakova", "Serhakova", "Koprivova", "Studena", "Nemcova"
  ];

  const workloads = [10, 20, 30, 40];

  //returns a random whole number between min and max
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //returns a random item from an array
  function randomFrom(arr) {
    return arr[randomInt(0, arr.length - 1)];
  }

  //returns a random birthdate as an ISO string based on the age range
  function randomBirthdate(minAge, maxAge) {
    const today = new Date();

    //one year in milliseconds
    const oneYearMs = 365.25 * 24 * 60 * 60 * 1000;

    const oldestBirthdate = new Date(today - maxAge * oneYearMs);
    
    const youngestBirthdate = new Date(today - minAge * oneYearMs);

    //convert both dates to milliseconds
    const oldestMs = oldestBirthdate.getTime();
    const youngestMs = youngestBirthdate.getTime();

    //pick a random millisecond value between the oldest and youngest birthdate
    const randomMs = oldestMs + Math.random() * (youngestMs - oldestMs);

    //create a new date from that random millisecond value and return it as ISO string
    const randomDate = new Date(randomMs);
    return randomDate.toISOString();
  }
  //empty array to store generated employees
  const dtoOut = [];

  //generate one employee at a time, repeat dtoIn.count times
  for (let i = 0; i < dtoIn.count; i++) {

    //randomly pick gender - 0 for male, 1 for female
    let gender;
    let name;
    let surname;

    if (randomInt(0, 1) === 0) {
      gender = "male";
      name = randomFrom(maleNames);
      surname = randomFrom(maleSurnames);
    } else {
      gender = "female";
      name = randomFrom(femaleNames);
      surname = randomFrom(femaleSurnames);
    }

    const birthdate = randomBirthdate(dtoIn.age.min, dtoIn.age.max);
    const workload = randomFrom(workloads);

    //build the employee object and add it to the list
    const employee = {
      gender: gender,
      birthdate: birthdate,
      name: name,
      surname: surname,
      workload: workload
    };

    dtoOut.push(employee);
  }

  return dtoOut;
}

/**
 * This function takes the list of generated employees and calculates the following statistics:
 * total number of employees, number of employees for each workload (10, 20, 30, 40 hours per week),
 * average age, minimum age, maximum age, median age, median workload,
 * average workload of female employees and a list of all employees sorted by workload.
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {

function getAgeFloat(birthdate) {
  const ms = Date.now() - new Date(birthdate).getTime();
  return ms / (365.25 * 24 * 60 * 60 * 1000);
}


function median(sortedArr) {
  const mid = Math.floor(sortedArr.length / 2);
 if (sortedArr.length % 2 !== 0) {
    return sortedArr[mid];
  } else {
    return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
  }
}

  const ages = employees.map(e => getAgeFloat(e.birthdate));
  const agesCopy = ages.slice();
  const sortedAges = agesCopy.sort((a, b) => a - b);
  const sortedWorkloads = employees.map(e => e.workload).sort((a, b) => a - b);

  const avgAge = ages.reduce((sum, a) => sum + a, 0) / ages.length;

  const womenWorkloads = employees.filter(e => e.gender === "female").map(e => e.workload);
  const avgWomenWorkload = womenWorkloads.reduce((sum, w) => sum + w, 0) / womenWorkloads.length;
  const workloadCount = {
    10: 0,
    20: 0,
    30: 0,
    40: 0
  };

  employees.forEach(e => {
    workloadCount[e.workload]++;
  });
  
  const dtoOut = {
    total: employees.length,
    workload10: workloadCount[10],
    workload20: workloadCount[20],
    workload30: workloadCount[30],
    workload40: workloadCount[40],
    averageAge: Math.round(avgAge * 10) / 10,
    minAge: Math.floor(Math.min(...ages)),
    maxAge: Math.floor(Math.max(...ages)),
    medianAge: Math.floor(median(sortedAges)),
    medianWorkload: median(sortedWorkloads),
    averageWomenWorkload: Math.round(avgWomenWorkload * 10) / 10,
    sortedByWorkload: [...employees].sort((a, b) => a.workload - b.workload)
  };
  
  return dtoOut;
}
