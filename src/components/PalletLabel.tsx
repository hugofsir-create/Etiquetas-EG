import React from 'react';
import { cn } from '../lib/utils';
import { Grape, Package } from 'lucide-react';

interface PalletLabelProps {
  sku: string;
  description: string;
  boxes?: string | number;
  receivedDate?: string;
  clientName?: string;
  leftLogo?: string;
  rightLogo?: string;
  className?: string;
}

export const PalletLabel: React.FC<PalletLabelProps> = ({
  sku,
  description,
  boxes,
  receivedDate,
  clientName = "Escorihuela Gascon",
  leftLogo,
  rightLogo,
  className,
}) => {
  return (
    <div 
      className={cn(
        "label-container relative bg-white flex flex-col justify-between overflow-hidden print:overflow-visible",
        "w-[297mm] h-[210mm] border-[2mm] border-black shadow-2xl mx-auto mb-12",
        "print:shadow-none print:m-0 print:rounded-none px-[15mm] py-[12mm] box-border",
        className
      )}
      id={`label-${sku}`}
    >
      {/* Winery Decorative Background Element */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] rotate-12 pointer-events-none text-black">
        <Grape size={600} />
      </div>

      {/* Header with Brand Name Only */}
      <div className="w-full pt-2 text-center z-10 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="h-[1mm] w-16 bg-black" />
          <Grape className="w-8 h-8 text-black" />
          <span className="text-5xl font-belluccia text-stone-900 px-6 tracking-tight">
            {clientName}
          </span>
          <Grape className="w-8 h-8 text-black" />
          <div className="h-[1mm] w-16 bg-black" />
        </div>
        <div className="h-[0.3mm] w-[400px] bg-black/20 mt-2" />
        <span className="text-[10px] uppercase tracking-[0.5em] text-black font-black block mt-2 bg-white px-8 relative z-10">
          SISTEMA DE GESTIÓN LOGÍSTICA
        </span>
      </div>

      {/* Main Content Area with Side Logos */}
      <div className="flex-1 flex flex-col justify-center items-center text-center w-full px-6 border-y-[2px] border-black/10 z-10 py-6 my-4 relative">
        <div className="flex items-center justify-between w-full h-full gap-8">
          {/* Left Logo Container */}
          <div className="w-40 h-40 border-2 border-black flex items-center justify-center p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] shrink-0">
            {leftLogo ? (
              <img src={leftLogo} alt="Left Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-[10px] uppercase font-black tracking-widest text-black/20 text-center leading-tight">
                LOGO<br />BODEGA
              </div>
            )}
          </div>

          {/* Center SKU */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
            <div className="flex items-center gap-3 mb-2">
               <div className="h-[1px] w-6 bg-black/30" />
               <span className="text-xs uppercase tracking-[0.4em] text-black font-black italic">ID ARTÍCULO SKU</span>
               <div className="h-[1px] w-6 bg-black/30" />
            </div>
            {/* SKU Display - Enforced containment within center area */}
            <div className="w-full flex items-center justify-center overflow-hidden">
               <h1 
                 className={cn(
                   "font-arial-black font-black tracking-[-0.05em] text-black leading-[0.85] uppercase text-center w-full",
                   sku.length > 15 ? "text-[5.5rem]" : sku.length > 12 ? "text-[7.5rem]" : sku.length > 8 ? "text-[9.5rem]" : "text-[12rem]"
                 )}
               >
                 {sku}
               </h1>
            </div>
            {boxes && (
              <div className="mt-4 px-10 py-3 bg-black text-white rounded-lg flex items-center gap-6">
                 <Package className="w-8 h-8 text-brand-accent" />
                 <div className="flex flex-col items-start leading-none">
                   <span className="text-4xl font-arial-black font-black tracking-[0.05em]">{boxes}</span>
                   <span className="text-[9px] font-black tracking-[0.3em] opacity-40 uppercase">Cajas por Pallet</span>
                 </div>
              </div>
            )}
          </div>

          {/* Right Logo Container */}
          <div className="w-40 h-40 border-2 border-black flex items-center justify-center p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] shrink-0">
            {rightLogo ? (
              <img src={rightLogo} alt="Right Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-[10px] uppercase font-black tracking-widest text-black/20 text-center leading-tight">
                ESTATE<br />CONTROL
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 w-full max-w-5xl">
          <div className="flex flex-col gap-1 mb-4">
            <div className="h-[3px] w-[80%] mx-auto bg-black" />
          </div>

          <h2 
            className={cn(
              "font-serif font-black text-black leading-[0.95] uppercase tracking-tight text-center break-words px-4",
              description.length > 40 ? "text-4xl" : "text-5xl"
            )}
          >
            {description}
          </h2>
          
          <div className="mt-6 flex items-center justify-center gap-6 px-12">
            <div className="h-[1.5px] flex-1 bg-black" />
            <span className="text-[9px] font-black text-black uppercase tracking-[0.4em] whitespace-nowrap">
              ORIGEN: LUJÁN DE CUYO, MENDOZA, ARGENTINA
            </span>
            <div className="h-[1.5px] flex-1 bg-black" />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col justify-end items-center w-full pb-2 space-y-4 z-10 relative">
        <div className="flex flex-col items-center">
          <span className={cn(
            "font-mono tracking-[0.6em] text-black font-black flex justify-center uppercase",
            sku.length > 20 ? "text-[10px]" : sku.length > 15 ? "text-sm" : "text-lg"
          )} style={{ paddingLeft: '0.6em' }}>
            {sku}
          </span>
          <div className="flex items-center gap-8 mt-4 pt-4 border-t-2 border-black/10">
             <span className="text-[9px] font-black text-black uppercase tracking-[0.2em]">
               Vino Argentino - Bebida Nacional
             </span>
             <div className="h-3 w-[1px] bg-black/20" />
             <span className="text-[9px] font-black text-black uppercase tracking-[0.2em]">
               Lote: {new Date().getTime().toString().slice(-6)}
             </span>
             {receivedDate && (
               <>
                 <div className="h-3 w-[1px] bg-black/20" />
                 <span className="text-[9px] font-black text-black uppercase tracking-[0.2em]">
                   Recibido: {receivedDate}
                 </span>
               </>
             )}
          </div>
        </div>
      </div>

      {/* Winery Metadata */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
        <div className="text-[8px] font-mono text-stone-500 uppercase tracking-[0.2em] font-bold">
          Pallet ID: {Math.floor(Math.random() * 100000)} / {sku.split('-')[0] || 'ESTATE'}
        </div>
        <div className="text-[8px] font-mono text-stone-500 uppercase tracking-[0.2em] font-bold">
          LabelHub Pro © Precision Printing
        </div>
      </div>
    </div>
  );
};


