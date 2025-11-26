import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Brain, Activity, Clock, AlertTriangle, Database } from 'lucide-react';
import { Simulation3D } from './components/Simulation3D';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SlideType } from './types';

// --- Subcomponents for Layout ---

const SlideWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div 
        className="w-full flex justify-center items-center"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
    >
        {children}
    </motion.div>
);

const ListItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors">
        <div className="mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-slate-400 text-sm">{desc}</p>
        </div>
    </div>
);

const Card = ({ title, children, delay }: { title: string, children: React.ReactNode, delay: number }) => (
    <motion.div 
        className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:shadow-[0_0_20px_rgba(14,165,233,0.15)] transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
    >
        <h3 className="text-cyan-400 font-bold mb-3 border-b border-slate-800 pb-2">{title}</h3>
        {children}
    </motion.div>
);

const ImpactNode = ({ title, desc, color }: { title: string, desc: string, color: string }) => (
    <motion.div 
        className={`${color} p-6 rounded-2xl w-64 shadow-lg`}
        whileHover={{ scale: 1.05 }}
    >
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm">{desc}</p>
    </motion.div>
);

const RiskBar = ({ title, desc, percent }: { title: string, desc: string, percent: number }) => (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
        <div className="flex justify-between mb-1">
            <span className="font-bold text-white">{title}</span>
            <span className="text-xs text-yellow-500 font-mono">Risk Level</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full mb-2 overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-yellow-600 to-red-600"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </div>
        <p className="text-xs text-slate-400">{desc}</p>
    </div>
);

// Data for charts
const performanceData = [
  { name: 'Dice Score', Manual: 0.82, AI: 0.94 },
  { name: 'Consistency', Manual: 0.75, AI: 0.98 },
];

