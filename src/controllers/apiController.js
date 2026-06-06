// 1. Bubble Sort ka logic jo har ek swap (step) ko save karega
function getBubbleSortSteps(originalArr) {
  let arr = [...originalArr]; // Original array ki copy banayi taaki asli array kharab na ho
  let steps = [];
  
  // Shuruat ka array state save kiya
  steps.push({ 
    array: [...arr], 
    description: "Initial Array before sorting" 
  });

  // Asli Bubble Sort Loop
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap (Aapas me badalna)
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        
        // Har ek swap ke baad array kaisa dikh raha hai, use save karo
        steps.push({ 
          array: [...arr], 
          description: `Swapped elements ${arr[j+1]} and ${arr[j]}` 
        });
      }
    }
  }

  // Aakhiri step: Jab poora sort ho jaye
  steps.push({ 
    array: [...arr], 
    description: "Final Sorted Array" 
  });

  return steps;
}

// 2. Main API Handler function jo request receive karega
export const sortAPI = async (req, res) => {
  try {
    const { array } = req.body; // Postman/Frontend se bheja hua array uthaya

    // Check karo ki bhejte waqt galti toh nahi ki (Validation)
    if (!array || !Array.isArray(array)) {
      return res.status(400).json({ 
        success: false,
        error: "Please provide a valid array in the request body." 
      });
    }

    // Saare steps calculate kiye
    const steps = getBubbleSortSteps(array);
    
    // Developer ko JSON packet wapas bhej diya
    return res.json({
      success: true,
      algorithm: "Bubble Sort",
      totalSteps: steps.length,
      steps: steps
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
