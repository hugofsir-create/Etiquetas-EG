import React from 'react';
import Barcode from 'react-barcode';
import { cn } from '../lib/utils';
import { Grape } from 'lucide-react';

interface PalletLabelProps {
  sku: string;
  description: string;
  leftLogo?: string;
  rightLogo?: string;
  className?: string;
}

export const PalletLabel: React.FC<PalletLabelProps> = ({
  sku,
  description,
  leftLogo,
  rightLogo,
  className,
}) => {
  return (
    <div 
      className={cn(
        "label-container relative bg-white border border-stone-300 flex flex-col justify-between overflow-hidden print:border-none print:shadow-none print:m-0",
        "w-[297mm] h-[210mm] landscape mx-auto mb-8 transition-shadow hover:shadow-2xl",
        className
      )}
      id={`label-${sku}`}
    >
      {/* Corner Brackets for Robust Look */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-black z-20" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-black z-20" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-black z-20" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-black z-20" />

      {/* Winery Decorative Background Element */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] rotate-12 pointer-events-none">
        <Grape size={800} />
      </div>

      {/* Header with Brand Name Only */}
      <div className="w-full pt-12 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Grape className="w-10 h-10 text-wine-deep" />
          <span className="text-5xl font-belluccia text-stone-800 px-2 transition-all">
            Escorihuela Gascon
          </span>
          <Grape className="w-10 h-10 text-wine-deep" />
        </div>
        <div className="h-[2px] w-80 bg-wine-deep/10 mx-auto mt-3" />
        <span className="text-[11px] uppercase tracking-[0.4em] text-stone-400 font-black block mt-3">
          GESTIÓN DE BODEGA Y LOGÍSTICA
        </span>
      </div>

      {/* Main Content Area with Side Logos */}
      <div className="flex-1 flex flex-col justify-start items-center text-center px-8 border-y border-stone-100 mx-12 z-10 pt-4">
        <div className="flex items-center justify-between w-full h-[20rem] relative -top-[1cm]">
          {/* Left Logo */}
          <div className="w-48 h-48 border border-stone-100 flex items-center justify-center p-2 bg-white/50 backdrop-blur-sm self-center">
            {leftLogo ? (
              <img src={leftLogo} alt="Left Logo" className="max-w-[110%] max-h-[110%] object-contain" />
            ) : (
              <div className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
                Logo Bodega
              </div>
            )}
          </div>

          {/* Center SKU */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-2">
            <span className="text-sm uppercase tracking-[0.4em] text-stone-400 font-bold italic">CÓDIGO SKU</span>
            <h1 className="text-[17rem] font-arial-black font-black tracking-tighter text-black leading-none uppercase">
              {sku}
            </h1>
          </div>

          {/* Right Logo */}
          <div className="w-48 h-48 border border-stone-100 flex items-center justify-center p-2 bg-white/50 backdrop-blur-sm self-center">
            {rightLogo ? (
              <img src={rightLogo} alt="Right Logo" className="max-w-[110%] max-h-[110%] object-contain" />
            ) : (
              <div className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
                Operador Logístico
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 w-full max-w-5xl">
          {/* Robust Double Divider */}
          <div className="flex flex-col gap-1 mb-8">
            <div className="h-[4px] w-full bg-black" />
            <div className="h-[1px] w-full bg-black/20" />
          </div>

          <h2 className="text-7xl font-serif font-black text-black leading-[1.1] uppercase tracking-tight">
            {description}
          </h2>
          
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="h-[2px] flex-1 bg-black/10" />
            <span className="text-sm font-serif italic text-stone-500 tracking-[0.3em] uppercase font-bold">Premium Logistics / Wine Estate Authority</span>
            <div className="h-[2px] flex-1 bg-black/10" />
          </div>
        </div>
      </div>

      {/* Barcode Footer */}
      <div className="flex flex-col justify-end items-center w-full pb-14 space-y-4 z-10">
        <div className="scale-[2] transform origin-bottom grayscale opacity-90 mb-2">
          <Barcode 
            value={sku} 
            width={2}
            height={40}
            fontSize={0}
            background="transparent"
            displayValue={false}
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-base tracking-[1.2em] text-stone-500 font-bold translate-x-[0.6em]">
            {sku}
          </span>
          <div className="flex items-center gap-6 mt-4">
             <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest border-r border-stone-200 pr-6">
               Vino Argentino - Bebida Nacional
             </span>
             <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">
               Size: A4 Landscape
             </span>
          </div>
        </div>
      </div>

      {/* Corner Accents (Subtle Winery Style) */}
      <div className="absolute bottom-6 left-8 text-[9px] font-mono text-stone-400 uppercase tracking-[0.3em] font-bold">
        Pallet ID: {Math.floor(Math.random() * 100000)} / BODEGA: {sku.split('-')[0] || 'ESTATE'}
      </div>
    </div>
  );
};


