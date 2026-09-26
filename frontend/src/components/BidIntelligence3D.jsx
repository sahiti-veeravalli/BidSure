import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  Scale, 
  Building2, 
  Layers, 
  Check, 
  ArrowUpRight,
  Sparkles,
  FileWarning
} from 'lucide-react';

export default function BidIntelligence3D({ onOpenEvaluation }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Cards in rotation
  const cardsList = ['main', 'gst', 'tender'];
  const [topCardIndex, setTopCardIndex] = useState(0);
  const [isFanned, setIsFanned] = useState(false);

  const topCard = cardsList[topCardIndex];

  // Smooth mouse tracking with spring dampening
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Fast Automatic Continuous Shuffling (Cycle cards & fanning smoothly every 1.5s)
  useEffect(() => {
    let step = 0;
    const shuffleInterval = setInterval(() => {
      step++;
      // Alternate fanning and rotate top card
      setIsFanned(step % 2 === 1);
      if (step % 2 === 0) {
        setTopCardIndex((prev) => (prev + 1) % cardsList.length);
      }
    }, 1500);

    return () => clearInterval(shuffleInterval);
  }, []);

  // When a user clicks a card, immediately bring it to the front
  const handleCardClick = (cardId) => {
    const idx = cardsList.indexOf(cardId);
    if (idx !== -1) {
      setTopCardIndex(idx);
      setIsFanned(true);
    }
  };

  const rotX = isHovered ? mousePos.y * -12 + 8 : 6;
  const rotY = isHovered ? mousePos.x * 16 - 10 : -10;
  const rotZ = isHovered ? mousePos.x * 1.5 : 1;

  // Calculate dynamic 3D transforms for snappy, fluid layer transitions
  const getCardTransform = (cardId) => {
    const isTop = topCard === cardId;

    if (isTop) {
      return {
        transform: isFanned
          ? 'translate3d(0px, 15px, 70px) rotateZ(0deg) scale(1.03)'
          : 'translate3d(0px, 0px, 45px) rotateZ(0deg) scale(1.02)',
        zIndex: 30,
      };
    }

    if (cardId === 'tender') {
      return {
        transform: isFanned
          ? 'translate3d(-70px, -60px, -70px) rotateZ(-7deg)'
          : 'translate3d(-20px, -20px, -50px) rotateZ(-2.5deg)',
        zIndex: 10,
      };
    }

    if (cardId === 'gst') {
      return {
        transform: isFanned
          ? 'translate3d(70px, -30px, -15px) rotateZ(6deg)'
          : 'translate3d(-10px, -10px, -15px) rotateZ(-1deg)',
        zIndex: 15,
      };
    }

    // Default main behind
    return {
      transform: isFanned
        ? 'translate3d(-40px, 45px, 0px) rotateZ(-3deg)'
        : 'translate3d(0px, 0px, 0px)',
      zIndex: 20,
    };
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      className="relative w-full h-[500px] sm:h-[560px] lg:h-[600px] flex items-center justify-center select-none"
      style={{ perspective: '1600px' }}
    >

      {/* 3D Root Canvas with Snappy Transitions */}
      <div 
        className="relative w-full max-w-[460px] sm:max-w-[520px] h-[380px] sm:h-[420px] transition-transform duration-500 ease-out transform-gpu animate-float-slow"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
        }}
      >

        {/* Ambient Depth Floor Drop Shadow */}
        <div 
          className="absolute -bottom-14 left-10 right-10 h-20 bg-slate-900/12 rounded-full blur-2xl transform-gpu transition-all duration-500"
          style={{
            transform: 'translateZ(-140px) rotateX(90deg) scale(1.15)',
            opacity: isHovered ? 0.6 : 0.35
          }}
        />

        {/* =========================================================================
            LAYER: TENDER SPECIFICATIONS (Clickable to bring to front)
            ========================================================================= */}
        <div 
          onClick={() => handleCardClick('tender')}
          className={`absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border p-5 shadow-lg cursor-pointer transition-all duration-500 ease-out transform-gpu ${
            topCard === 'tender' 
              ? 'ring-2 ring-blue-600 border-blue-400 shadow-2xl' 
              : 'border-slate-200 hover:border-slate-400 hover:shadow-xl'
          }`}
          style={getCardTransform('tender')}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="font-mono text-[10px] font-bold text-[#0A2540] uppercase tracking-wider">
                Tender Ref: GEM/2026/B/901248
              </span>
            </div>
            <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
              MeitY Procurement
            </span>
          </div>

          <div className="pt-3 space-y-2 text-left font-mono text-xs">
            <div className="text-slate-900 font-bold text-sm font-sans tracking-tight">
              High-Performance Cloud Server Infrastructure
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div>Est Value: <strong className="text-slate-900 font-mono">₹4,50,00,000</strong></div>
              <div>Clauses Loaded: <strong className="text-blue-700 font-mono">28 Rules</strong></div>
            </div>
            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Department of IT & Electronics</span>
              <span className="text-blue-700 font-bold">Click to focus →</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER: GST & PAN STATUTORY CERTIFICATE (Clickable to bring to front)
            ========================================================================= */}
        <div 
          onClick={() => handleCardClick('gst')}
          className={`absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl border p-5 shadow-lg cursor-pointer transition-all duration-500 ease-out transform-gpu ${
            topCard === 'gst' 
              ? 'ring-2 ring-teal-600 border-teal-400 shadow-2xl' 
              : 'border-slate-200 hover:border-slate-400 hover:shadow-xl'
          }`}
          style={getCardTransform('gst')}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono text-[10px] font-bold text-[#0A2540] uppercase tracking-wider">
                GSTN & PAN Registry Match
              </span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
              Active & Validated
            </span>
          </div>

          <div className="pt-3 space-y-2 text-left font-mono text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-50/80 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 text-[11px]">GSTIN: 27AAACA1234F1Z5</span>
              <span className="text-emerald-700 font-bold text-[11px]">✓ 100% Tax Compliant</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-slate-50/80 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 text-[11px]">CBDT PAN: AAACA1234F</span>
              <span className="text-emerald-700 font-bold text-[11px]">✓ Entity Verified</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>National Registry Sync</span>
              <span className="text-teal-700 font-bold">Click to focus →</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LAYER: MAIN EVALUATION DOSSIER (Clickable to bring to front)
            ========================================================================= */}
        <div 
          onClick={() => handleCardClick('main')}
          className={`absolute inset-0 bg-white rounded-2xl border p-6 shadow-xl cursor-pointer transition-all duration-500 ease-out transform-gpu space-y-4 ${
            topCard === 'main' 
              ? 'ring-2 ring-[#0A2540] border-slate-400 shadow-[0_25px_60px_-15px_rgba(10,37,64,0.2)]' 
              : 'border-slate-300 hover:border-slate-400 hover:shadow-2xl'
          }`}
          style={getCardTransform('main')}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#0D9488] font-bold">
                  Evaluation Dossier
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#0A2540] mt-0.5 tracking-tight font-sans">
                ABC Technologies Pvt. Ltd.
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#0A2540] font-mono leading-none">92.4%</span>
              <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded block mt-0.5 font-mono">
                NEEDS REVIEW
              </span>
            </div>
          </div>

          {/* Document Rows */}
          <div className="space-y-2 text-left font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50/90 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-800">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-[11px] font-bold">Turnover_FY24.pdf</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px]">₹6.82 Cr (Passed)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50/90 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-800">
                <FileText className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-[11px] font-bold">MII_Local_Content.pdf</span>
              </div>
              <span className="text-emerald-700 font-bold text-[11px]">62.0% (Class-I)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-amber-50/90 rounded-lg border border-amber-300">
              <div className="flex items-center space-x-2 text-amber-950">
                <FileWarning className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] font-bold">OEM_Authorization.pdf</span>
              </div>
              <span className="text-amber-800 font-bold text-[11px]">Name Delta Flag</span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] font-mono text-slate-500">
            <span>8 of 8 Registries Checked</span>
            <span 
              onClick={(e) => { e.stopPropagation(); onOpenEvaluation(); }}
              className="text-blue-700 hover:text-[#0A2540] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>Inspect Findings</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* =========================================================================
            FLOATING UI BADGE: COMPLIANCE GAUGE
            ========================================================================= */}
        <div 
          onClick={(e) => { e.stopPropagation(); setIsFanned(!isFanned); }}
          className="absolute -top-5 -right-5 bg-[#0A2540] text-white p-3.5 rounded-xl border border-slate-700 shadow-2xl cursor-pointer transition-all duration-500 ease-out transform-gpu hover:scale-105 hover:bg-[#1E40AF] z-40"
          style={{
            transform: isFanned
              ? 'translate3d(30px, -20px, 95px) rotateZ(4deg)'
              : 'translate3d(15px, -10px, 75px) rotateZ(2deg)',
          }}
        >
          <div className="text-[9px] font-mono text-teal-300 font-bold tracking-widest uppercase">
            COMPLIANCE SCORE
          </div>
          <div className="text-2xl font-black font-mono mt-0.5 text-white">
            92.4%
          </div>
          <div className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded mt-1 inline-block">
            7 PASSED · 1 FLAG
          </div>
        </div>

        {/* =========================================================================
            FLOATING UI BADGE: REGISTRIES MATCH
            ========================================================================= */}
        <div 
          onClick={(e) => { e.stopPropagation(); onOpenEvaluation(); }}
          className="absolute -bottom-5 -left-5 bg-white text-slate-900 p-3.5 rounded-xl border border-slate-300 shadow-2xl cursor-pointer transition-all duration-500 ease-out transform-gpu hover:scale-105 hover:border-slate-400 z-40"
          style={{
            transform: isFanned
              ? 'translate3d(-30px, 20px, 105px) rotateZ(-4deg)'
              : 'translate3d(-15px, 10px, 85px) rotateZ(-2deg)',
          }}
        >
          <div className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
            STATUTORY REGISTRIES
          </div>
          <div className="text-lg font-black font-mono text-[#0A2540] mt-0.5 flex items-center space-x-1.5">
            <span>8 / 8</span>
            <span className="text-[11px] text-emerald-700 font-sans font-bold">MATCHED</span>
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-0.5">
            GST · PAN · UDYAM · MCA
          </div>
        </div>

      </div>

    </div>
  );
}
