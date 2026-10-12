import { Complex, SmithPoint } from '../types/smith';

export const SVG_CENTER = 250;
export const SVG_RADIUS = 210;

// Convert impedance z = r + jx to reflection coefficient Gamma = u + jv
export function impedanceToGamma(r: number, x: number): Complex {
  const denom = (r + 1) * (r + 1) + x * x;
  if (denom === 0) return { r: 1, i: 0 };
  const u = (r * r - 1 + x * x) / denom;
  const v = (2 * x) / denom;
  return { r: u, i: v };
}

// Convert reflection coefficient Gamma = u + jv to normalized impedance z = r + jx
export function gammaToImpedance(u: number, v: number): Complex {
  const denom = (1 - u) * (1 - u) + v * v;
  if (denom < 1e-9) return { r: 999, i: 0 }; // effectively open circuit
  const r = (1 - u * u - v * v) / denom;
  const x = (2 * v) / denom;
  return { r: Math.max(0, r), i: x };
}

// Convert Gamma to admittance y = g + jb
export function gammaToAdmittance(u: number, v: number): Complex {
  // y has Gamma_y = -Gamma_z
  return gammaToImpedance(-u, -v);
}

// Calculate SmithPoint with full metrics
export function computeSmithPoint(r: number, x: number): SmithPoint {
  const gamma = impedanceToGamma(r, x);
  const gammaMag = Math.sqrt(gamma.r * gamma.r + gamma.i * gamma.i);
  let gammaAngleDeg = (Math.atan2(gamma.i, gamma.r) * 180) / Math.PI;

  const swr = gammaMag >= 0.999 ? 99 : (1 + gammaMag) / (1 - gammaMag);

  // Normalized admittance
  const y = gammaToAdmittance(gamma.r, gamma.i);

  // WTG scale: 0 is at theta = 180 deg (short circuit), goes clockwise to 0.5 lambda
  let wtg = (180 - gammaAngleDeg) / 720;
  while (wtg < 0) wtg += 0.5;
  while (wtg >= 0.5) wtg -= 0.5;

  return {
    z: { r, i: x },
    y,
    gamma,
    gammaMag,
    gammaAngleDeg,
    swr,
    wtgLambda: wtg,
  };
}

// Convert Gamma (u, v) to SVG screen coordinates
export function gammaToSvg(u: number, v: number, cx = SVG_CENTER, cy = SVG_CENTER, radius = SVG_RADIUS) {
  return {
    x: cx + u * radius,
    y: cy - v * radius, // Invert v for SVG Y axis
  };
}

// Convert SVG screen coordinates back to Gamma (u, v)
export function svgToGamma(svgX: number, svgY: number, cx = SVG_CENTER, cy = SVG_CENTER, radius = SVG_RADIUS): Complex {
  const u = (svgX - cx) / radius;
  const v = -(svgY - cy) / radius;
  // clamp to unit circle
  const mag = Math.sqrt(u * u + v * v);
  if (mag > 1) {
    return { r: u / mag, i: v / mag };
  }
  return { r: u, i: v };
}

// SVG Arc path for constant resistance circle
export function getResistanceCircle(r: number, cx = SVG_CENTER, cy = SVG_CENTER, radius = SVG_RADIUS) {
  const uCenter = r / (r + 1);
  const circRadius = (1 / (r + 1)) * radius;
  const centerSvgX = cx + uCenter * radius;
  const centerSvgY = cy;
  return {
    cx: centerSvgX,
    cy: centerSvgY,
    r: circRadius,
  };
}

// SVG Arc path for constant reactance arc (+x or -x)
export function getReactanceArc(x: number, cx = SVG_CENTER, cy = SVG_CENTER, radius = SVG_RADIUS): string {
  if (Math.abs(x) < 0.001) {
    // Eje real horizontal
    return `M ${cx - radius} ${cy} L ${cx + radius} ${cy}`;
  }

  const centerU = 1;
  const centerV = 1 / x;
  const arcRadius = (1 / Math.abs(x)) * radius;

  const arcCenterSvgX = cx + centerU * radius;
  const arcCenterSvgY = cy - centerV * radius;

  // Intersect with unit circle (u^2 + v^2 = 1)
  // At the intersection with unit circle:
  // (r=0), so Gamma = (x^2 - 1)/(x^2 + 1) + j (2x)/(x^2 + 1)
  const uInt = (x * x - 1) / (x * x + 1);
  const vInt = (2 * x) / (x * x + 1);

  const startPt = gammaToSvg(uInt, vInt, cx, cy, radius);
  const endPt = gammaToSvg(1, 0, cx, cy, radius); // (1, 0) point

  const sweepFlag = x > 0 ? 0 : 1;

  return `M ${startPt.x} ${startPt.y} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${endPt.x} ${endPt.y}`;
}

// Rotate point on transmission line towards generator (clockwise) by distance in wavelengths (d/lambda)
export function rotateTowardGenerator(point: SmithPoint, dLambda: number): SmithPoint {
  const angleDeltaRad = -4 * Math.PI * dLambda; // -2 * beta * d = -4 * pi * (d/lambda)
  const currentAngleRad = Math.atan2(point.gamma.i, point.gamma.r);
  const newAngleRad = currentAngleRad + angleDeltaRad;

  const newU = point.gammaMag * Math.cos(newAngleRad);
  const newV = point.gammaMag * Math.sin(newAngleRad);

  const newZ = gammaToImpedance(newU, newV);
  return computeSmithPoint(newZ.r, newZ.i);
}

// Formats a complex number neatly
export function formatComplex(c: Complex, unit = ''): string {
  const sign = c.i >= 0 ? '+' : '-';
  const realStr = c.r.toFixed(2);
  const imagStr = Math.abs(c.i).toFixed(2);
  return `${realStr} ${sign} j${imagStr}${unit ? ' ' + unit : ''}`;
}

// Format polar reflection coefficient
export function formatPolarGamma(gammaMag: number, gammaAngleDeg: number): string {
  return `${gammaMag.toFixed(3)} ∠ ${gammaAngleDeg.toFixed(1)}°`;
}
