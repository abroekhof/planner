export const totals = mealFoods => (
   mealFoods.reduce(
    (prevTotal, mealFood) => (
      {
        calories: prevTotal.calories + (mealFood.calories * mealFood.qty),
        protein: prevTotal.protein + (mealFood.protein * mealFood.qty),
        weight: prevTotal.weight + (mealFood.weight * mealFood.qty),
      }
    ),
     {
       calories: 0,
       protein: 0,
       weight: 0,
     }
   )
 );

export const gPerOz = 28.3495;

export const convertRatio = (ratio, useOz, unit) => {
  const r = Math.round((useOz ? ratio * gPerOz : ratio * 100) * 100) / 100;
  return `${r} ${unit}/${useOz ? 'oz' : '100 g'}`;
};

export const convertWeight = (weight, useOz) => {
  const div = useOz ? 16.0 : 1000.0;
  let unit = useOz ? 'oz' : 'g';
  let convertedWeight = useOz ? weight / gPerOz : weight;
  if (convertedWeight > div) {
    convertedWeight /= div;
    unit = useOz ? 'lb' : 'kg';
  }
  convertedWeight = Math.round(convertedWeight * 100) / 100;
  return `${convertedWeight} ${unit}`;
};


export const isNumeric = n => (!isNaN(parseFloat(n)) && isFinite(n));
