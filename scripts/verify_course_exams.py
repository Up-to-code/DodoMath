import json,re,sympy as sp
from pathlib import Path
APP=Path(__file__).resolve().parents[1]
symbols={n:sp.Symbol(n,real=True) for n in ['x','y','z','a','b','g','h','m','r','t','T','u','v','theta','n','k','s','A','B','C','Y','tau','lam']}
env={**vars(sp),**symbols,'len':len,'set':set,'list':list,'abs':abs}
def parse(a):return sp.sympify(a.replace('^','**').replace('lambda','lam'),locals={**symbols,'i':sp.I,'ln':sp.log,'exp':sp.exp,'pi':sp.pi})
def same(a,b):
 if isinstance(a,list) or isinstance(b,(list,tuple,sp.MatrixBase)):
  b=list(b);return isinstance(a,list) and len(a)==len(b) and all(same(x,y) for x,y in zip(a,b))
 d=sp.trigsimp(sp.simplify(a-b));return d==0 or bool(d.is_number and abs(complex(sp.N(d)))<1e-10)
checks=json.loads((APP/'data/course/exam-verification.json').read_text());errors=[]
for q in checks:
 try:
  # compute is checked-in author-authored SymPy notation, never learner input.
  b=eval(q['compute'],{'__builtins__':{}},env);a=[parse(v) for v in q['answer'].split(',')] if q['grading']=='ordered-values' else parse(q['answer']);assert same(a,b),f'{a} != {b}'
 except Exception as e:errors.append((q['lesson'],q['question'],str(e)))
assert not errors,errors
print(f'{len(checks)} independent arithmetic / symbolic answer calculations pass.')
# Verify complete ODE/PDE solutions independently, not only their written forms.
x,y,t,A,B,C=map(symbols.get,['x','y','t','A','B','C'])
solutions=[
 (169,3*sp.exp(x*x),lambda f:sp.diff(f,x)-2*x*f),
 (170,2-sp.exp(-2*x),lambda f:sp.diff(f,x)+2*f-4),
 (172,x*(sp.log(x)+C),lambda f:sp.diff(f,x)-1-f/x),
 (173,A*sp.exp(x)+B*sp.exp(2*x),lambda f:sp.diff(f,x,2)-3*sp.diff(f,x)+2*f),
 (174,A*sp.exp(x)+B*sp.exp(-x)-2,lambda f:sp.diff(f,x,2)-f-2),
 (175,A/x+B*x*x,lambda f:x*x*sp.diff(f,x,2)-2*f),
 (178,A+B*x**sp.Rational(2,3),lambda f:3*x*x*sp.diff(f,x,2)+x*sp.diff(f,x)),
 (181,2*sp.exp(-t),lambda f:sp.diff(f,t)+f),
 (185,(x-y)**2,lambda f:sp.diff(f,x)+sp.diff(f,y)),
 (186,sp.sin(x)*sp.exp(-y),lambda f:sp.diff(f,x,2)+sp.diff(f,y,2)),
 (189,sp.sin(x)*sp.cos(2*t),lambda f:sp.diff(f,t,2)-4*sp.diff(f,x,2)),
 (191,sp.sin(x)*sp.exp(-t),lambda f:sp.diff(f,t)-sp.diff(f,x,2)),
]
for order,f,residual in solutions:assert sp.simplify(residual(f))==0,order
assert (3*sp.exp(x*x)).subs(x,0)==3
assert (2-sp.exp(-2*x)).subs(x,0)==1
assert (2*sp.exp(-t)).subs(t,0)==2
for f in [sp.sin(x)*sp.cos(2*t),sp.sin(x)*sp.exp(-t)]:
 assert f.subs(x,0)==f.subs(x,sp.pi)==0
 assert sp.simplify(f.subs(t,0)-sp.sin(x))==0
assert sp.diff(sp.sin(x)*sp.cos(2*t),t).subs(t,0)==0
# Integration answers must differentiate back to the original integrands.
for order,F,f in [(117,x**3+2*x+C,3*x*x+2),(118,-sp.cos(x)+C,sp.sin(x)),(119,sp.sin(x*x+1)+C,2*x*sp.cos(x*x+1)),(120,-x*sp.cos(x)+sp.sin(x)+C,x*sp.sin(x)),(121,sp.asin(x/3)+C,1/sp.sqrt(9-x*x)),(122,sp.sqrt(x*x+4)+C,x/sp.sqrt(x*x+4))]:
 assert sp.simplify(sp.diff(F,x)-f)==0,order
# Eigenvectors and diagonalization must satisfy the actual matrix equations.
M=sp.Matrix([[1,1],[4,1]]);P=sp.Matrix([[1,1],[-2,2]]);D=sp.diag(-1,3)
assert M*P==P*D and P*D*P.inv()==M
# Series coefficients satisfy the stated recurrence through the authored truncation.
a=[1,2,0,sp.Rational(1,6),sp.Rational(1,6)]
for n in [3,4]:assert n*(n-1)*a[n]==a[n-3]
print('ODE/PDE residuals, initial/boundary conditions, antiderivatives, eigenvectors and series recurrence pass.')
