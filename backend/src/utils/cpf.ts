export const sanitizeCpf = (value: string): string => value.replace(/\D/g, '');

export const isValidCpf = (value: string): boolean => {
  const cpf = sanitizeCpf(value);
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) {
    return false;
  }

  const calcDigit = (base: string, factor: number): number => {
    let total = 0;
    for (let i = 0; i < base.length; i += 1) {
      total += parseInt(base[i], 10) * (factor - i);
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const digit1 = calcDigit(cpf.slice(0, 9), 10);
  const digit2 = calcDigit(cpf.slice(0, 10), 11);

  return digit1 === parseInt(cpf[9], 10) && digit2 === parseInt(cpf[10], 10);
};

export const maskCpf = (value: string): string => {
  const cpf = sanitizeCpf(value).padEnd(11, '*');
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
};
