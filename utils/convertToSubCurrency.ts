export const convertToSubcurrency = async (amount: number, factor = 100): Promise<number> => {
    return Math.round(amount * factor); // Convert to cents (no decimals)
  };
  