const timeData = [
  { name: 'Contouring (min)', Manual: 25, AI: 5 },
  { name: 'Review (min)', Manual: 10, AI: 3 },
];

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = [
    SlideType.INTRO,
    SlideType.PROBLEM,
    SlideType.SOLUTION_3D,
    SlideType.METHODOLOGY,
    SlideType.RESULTS,
    SlideType.IMPACT,
    SlideType.RISKS
  ];

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(curr => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex(curr => curr - 1);
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Activity className="text-cyan-400 w-6 h-6" />
          <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CSCU9DA: Lung CT Segmentation
          </h1>
        </div>
        <div className="text-sm text-slate-400 font-mono">
          Student: 3147966 | Fall 2025
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {currentSlide === SlideType.INTRO && (
            <SlideWrapper key="intro">
              <div className="text-center max-w-4xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <span className="inline-block px-3 py-1 bg-cyan-900/50 border border-cyan-500/30 rounded-full text-cyan-300 text-sm font-semibold mb-6">
                        Data Science Applications
                    </span>
                </motion.div>
                <motion.h2 
                    className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                  Evaluating <span className="text-cyan-400">CarveNet-Based</span> <br/>
                  AI Segmentation Workflow
                </motion.h2>
                <motion.p 
                    className="text-xl text-slate-300 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                  Technical Value, Clinical Feasibility, and Operational Impact in Lung CT Follow-Up.
                </motion.p>
              </div>
            </SlideWrapper>
          )}

          {currentSlide === SlideType.PROBLEM && (
            <SlideWrapper key="problem">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl w-full">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-red-400">The Bottleneck</h2>
                  <p className="text-lg text-slate-300">
                    Lung CT follow-up is surging in centers like Mayo Clinic. Radiologists currently contour lesions slice-by-slice.
                  </p>
                  <ul className="space-y-4">
                    <ListItem icon={<Clock className="text-red-400"/>} title="Time Consuming" desc="Manual contouring delays report turnaround." />
                    <ListItem icon={<Activity className="text-orange-400"/>} title="High Variability" desc="Inconsistent boundaries across different readers." />
                    <ListItem icon={<Database className="text-yellow-400"/>} title="Hard to Scale" desc="Hiring extra staff adds recurring costs." />
                  </ul>
                </div>
                <div className="bg-slate-900/80 p-8 rounded-2xl border border-red-500/20 shadow-2xl relative overflow-hidden">
                   {/* Abstract visualization of chaos/workload */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 to-transparent animate-pulse"></div>
                   <div className="relative z-10 text-center">
                      <div className="text-6xl font-bold text-white mb-2">30-45 <span className="text-2xl text-slate-400">min</span></div>
                      <div className="text-sm text-red-300 uppercase tracking-widest">Avg Time Per Complex Case</div>
                      <div className="my-6 h-px bg-slate-700"></div>
                      <div className="text-5xl font-bold text-white mb-2">High</div>
                      <div className="text-sm text-orange-300 uppercase tracking-widest">Inter-observer Variability [2]</div>
                   </div>
                </div>
              </div>
            </SlideWrapper>
          )}

          {currentSlide === SlideType.SOLUTION_3D && (
            <SlideWrapper key="3d">
              <div className="w-full h-[80vh] flex flex-col md:flex-row gap-6">
                <div className="flex-1 order-2 md:order-1 flex flex-col justify-center space-y-4 p-4">
                    <h2 className="text-3xl font-bold text-cyan-400">AI-First Draft Workflow</h2>
                    <p className="text-slate-300">
                        Proposed solution: A <strong>CarveNet</strong> based pipeline. The AI generates a "First Draft", radiologists simply review and edit.
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-cyan-500">
                        <p className="text-sm italic">"A reliable AI draft can reduce manual corrections and shorten turnaround time." [5]</p>
                    </div>
                    <ul className="text-sm space-y-2 text-slate-400">
                        <li>• Interactive 3D Simulation</li>
                        <li>• Click <strong className="text-cyan-400">Chest</strong> to View Lungs</li>
                        <li>• Click <strong className="text-cyan-400">Scan</strong> to Analyze</li>
                    </ul>
                </div>
                <div className="flex-[2] order-1 md:order-2 relative">
                    <Simulation3D />
                </div>
              </div>
            </SlideWrapper>
          )}

          {currentSlide === SlideType.METHODOLOGY && (
            <SlideWrapper key="method">
              <div className="max-w-5xl w-full">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Brain className="text-purple-400"/> Data & Methodology
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card title="Datasets" delay={0.1}>
                        <div className="text-slate-300 text-sm">
                            Evaluated on public datasets (Lung CT w/ small nodules) [7].
                            <br/><br/>
                            <span className="text-purple-300">Crucial:</span> Practical deployment requires local calibration with site-specific scanners.
                        </div>
                    </Card>
                    <Card title="CarveNet Architecture" delay={0.2}>
                        <div className="flex flex-col gap-2 text-xs">
                            <div className="bg-slate-800 p-2 rounded border border-slate-600 text-center">Encoder (Detail Preservation)</div>
                            <div className="flex justify-center text-slate-500">↓</div>
                            <div className="bg-purple-900/30 p-2 rounded border border-purple-500 text-center font-bold">Multi-Window Attention</div>
                            <div className="flex justify-center text-slate-500">↓</div>
                            <div className="bg-slate-800 p-2 rounded border border-slate-600 text-center">Decoder (Boundary Recovery)</div>
                        </div>
                         <div className="mt-2 text-[10px] text-right text-slate-500">Ref: Zhang et al. [4]</div>
                    </Card>
                    <Card title="Workflow Integration" delay={0.3}>
                         <div className="space-y-2 text-sm text-slate-300">
                            1. PACS sends Image<br/>
                            2. Preprocessing<br/>
                            3. <span className="text-cyan-400 font-bold">CarveNet Inference</span><br/>
                            4. Structured Result (DICOM)<br/>
                            5. Physician Edit & Sign-off
                         </div>
                    </Card>
                </div>
              </div>
            </SlideWrapper>
          )}

          {currentSlide === SlideType.RESULTS && (
            <SlideWrapper key="results">
                 <div className="w-full max-w-6xl">
                    <h2 className="text-3xl font-bold mb-6 text-green-400">Strengths & Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[50vh]">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-xl font-semibold mb-4 text-center">Accuracy (Dice Score)</h3>
                            <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                                    <Legend />
                                    <Bar dataKey="Manual" fill="#64748b" />
                                    <Bar dataKey="AI" fill="#0ea5e9" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                             <h3 className="text-xl font-semibold mb-4 text-center">Operational Efficiency</h3>
                             <ResponsiveContainer width="100%" height="80%">
                                <BarChart data={timeData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis type="number" stroke="#94a3b8" />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                                    <Legend />
                                    <Bar dataKey="Manual" fill="#64748b" />
                                    <Bar dataKey="AI" fill="#22c55e" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <p className="mt-6 text-center text-slate-400 italic">
                        "Physician edits less and completes case faster [9]... shrinking reader-to-reader variation [11]."
                    </p>
                 </div>
            </SlideWrapper>
          )}

           {currentSlide === SlideType.IMPACT && (
            <SlideWrapper key="impact">
                <div className="max-w-5xl text-center space-y-10">
                    <h2 className="text-4xl font-bold text-white">Real World Impact</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <ImpactNode title="Patients" desc="Shorter waits, fewer repeat scans, safer follow-up." color="bg-blue-600" />
                        <ImpactNode title="Hospitals" desc="Higher throughput (Mayo Clinic [14]), traceable audit logs." color="bg-indigo-600" />
                        <ImpactNode title="Payers" desc="Quantitative indicators for value-based care." color="bg-violet-600" />
                    </div>
                    <div className="mt-12 bg-slate-800/50 p-6 rounded-2xl max-w-2xl mx-auto border border-slate-600">
                        <h3 className="text-lg font-semibold text-cyan-300 mb-2">Scalability</h3>
                        <p className="text-slate-300 text-sm">
                            With proper governance, this approach extends to liver, cardiac, and other OARs, creating scale effects without safety loss.
                        </p>
                    </div>
                </div>
            </SlideWrapper>
          )}

        {currentSlide === SlideType.RISKS && (
            <SlideWrapper key="risks">
                <div className="max-w-4xl w-full">
                     <h2 className="text-3xl font-bold mb-8 text-yellow-500 flex items-center gap-3">
                        <AlertTriangle /> Concerns & Limitations
                     </h2>
                     <div className="space-y-4">
                        <RiskBar title="Generalization" desc="Performance on different vendors/scanners needs local proof." percent={80} />
                        <RiskBar title="IT Complexity" desc="GPU demand, latency during busy hours, PACS integration." percent={65} />
                        <RiskBar title="Human Factors" desc="Risk of automation bias (over-trust) or ignoring valid AI suggestions." percent={90} />
                     </div>
                     <div className="mt-12 p-6 border-l-4 border-yellow-500 bg-yellow-900/10 rounded-r-lg">
                        <h4 className="font-bold text-yellow-200 mb-2">Conclusion</h4>
                        <p className="text-slate-300 text-sm">
                            While CarveNet shows immense technical promise, a responsible rollout requires 
                            <span className="text-white font-bold"> phased deployment</span>, 
                            <span className="text-white font-bold"> continuous monitoring</span>, and 
                            <span className="text-white font-bold"> clear accountability</span>.
                        </p>
                     </div>
                </div>
            </SlideWrapper>
        )}

        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="relative z-50 p-6 flex justify-between items-center bg-slate-900/80 border-t border-slate-800 backdrop-blur">
        <div className="flex gap-2">
            {slides.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-600'}`}
                />
            ))}
        </div>
        <div className="flex gap-4">
            <button 
                onClick={prevSlide} 
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft />
            </button>
            <button 
                onClick={nextSlide} 
                disabled={currentSlideIndex === slides.length - 1}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {currentSlideIndex === slides.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={18} />
            </button>
        </div>
      </footer>
    </div>
  );
};

export default App;