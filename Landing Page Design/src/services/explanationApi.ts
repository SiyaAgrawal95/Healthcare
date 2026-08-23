interface ExplanationData {
  parameter: string
  detectedValue: string
  generalSignificance: string
  possibleAssociatedFactors: string[]
  whatToDiscuss: string
}

const explanationDatabase: Record<string, ExplanationData> = {
  glucose: {
    parameter: 'Glucose',
    detectedValue: 'Moderate',
    generalSignificance: 'Glucose in urine (glycosuria) can indicate elevated blood sugar levels. This result can be associated with conditions affecting glucose metabolism or kidney function.',
    possibleAssociatedFactors: [
      'Diabetes mellitus (Type 1 or Type 2)',
      'Kidney dysfunction affecting glucose reabsorption',
      'Pregnancy (gestational diabetes)',
      'High stress or certain medications',
      'Recent high carbohydrate intake'
    ],
    whatToDiscuss: 'Share these results with your healthcare provider. They may recommend blood glucose testing, HbA1c measurement, or further evaluation of kidney function.'
  },
  protein: {
    parameter: 'Protein',
    detectedValue: 'Trace',
    generalSignificance: 'Protein in urine (proteinuria) can indicate kidney stress or damage. The kidneys normally filter out protein, so its presence may require investigation.',
    possibleAssociatedFactors: [
      'Dehydration',
      'Kidney disease or damage',
      'High blood pressure',
      'Diabetes',
      'Intense physical activity',
      'Urinary tract infection'
    ],
    whatToDiscuss: 'Consult your healthcare provider about this result. They may recommend repeat testing, blood pressure monitoring, or kidney function tests.'
  },
  ph: {
    parameter: 'pH',
    detectedValue: '6.5',
    generalSignificance: 'Urine pH reflects the acid-base balance in your body. A pH of 6.5 is within the normal range, indicating balanced acid-base status.',
    possibleAssociatedFactors: [
      'Normal diet and hydration',
      'Balanced kidney function',
      'Normal metabolic processes'
    ],
    whatToDiscuss: 'This result is within normal range. Continue maintaining a balanced diet and proper hydration. Discuss any concerns about diet or metabolism with your healthcare provider.'
  },
  ketones: {
    parameter: 'Ketones',
    detectedValue: 'Negative',
    generalSignificance: 'Ketones are produced when the body breaks down fat for energy. A negative result is normal and indicates adequate carbohydrate metabolism.',
    possibleAssociatedFactors: [
      'Normal carbohydrate intake',
      'Balanced metabolism',
      'Adequate insulin function'
    ],
    whatToDiscuss: 'This result is normal. Continue with your current diet and lifestyle. Discuss any changes in diet or metabolic concerns with your healthcare provider.'
  },
  blood: {
    parameter: 'Blood',
    detectedValue: '+2',
    generalSignificance: 'Blood in urine (hematuria) can indicate various conditions affecting the urinary tract. This result requires medical attention to identify the underlying cause.',
    possibleAssociatedFactors: [
      'Urinary tract infection',
      'Kidney stones',
      'Kidney disease or injury',
      'Bladder or prostate issues',
      'Strenuous exercise',
      'Certain medications'
    ],
    whatToDiscuss: 'This result requires prompt medical attention. Contact your healthcare provider for further evaluation, which may include urine culture, imaging studies, or referral to a specialist.'
  }
}

export async function getExplanation(parameter: string): Promise<ExplanationData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const explanation = explanationDatabase[parameter]
      if (explanation) {
        resolve(explanation)
      } else {
        reject(new Error('Parameter not found'))
      }
    }, 800) // Simulate API delay
  })
}

export const availableParameters = Object.keys(explanationDatabase)
