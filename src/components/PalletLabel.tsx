import React from 'react';
import Barcode from 'react-barcode';
import { cn } from '../lib/utils';
import { Grape, Package } from 'lucide-react';

interface PalletLabelProps {
  sku: string;
  description: string;
  boxes?: string | number;
  clientName?: string;
  leftLogo?: string;
  rightLogo?: string;
  className?: string;
}

export const PalletLabel: React.FC<PalletLabelProps> = ({
  sku,
  description,
  boxes,
  clientName = "Escorihuela Gascon",
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
      <div className="absolute top-0 left-0 w-24 h-24 border-t-[12px] border-l-[12px] border-black z-20" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-[12px] border-r-[12px] border-black z-20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[12px] border-l-[12px] border-black z-20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[12px] border-r-[12px] border-black z-20" />

      {/* Decorative Technical Side Text */}
      <div className="absolute left-6 top-1/2 -rotate-90 origin-left text-[14px] font-black tracking-[0.5em] text-black/20 uppercase whitespace-nowrap">
        LOGISTICS SECURE SYSTEM • PALLET IDENTIFICATION • {new Date().getFullYear()}
      </div>
      <div className="absolute right-6 top-1/2 rotate-90 origin-right text-[14px] font-black tracking-[0.5em] text-black/20 uppercase whitespace-nowrap">
        BODEGA ESTATE CONTROL • QUALITY ASSURANCE • PREMIUM EXPORT
      </div>

      {/* Technical Grid Accents */}
      <div className="absolute top-32 left-12 w-12 h-12 border-t border-l border-black/10" />
      <div className="absolute top-32 right-12 w-12 h-12 border-t border-r border-black/10" />
      <div className="absolute bottom-48 left-12 w-12 h-12 border-b border-l border-black/10" />
      <div className="absolute bottom-48 right-12 w-12 h-12 border-b border-r border-black/10" />

      {/* Winery Decorative Background Element */}
      <div className="absolute -right-20 -top-20 opacity-[0.05] rotate-12 pointer-events-none text-black">
        <Grape size={900} />
      </div>

      {/* Header with Brand Name Only */}
      <div className="w-full pt-16 text-center z-10">
        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="h-[2px] w-24 bg-black" />
          <Grape className="w-12 h-12 text-black" />
          <span className="text-6xl font-belluccia text-stone-900 px-4 transition-all">
            {clientName}
          </span>
          <Grape className="w-12 h-12 text-black" />
          <div className="h-[2px] w-24 bg-black" />
        </div>
        <div className="h-[1px] w-[600px] bg-black/10 mx-auto mt-4" />
        <span className="text-[12px] uppercase tracking-[0.5em] text-black font-black block mt-4 bg-white px-8 mx-auto inline-block relative z-10">
          SISTEMA DE GESTIÓN VINÍCOLA Y LOGÍSTICA DE PRECISIÓN
        </span>
      </div>

      {/* Main Content Area with Side Logos */}
      <div className="flex-1 flex flex-col justify-start items-center text-center px-16 border-y-[4px] border-black/5 mx-24 z-10 pt-8">
        <div className="flex items-center justify-between w-full h-[24rem] relative -top-[1cm] gap-4">
          {/* Left Logo Container */}
          <div className="w-56 h-56 border-2 border-black flex items-center justify-center p-4 bg-white self-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
            {leftLogo ? (
              <img src={leftLogo} alt="Left Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-[11px] uppercase font-black tracking-widest text-black/20 text-center leading-tight">
                LOGO<br />BODEGA
              </div>
            )}
          </div>

          {/* Center SKU */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-[1px] w-8 bg-black/30" />
               <span className="text-sm uppercase tracking-[0.5em] text-black font-black italic">ID ARTÍCULO SKU</span>
               <div className="h-[1px] w-8 bg-black/30" />
            </div>
            <h1 className="text-[18rem] font-arial-black font-black tracking-tighter text-black leading-[0.8] uppercase flex items-center justify-center">
              {sku}
            </h1>
            {boxes && (
              <div className="mt-6 px-10 py-3 bg-black text-white rounded-xl flex items-center gap-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
                 <Package className="w-8 h-8 text-brand-accent" />
                 <div className="flex flex-col items-start leading-none">
                   <span className="text-3xl font-arial-black font-black tracking-[0.1em]">{boxes}</span>
                   <span className="text-[10px] font-black tracking-[0.4em] opacity-40 uppercase">Cajas por Pallet</span>
                 </div>
              </div>
            )}
          </div>

          {/* Right Logo Container */}
          <div className="w-56 h-56 border-2 border-black flex items-center justify-center p-4 bg-white self-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
            {rightLogo ? (
              <img src={rightLogo} alt="Right Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-[11px] uppercase font-black tracking-widest text-black/20 text-center leading-tight">
                ESTATE<br />CONTROL
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-0 w-full max-w-6xl relative -top-6">
          {/* Robust Triple Divider */}
          <div className="flex flex-col gap-1.5 mb-10">
            <div className="h-[6px] w-full bg-black" />
            <div className="h-[2px] w-full bg-black/40" />
            <div className="h-[1px] w-full bg-black/10" />
          </div>

          <h2 className="text-8xl font-serif font-black text-black leading-[1] uppercase tracking-tight">
            {description}
          </h2>
          
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="h-[3px] flex-1 bg-black" />
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-black uppercase tracking-[0.4em]">ORIGEN: LUJÁN DE CUYO, MENDOZA</span>
              <span className="text-[10px] font-serif italic text-black/60 tracking-[0.3em] uppercase mt-1">International Standard Logistics Authority</span>
            </div>
            <div className="h-[3px] flex-1 bg-black" />
          </div>
        </div>
      </div>

      {/* Barcode Footer Section */}
      <div className="flex flex-col justify-end items-center w-full pb-16 space-y-6 z-10 relative">
        {/* Quality Seal Accent */}
        <div className="absolute right-32 bottom-20 w-32 h-32 border-2 border-black/10 rounded-full flex items-center justify-center text-center opacity-40 rotate-12">
          <div className="text-[8px] font-black uppercase text-black">
            CONTROL DE ACCESO<br />Y CALIDAD<br />VERIFICADO
          </div>
        </div>

        <div className="scale-[2.4] transform origin-bottom grayscale mb-4">
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
          <span className="font-mono text-2xl tracking-[1.4em] text-black font-black translate-x-[0.7em]">
            {sku}
          </span>
          <div className="flex items-center gap-10 mt-6 pt-4 border-t border-black/10">
             <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">
               Vino Argentino - Bebida Nacional
             </span>
             <div className="h-4 w-[1px] bg-black/20" />
             <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">
               Lote: {new Date().getTime().toString().slice(-6)}
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


