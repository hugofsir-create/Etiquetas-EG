import React, { useState, useEffect } from 'react';
import { PalletLabel } from './components/PalletLabel';
import { ExcelImporter } from './components/ExcelImporter';
import { 
  Printer, 
  RotateCcw, 
  Package, 
  Trash2, 
  Eye, 
  Download, 
  Database, 
  Search, 
  LayoutList,
  AlertCircle,
  CheckCircle2,
  Settings,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

interface LabelData {
  sku: string;
  description: string;
}

export default function App() {
  // State with LocalStorage persistence
  const [materialMaster, setMaterialMaster] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('materialMaster');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [leftLogo, setLeftLogo] = useState<string | null>(() => localStorage.getItem('leftLogo'));
  const [rightLogo, setRightLogo] = useState<string | null>(() => localStorage.getItem('rightLogo'));
  
  const [printQueue, setPrintQueue] = useState<LabelData[]>([]);
  const [selectedTab, setSelectedTab] = useState<'master' | 'print' | 'config'>('master');
  const [skuInput, setSkuInput] = useState('');

  // Persist settings
  useEffect(() => localStorage.setItem('materialMaster', JSON.stringify(materialMaster)), [materialMaster]);
  useEffect(() => { if (leftLogo) localStorage.setItem('leftLogo', leftLogo) }, [leftLogo]);
  useEffect(() => { if (rightLogo) localStorage.setItem('rightLogo', rightLogo) }, [rightLogo]);

  const handleLogoUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (side === 'left') setLeftLogo(result);
        else setRightLogo(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMasterImport = (data: LabelData[]) => {
    const newMaster = { ...materialMaster };
    data.forEach(item => {
      newMaster[item.sku.trim().toUpperCase()] = item.description;
    });
    setMaterialMaster(newMaster);
    setSelectedTab('print');
  };

  const addToQueue = (skusInput: string) => {
    const lines = skusInput.split(/[\n,;]/).map(s => s.trim().toUpperCase()).filter(s => s.length > 0);
    const newItems: LabelData[] = lines.map(sku => ({
      sku,
      description: materialMaster[sku] || 'SKU NO ENCONTRADO EN MAESTRO'
    }));
    setPrintQueue([...printQueue, ...newItems]);
    setSkuInput('');
  };

  const handlePrint = () => window.print();

  return (
    <div className="flex flex-col h-screen bg-stone-100 font-sans overflow-hidden selection:bg-brand-primary selection:text-white">
      {/* Header - Vibrant Brand Colors */}
      <header className="h-16 bg-white border-b border-indigo-100 flex items-center justify-between px-8 z-10 shrink-0 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary flex items-center justify-center text-white font-serif text-2xl italic rounded-xl shadow-lg shadow-indigo-200">E</div>
          <div className="flex flex-col">
            <h1 className="text-stone-900 font-black tracking-tight text-lg leading-none">PalletDraft <span className="text-brand-accent">Designer</span></h1>
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-400 mt-1">SISTEMA INTEGRADO DE ETIQUETADO</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {printQueue.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-2">Listas para imprimir: {printQueue.length}</span>
              <button 
                onClick={handlePrint}
                className="bg-brand-primary text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-indigo-900 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                Imprimir Ahora
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-20 bg-stone-900 flex flex-col items-center py-8 gap-8 shrink-0 print:hidden">
          <NavItem icon={<Database />} active={selectedTab === 'master'} onClick={() => setSelectedTab('master')} label="Maestro" />
          <NavItem icon={<LayoutList />} active={selectedTab === 'print'} onClick={() => setSelectedTab('print')} label="Imprimir" />
          <NavItem icon={<Settings />} active={selectedTab === 'config'} onClick={() => setSelectedTab('config')} label="Config" />
          
          <button 
            onClick={() => { if(confirm('¿Reiniciar App?')) { localStorage.clear(); window.location.reload(); } }}
            className="mt-auto p-4 text-stone-600 hover:text-red-400 transition-colors"
            title="Borrar Todo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </nav>

        {/* Controls Panel */}
        <aside className="w-[340px] bg-white border-r border-stone-200 p-8 flex flex-col gap-8 overflow-y-auto shrink-0 print:hidden">
          <AnimatePresence mode="wait">
            {selectedTab === 'master' && (
              <motion.div key="master" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xs uppercase tracking-widest text-brand-primary font-black">Maestro de Materiales</h2>
                  <p className="text-[10px] text-stone-400 font-medium">Base de datos SKU + Descripción</p>
                </div>
                
                <ExcelImporter 
                  onDataLoaded={handleMasterImport} 
                  title="Importar Catálogo"
                  description="Carga tu base de datos completa aquí."
                />

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-900">Estado</span>
                    <span className="text-xs font-mono font-bold text-brand-primary">{Object.keys(materialMaster).length} registrados</span>
                  </div>
                  <p className="text-[9px] text-indigo-400 leading-tight">
                    El maestro se guarda automáticamente en tu navegador. Puedes sobrescribirlo cargando un nuevo archivo.
                  </p>
                </div>
              </motion.div>
            )}

            {selectedTab === 'print' && (
              <motion.div key="print" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xs uppercase tracking-widest text-brand-primary font-black">Orden de Impresión</h2>
                  <p className="text-[10px] text-stone-400 font-medium">Carga masiva por SKU</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-stone-500">Pegar lista de SKUs</label>
                    <textarea 
                      value={skuInput}
                      onChange={(e) => setSkuInput(e.target.value)}
                      placeholder="SKU-100&#10;SKU-202&#10;SKU-305"
                      className="w-full h-40 bg-stone-50 border border-stone-200 p-4 font-mono text-xs focus:border-brand-primary outline-none transition-all placeholder:text-stone-300"
                    />
                  </div>
                  
                  <button 
                    onClick={() => addToQueue(skuInput)}
                    disabled={skuInput.length === 0}
                    className="w-full py-4 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-900 transition-colors disabled:opacity-20 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Añadir a Fila de Impresión
                  </button>
                  
                  <div className="pt-4 border-t border-stone-100 flex flex-col gap-3">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-stone-500">O importar archivo de pedido</label>
                    <ExcelImporter 
                      onDataLoaded={(data) => setPrintQueue([...printQueue, ...data])}
                      title="Importar Pedido"
                      description="Solo SKUs deseados."
                    />
                  </div>
                </div>

                {printQueue.length > 0 && (
                  <button 
                    onClick={() => setPrintQueue([])}
                    className="w-full py-3 border border-red-100 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Vaciar Fila
                  </button>
                )}
              </motion.div>
            )}

            {selectedTab === 'config' && (
              <motion.div key="config" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <h2 className="text-xs uppercase tracking-widest text-brand-primary font-black">Activos y Logos</h2>
                {['left', 'right'].map((side) => (
                  <LogoUploader 
                    key={side}
                    side={side as 'left' | 'right'}
                    logo={side === 'left' ? leftLogo : rightLogo}
                    onUpload={handleLogoUpload}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Main Stage */}
        <main className="flex-1 bg-stone-200 relative overflow-y-auto p-12 flex flex-col items-center print:p-0 print:bg-white selection:bg-brand-primary/20">
          <AnimatePresence mode="wait">
            {printQueue.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center grayscale opacity-30">
                <div className="w-[800px] h-[565px] bg-white shadow-2xl flex flex-col items-center justify-center gap-6 border-2 border-dashed border-stone-300">
                  <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center">
                    <Printer className="w-10 h-10 text-stone-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-serif italic text-2xl text-stone-400">Sin etiquetas en cola</p>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300">Selecciona SKUs para empezar</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12 print:gap-0">
                <div className="print:hidden flex justify-between items-center w-full max-w-[297mm] px-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-stone-500">{printQueue.length} ETIQUETAS GENERADAS</span>
                  </div>
                  <div className="flex gap-6 font-mono text-[9px] text-stone-400">
                    <span>A4 LANDSCAPE</span>
                    <span>300 DPI OPTIMIZED</span>
                    <span>COLOR: CMYK SAFE</span>
                  </div>
                </div>
                <div className="space-y-12 print:space-y-0">
                  {printQueue.map((item, idx) => (
                    <PalletLabel 
                      key={`${item.sku}-${idx}`}
                      sku={item.sku}
                      description={item.description}
                      leftLogo={leftLogo || undefined}
                      rightLogo={rightLogo || undefined}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          main { padding: 0 !important; margin: 0 !important; background: white !important; display: block !important; position: static !important; overflow: visible !important; }
          .label-container { width: 297mm !important; height: 210mm !important; margin: 0 !important; border: none !important; page-break-after: always; box-shadow: none !important; display: flex !important; }
          header, nav, aside, .print:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function NavItem({ icon, active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-all group",
        active ? "text-brand-accent scale-110" : "text-stone-600 hover:text-stone-400"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
        active ? "bg-indigo-500/10" : ""
      )}>
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <span className="text-[8px] uppercase tracking-widest font-black opacity-60">{label}</span>
    </button>
  );
}

function LogoUploader({ side, logo, onUpload }: any) {
  return (
    <div className="group relative border border-stone-200 p-5 transition-all hover:border-brand-primary/40 bg-stone-50/30">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase font-black text-stone-500 tracking-widest">Logo {side === 'left' ? 'Izquierdo' : 'Derecho'}</span>
        {logo && <CheckCircle2 className="w-3 h-3 text-green-500" />}
      </div>
      <div className="h-16 flex items-center justify-center bg-white border border-stone-100 grayscale hover:grayscale-0 transition-all cursor-pointer overflow-hidden p-2">
        {logo ? <img src={logo} className="max-h-full max-w-full object-contain" /> : <Download className="w-4 h-4 text-stone-300" />}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => onUpload(side, e)} />
      </div>
    </div>
  );
}



