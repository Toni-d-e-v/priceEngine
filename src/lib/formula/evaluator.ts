import { evaluate } from 'mathjs';

export interface FormulaContext {
  $spot: number;
  $weight: number;
  $facon?: number;
  $aufschlag?: number;
  [key: string]: number | undefined;
}

/**
 * Wertet eine Formel mit den gegebenen Variablen aus.
 * Variablen wie $spot und $weight werden im Formel-String ersetzt.
 * Verwendet mathjs für sichere Auswertung (kein eval()).
 *
 * Beispiel: evaluateFormula('($spot*$weight+53.95)*1.045', { $spot: 113.4101, $weight: 20 })
 */
export function evaluateFormula(formula: string, context: FormulaContext): number {
  let expr = formula;

  // Variablen durch Werte ersetzen (längste zuerst, um Teilersetzungen zu vermeiden)
  const keys = Object.keys(context).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const val = context[key];
    if (val !== undefined) {
      expr = expr.replaceAll(key, String(val));
    }
  }

  try {
    const result = evaluate(expr);
    return typeof result === 'number' ? result : 0;
  } catch (e) {
    console.error('Formel-Fehler:', formula, context, e);
    return 0;
  }
}

/**
 * Validiert ob eine Formel syntaktisch korrekt ist.
 * Gibt true zurück wenn die Formel mit Beispielwerten auswertbar ist.
 */
export function validateFormula(formula: string): { valid: boolean; error?: string } {
  try {
    const testContext: FormulaContext = { $spot: 100, $weight: 1, $facon: 10, $aufschlag: 1.02 };
    const result = evaluateFormula(formula, testContext);
    if (isNaN(result) || !isFinite(result)) {
      return { valid: false, error: 'Formel ergibt keinen gültigen Wert' };
    }
    return { valid: true };
  } catch (e) {
    return { valid: false, error: String(e) };
  }
}

/**
 * Extrahiert Variablennamen aus einer Formel.
 * Sucht nach $-prefixed Bezeichnern.
 */
export function extractVariables(formula: string): string[] {
  const matches = formula.match(/\$\w+/g);
  return matches ? [...new Set(matches)] : [];
}
