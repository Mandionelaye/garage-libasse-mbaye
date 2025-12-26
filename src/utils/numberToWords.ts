export function numberToWordsCFA(amount: number): string {
  if (amount === 0) return "zéro";
  
  const units = [
    "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
    "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept",
    "dix-huit", "dix-neuf"
  ];
  
  const tens = [
    "", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingts", "quatre-vingt-dix"
  ];
  
  const thousands = ["", "mille", "million", "milliard"];
  
  function convertHundreds(n: number): string {
    let result = "";
    
    if (n >= 100) {
      if (n === 100) {
        result = "cent";
      } else {
        const hundreds = Math.floor(n / 100);
        if (hundreds === 1) {
          result = "cent";
        } else {
          result = units[hundreds] + "-cent";
        }
        n %= 100;
        if (n > 0) result += "-";
      }
    }
    
    if (n >= 20) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      
      if (t === 7 || t === 9) {
        result += tens[t - 1] + "-" + units[u + 10];
      } else {
        result += tens[t];
        if (u > 0) {
          if (t === 8) {
            result = result.slice(0, -1) + "-" + units[u];
          } else {
            result += "-" + units[u];
          }
        }
      }
    } else if (n > 0) {
      result += units[n];
    }
    
    return result;
  }
  
  function convertThousands(n: number, thousandIndex: number): string {
    if (n === 0) return "";
    
    let result = "";
    const hundred = n % 1000;
    
    if (hundred === 1 && thousandIndex === 1) {
      result = "mille";
    } else if (hundred > 0) {
      result = convertHundreds(hundred);
      if (thousandIndex > 0) {
        result += " " + thousands[thousandIndex];
      }
    }
    
    return result;
  }
  
  let result = "";
  let thousandIndex = 0;
  let tempAmount = amount;
  
  while (tempAmount > 0) {
    const chunk = tempAmount % 1000;
    const chunkWords = convertThousands(chunk, thousandIndex);
    
    if (chunkWords) {
      if (result) {
        result = chunkWords + " " + result;
      } else {
        result = chunkWords;
      }
    }
    
    tempAmount = Math.floor(tempAmount / 1000);
    thousandIndex++;
  }
  
  return result.trim() + " francs CFA";
}

export function formatCurrencyCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + ' F CFA';
}