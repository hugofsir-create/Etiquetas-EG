import React from 'react';
import Barcode from 'react-barcode';
import { cn } from '../lib/utils';

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
      {/* Logos Header */}
      <div className="flex justify-between items-start w-full p-12">
        <div className="w-48 h-24 border border-stone-100 flex items-center justify-start p-4">
          {leftLogo ? (
            <img src={leftLogo} alt="Left Logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
              Logo Izquierdo
            </div>
          )}
        </div>
        
        <div className="text-center pt-2">
          <span className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-bold block mb-1">
            CONTROL DE LOGÍSTICA
          </span>
          <div className="h-[1px] w-24 bg-stone-200 mx-auto" />
        </div>

        <div className="w-48 h-24 border border-stone-100 flex items-center justify-end p-4">
          {rightLogo ? (
            <img src={rightLogo} alt="Right Logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-[10px] uppercase font-bold tracking-widest text-stone-300">
              Logo Derecho
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-12 border-y border-stone-100 mx-12">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-400 font-bold italic">Product SKU</span>
          <h1 className="text-9xl font-mono font-black tracking-tighter text-stone-900 leading-none">
            {sku}
          </h1>
        </div>
        
        <div className="mt-12 pt-8 border-t border-stone-100 w-full max-w-4xl">
          <h2 className="text-5xl font-serif italic text-stone-700 leading-tight">
            {description}
          </h2>
        </div>
      </div>

      {/* Barcode Footer */}
      <div className="flex flex-col justify-end items-center w-full pb-16 space-y-4">
        <div className="scale-[1.8] transform origin-bottom grayscale opacity-90">
          <Barcode 
            value={sku} 
            width={2}
            height={60}
            fontSize={0}
            background="transparent"
            displayValue={false}
          />
        </div>
        <span className="font-mono text-sm tracking-[0.8em] text-stone-400 uppercase">
          (01){sku}(21){Math.floor(Math.random() * 10000)}
        </span>
      </div>

      {/* Subtle Page Info for Editorial Feel */}
      <div className="absolute bottom-4 left-8 text-[8px] font-mono text-stone-300 uppercase tracking-widest">
        Pallet ID: {sku} / FORMAT: A4 LANDSCAPE / 300DPI
      </div>
    </div>
  );
};

