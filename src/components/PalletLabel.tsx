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
      {/* Winery Decorative Background Element */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] rotate-12 pointer-events-none">
        <Grape size={400} />
      </div>

      {/* Logos Header */}
      <div className="flex justify-between items-start w-full p-12 z-10">
        <div className="w-72 h-36 border border-stone-100 flex items-center justify-start p-2 bg-white/50 backdrop-blur-sm">
          {leftLogo ? (
            <img src={leftLogo} alt="Left Logo" className="max-w-[110%] max-h-[110%] object-contain" />
          ) : (
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
              Logo Bodega
            </div>
          )}
        </div>
        
        <div className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Grape className="w-4 h-4 text-wine-deep" />
            <span className="text-4xl font-belluccia text-stone-800 px-2">
              Escorihuela Gascon
            </span>
            <Grape className="w-4 h-4 text-wine-deep" />
          </div>
          <div className="h-[1px] w-64 bg-stone-200 mx-auto mt-2" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold block mt-2">
            GESTIÓN DE BODEGA Y LOGÍSTICA
          </span>
        </div>

        <div className="w-72 h-36 border border-stone-100 flex items-center justify-end p-2 bg-white/50 backdrop-blur-sm">
          {rightLogo ? (
            <img src={rightLogo} alt="Right Logo" className="max-w-[110%] max-h-[110%] object-contain" />
          ) : (
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
              Operador Logístico
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-12 border-y border-stone-100 mx-12 z-10">
        <div className="space-y-4">
          <span className="text-sm uppercase tracking-[0.4em] text-stone-400 font-bold italic">CÓDIGO SKU</span>
          <h1 className="text-[13rem] font-mono font-black tracking-tighter text-stone-900 leading-none">
            {sku}
          </h1>
        </div>
        
        <div className="mt-12 pt-10 border-t-2 border-stone-900/10 w-full max-w-5xl">
          <h2 className="text-7xl font-serif font-bold text-black leading-[1.1] uppercase">
            {description}
          </h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-stone-300" />
            <span className="text-xs font-serif italic text-stone-400 tracking-widest uppercase">Premium Product / Wine Estate</span>
            <div className="h-[1px] w-12 bg-stone-300" />
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


