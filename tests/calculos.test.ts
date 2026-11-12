import { describe, it, expect } from 'vitest';

/**
 * Calculadoras de Fisiologia e Antropometria — GL PRO FIT
 */

// Pollock 7 Dobras: Densidade Corporal (Homens)
export function calculateBodyDensityPollock7Male(sumSkinfolds: number, age: number): number {
  return 1.112 - (0.00043499 * sumSkinfolds) + (0.00000055 * Math.pow(sumSkinfolds, 2)) - (0.00028826 * age);
}

// Pollock 3 Dobras: Densidade Corporal (Homens)
export function calculateBodyDensityPollock3Male(sum3Skinfolds: number, age: number): number {
  return 1.10938 - (0.0008267 * sum3Skinfolds) + (0.0000016 * Math.pow(sum3Skinfolds, 2)) - (0.0002574 * age);
}

// Fórmula de Siri: % de Gordura
export function calculateSiriFatPercentage(bodyDensity: number): number {
  const fat = ((4.95 / bodyDensity) - 4.5) * 100;
  return Number(fat.toFixed(2));
}

// Taxa Metabólica Basal (Mifflin-St Jeor - Homens)
export function calculateBmrMifflinStJeor(weightKg: number, heightCm: number, age: number, gender: 'masculino' | 'feminino'): number {
  if (gender === 'masculino') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

// Taxa Metabólica Basal (Harris-Benedict - Homens)
export function calculateBmrHarrisBenedict(weightKg: number, heightCm: number, age: number, gender: 'masculino' | 'feminino'): number {
  if (gender === 'masculino') {
    return Math.round(66.5 + (13.75 * weightKg) + (5.003 * heightCm) - (6.75 * age));
  }
  return Math.round(655.1 + (9.563 * weightKg) + (1.85 * heightCm) - (4.676 * age));
}

// Cálculo de Prontidão (Readiness Score — Hooper Adaptado 0 a 100%)
export function calculateReadinessScore(sleepQuality: number, pse: number, eva: number, stress: number): number {
  // sleepQuality (1-5), pse (1-10), eva (0-10), stress (1-10)
  // Quanto maior o sono e menor o desgaste, maior a prontidão
  const score = Math.max(0, Math.min(100, Math.round(
    (sleepQuality * 10) + ((10 - pse) * 3) + ((10 - eva) * 3) + ((10 - stress) * 2)
  )));
  return score;
}

describe('Testes Unitários de Cálculos Fisiológicos (GL PRO FIT)', () => {

  it('Deve calcular Densidade Corporal e % Gordura por Pollock 7 Dobras (Homens)', () => {
    const sum7Dobras = 70; // 70mm soma das dobras
    const age = 25;
    const density = calculateBodyDensityPollock7Male(sum7Dobras, age);
    const fatPct = calculateSiriFatPercentage(density);

    expect(density).toBeGreaterThan(1.05);
    expect(density).toBeLessThan(1.10);
    expect(fatPct).toBeGreaterThan(5);
    expect(fatPct).toBeLessThan(20);
  });

  it('Deve calcular Densidade Corporal por Pollock 3 Dobras (Homens)', () => {
    const sum3Dobras = 30; // 30mm (peitoral, abdominal, coxa)
    const age = 30;
    const density = calculateBodyDensityPollock3Male(sum3Dobras, age);
    const fatPct = calculateSiriFatPercentage(density);

    expect(density).toBeGreaterThan(1.07);
    expect(fatPct).toBeGreaterThan(8);
  });

  it('Deve calcular a Taxa Metabólica Basal (Mifflin-St Jeor)', () => {
    const tmbHomem = calculateBmrMifflinStJeor(80, 180, 30, 'masculino');
    expect(tmbHomem).toBe(1780);

    const tmbMulher = calculateBmrMifflinStJeor(60, 165, 28, 'feminino');
    expect(tmbMulher).toBe(1330);
  });

  it('Deve calcular a Taxa Metabólica Basal (Harris-Benedict)', () => {
    const tmbHomem = calculateBmrHarrisBenedict(80, 180, 30, 'masculino');
    expect(tmbHomem).toBeGreaterThan(1800);
  });

  it('Deve calcular a Pontuação de Prontidão (Readiness Score 0-100%)', () => {
    const otimo = calculateReadinessScore(5, 2, 0, 2);
    expect(otimo).toBeGreaterThanOrEqual(90);

    const desgastado = calculateReadinessScore(2, 9, 8, 9);
    expect(desgastado).toBeLessThan(40);
  });

});
