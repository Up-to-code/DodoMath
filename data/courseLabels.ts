import type { MathLesson } from './mathCourse';

// Navigation labels only. Source titles, transcripts and mathematical content stay intact.
const lessonLabels = [
 'Introduction', 'Add & subtract', 'Multiply & divide', 'Fractions & mixed numbers',
 'Place value & estimation', 'Decimals', 'Percentages', 'Fraction conversions',
 'Add & subtract: large', 'Distributive property', 'Multiply large numbers', 'Long division',
 'Negative numbers', 'Exponents', 'Order of operations', 'Primes & factorization',
 'Least common multiple', 'Greatest common factor', 'Add & subtract fractions', 'Multiply & divide fractions',
 'Mean, median & mode', 'Variables', 'Number properties', 'Solve equations',
 'Variables on both sides', 'Word problems', 'Inequalities', 'Roots',
 'Simplify roots & powers', 'Equations with roots', 'Polynomials', 'Polynomial sums & differences',
 'Multiply binomials', 'Factor quadratics', 'Complete the square', 'Quadratic formula',
 'Polynomial roots', 'Rational expressions', 'Coordinates', 'Slope & intercepts',
 'Slope-intercept form', 'Standard form', 'Parallel & perpendicular', 'Systems of equations',
 'Absolute value', 'Types of numbers', 'Geometry basics', 'Points, lines & planes',
 'Angles', 'Triangles', 'Congruence & similarity', 'Triangle bisectors',
 'Triangle midsegments', 'Pythagorean theorem', 'Polygons', 'Perimeter',
 'Circles', 'Area', 'Pythagorean proof', 'Surface area',
 'Volume', 'Functions', 'Composite functions', 'Domain & range',
 'Function transformations', 'Piecewise functions', 'Inverse functions', 'Distance formula',
 'Circle graphs', 'Ellipse graphs', 'Parabola graphs', 'Hyperbola graphs',
 'Polynomial graphs', 'Rational graphs', 'Polynomial inequalities', 'Exponential functions',
 'Logarithms', 'Natural logs & bases', 'Log properties', 'Exponential/log equations',
 'Complex numbers', 'Unions & intersections', 'Sequences & sums', 'Probability & combinations',
 'Angles & radians', 'Trig functions', 'Unit circle', 'Trig identities',
 'Trig graphs', 'Inverse trig functions', 'Verify trig identities', 'Trig formulas',
 'Trig equations', 'Law of sines', 'Law of cosines', 'Polar coordinates',
 'Parametric equations', 'Calculus basics', 'Tangent slopes', 'Rates of change',
 'Limits', 'Derivatives & power rule', 'Product & quotient rules', 'Trig derivatives',
 'Chain rule', 'Log & exp. derivatives', 'Implicit differentiation', 'Higher derivatives',
 'Related rates', 'Maxima & minima', 'Derivative graphs', 'Optimization',
 'L’Hôpital’s rule', 'Area under a curve', 'Fundamental theorem', 'Definite integrals',
 'Indefinite integrals', 'Trig integrals', 'Substitution', 'Integration by parts',
 'Trig substitution', 'Integration strategies', 'Improper integrals', 'Area between curves',
 'Solids of revolution', 'Cylindrical shells', 'Average value', 'Convergence',
 'Series tests', 'Alternating series', 'Power series', 'Taylor & Maclaurin series',
 'Hyperbolic functions', '3D coordinates', 'Vectors', 'Dot product',
 'Linear systems', 'Matrix notation', 'Row operations', 'Matrix addition',
 'Matrix multiplication', 'Determinants', 'Cross product', 'Inverse matrices',
 'Cramer’s rule', 'Vector spaces', 'Subspaces & span', 'Linear independence',
 'Basis & dimension', 'Change of basis', 'Linear transformations', 'Image & kernel',
 'Orthogonality', 'Gram–Schmidt process', 'Eigenvalues & eigenvectors', 'Diagonalization',
 'Complex & unitary matrices', 'Matrix decompositions', 'Double & triple integrals', 'Partial derivatives',
 'Divergence & curl', 'Line integrals', 'Green’s theorem', 'Surface integrals',
 'Stokes’s theorem', 'Divergence theorem', 'Differential equations', 'Classify equations',
 'Separable equations', 'First-order linear ODEs', 'Exact equations', 'Bernoulli equations',
 'Homogeneous ODEs', 'Nonhomogeneous ODEs', 'Special ODE forms', 'Numerical methods',
 'Leibniz series method', 'Frobenius method', 'Model equation systems', 'Systems & stability',
 'Laplace transforms', 'Convolution & LTI', 'Difference equations', 'PDEs & operators',
 'Lagrange’s method', 'Laplace’s equation', 'Fourier methods', 'Power spectra & k-space',
 '1D wave equation', 'Waves & dispersion', 'Diffusion equation', 'Self-similar diffusion',
 'Green’s diffusion solution',
];
const sectionLabels: Record<number, string> = {
 1:'Arithmetic', 2:'Algebra', 3:'Geometry', 4:'Functions & chance', 5:'Trigonometry',
 6:'Derivatives', 7:'Integrals & series', 8:'Linear algebra', 9:'Multivariable calculus',
 10:'Differential equations', 11:'Partial diff. equations',
};
export function lessonLabel(lesson: Pick<MathLesson, 'order' | 'title'>) {
 return lessonLabels[lesson.order - 1] ?? lesson.title;
}
export function sectionLabel(section: {id:number;title:string}) {
 return sectionLabels[section.id] ?? section.title;
}
