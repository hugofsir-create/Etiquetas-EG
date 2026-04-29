import React from 'react';
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
        "label-container relative bg-white flex flex-col justify-between overflow-hidden print:overflow-visible",
        "w-[297mm] h-[210mm] border border-stone-200 shadow-2xl mx-auto mb-12",
        "print:border-[1.5mm] print:border-black print:shadow-none print:m-0 print:rounded-none px-[10mm] py-[8mm]",
        className
      )}
      id={`label-${sku}`}
    >
      {/* Technical Grid Accents */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t border-l border-black/10" />
      <div className="absolute top-12 right-12 w-12 h-12 border-t border-r border-black/10" />
      <div className="absolute bottom-12 left-12 w-12 h-12 border-b border-l border-black/10" />
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b border-r border-black/10" />

      {/* Winery Decorative Background Element */}
      <div className="absolute -right-20 -top-20 opacity-[0.05] rotate-12 pointer-events-none text-black">
        <Grape size={900} />
      </div>

      {/* Header with Brand Name Only */}
      <div className="w-full pt-6 text-center z-10 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="h-[1.5mm] w-20 bg-black" />
          <Grape className="w-10 h-10 text-black" />
          <span className="text-6xl font-belluccia text-stone-900 px-6 tracking-tight">
            {clientName}
          </span>
          <Grape className="w-10 h-10 text-black" />
          <div className="h-[1.5mm] w-20 bg-black" />
        </div>
        <div className="h-[0.5mm] w-[500px] bg-black/10 mt-3" />
        <span className="text-[11px] uppercase tracking-[0.5em] text-black font-black block mt-3 bg-white px-8 relative z-10">
          SISTEMA DE GESTIÓN VINÍCOLA Y LOGÍSTICA DE PRECISIÓN
        </span>
      </div>

      {/* Main Content Area with Side Logos */}
      <div className="flex-1 flex flex-col justify-center items-center text-center w-full px-12 border-y-[4px] border-black/5 z-10 py-4 my-2 relative">
        <div className="flex items-center justify-between w-full h-full gap-8">
          {/* Left Logo Container */}
          <div className="w-48 h-48 border-2 border-black flex items-center justify-center p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] shrink-0">
            {leftLogo ? (
              <img src={leftLogo} alt="Left Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-[11px] uppercase font-black tracking-widest text-black/20 text-center leading-tight">
                LOGO<br />BODEGA
              </div>
            )}
          </div>

          {/* Center SKU */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-6">
            <div className="flex items-center gap-4 mb-2">
               <div className="h-[1px] w-8 bg-black/30" />
               <span className="text-sm uppercase tracking-[0.5em] text-black font-black italic">ID ARTÍCULO SKU</span>
               <div className="h-[1px] w-8 bg-black/30" />
            </div>
            {/* Dynamic SKU sizing to prevent overflow - Adjusted to not cover logos */}
            <h1 
              className={cn(
                "font-arial-black font-black tracking-[-0.05em] text-black leading-[0.9] uppercase flex items-center justify-center text-center w-full whitespace-nowrap",
                sku.length > 15 ? "text-[4rem]" : sku.length > 12 ? "text-[5.5rem]" : sku.length > 8 ? "text-[7rem]" : "text-[9rem]"
              )}
            >
              {sku}
            </h1>
            {boxes && (
              <div className="mt-6 px-12 py-4 bg-black text-white rounded-xl flex items-center gap-8">
                 <Package className="w-12 h-12 text-brand-accent" />
                 <div className="flex flex-col items-start leading-none">
                   <span className="text-5xl font-arial-black font-black tracking-[0.1em]">{boxes}</span>
                   <span className="text-[11px] font-black tracking-[0.4em] opacity-40 uppercase">Cajas por Pallet</span>
                 </div>
              </div>
            )}
          </div>

          {/* Right Logo Container */}
          <div className="w-48 h-48 border-2 border-black flex items-center justify-center p-4 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] shrink-0">
            {rightLogo ? (
              <img src={rightLogo} alt="Right Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-[11px] uppercase font-black tracking-widest text-black/20 text-center leading-tight">
                ESTATE<br />CONTROL
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 w-full max-w-6xl">
          {/* Robust Triple Divider */}
          <div className="flex flex-col gap-1 mb-4">
            <div className="h-[4px] w-[90%] mx-auto bg-black" />
            <div className="h-[1px] w-[90%] mx-auto bg-black/40" />
          </div>

          <h2 
            className={cn(
              "font-serif font-black text-black leading-[1] uppercase tracking-tight text-center break-words px-8",
              description.length > 40 ? "text-4xl" : "text-5xl"
            )}
          >
            {description}
          </h2>
          
          <div className="mt-6 flex items-center justify-center gap-8 px-12">
            <div className="h-[2px] flex-1 bg-black" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-black uppercase tracking-[0.4em]">ORIGEN: LUJÁN DE CUYO, MENDOZA</span>
            </div>
            <div className="h-[2px] flex-1 bg-black" />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col justify-end items-center w-full pb-10 space-y-6 z-10 relative">
        {/* Quality Seal Accent */}
        <div className="absolute right-24 bottom-16 w-32 h-32 border-2 border-black/10 rounded-full flex items-center justify-center text-center opacity-40 rotate-12">
          <div className="text-[8px] font-black uppercase text-black">
            CONTROL DE ACCESO<br />Y CALIDAD<br />VERIFICADO
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className={cn(
            "font-mono tracking-[0.8em] text-black font-black flex justify-center uppercase",
            sku.length > 20 ? "text-[10px]" : sku.length > 15 ? "text-sm" : "text-xl"
          )} style={{ paddingLeft: '0.8em' }}>
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


