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
  Plus,
  PlusSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

interface LabelData {
  sku: string;
  description: string;
  boxes?: string | number;
  totalQuantity?: number;
  palletCount?: number;
}

interface MaterialInfo {
  description: string;
  boxes?: string | number;
}

interface Client {
  id: string;
  name: string;
  materialMaster: Record<string, MaterialInfo>;
  leftLogo: string | null;
  rightLogo: string | null;
}

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'eg',
    name: 'Escorihuela Gascon',
    materialMaster: {},
    leftLogo: null,
    rightLogo: null
  },
  {
    id: 'rutini',
    name: 'Rutini wines',
    materialMaster: {},
    leftLogo: null,
    rightLogo: null
  }
];

export default function App() {
  // Multi-client State
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('clients_data');
    let data: Client[] = saved ? JSON.parse(saved) : DEFAULT_CLIENTS;
    // Migration: Update Zuccardi to Rutini wines and fix materialMaster structure
    data = data.map(c => {
      let updatedClient = { ...c };
      if (c.id === 'zuccardi' || c.name === 'Zuccardi') {
        updatedClient = { ...updatedClient, id: 'rutini', name: 'Rutini wines' };
      }
      
      // Migrate materialMaster from Record<string, string> to Record<string, MaterialInfo>
      const newMaster: Record<string, MaterialInfo> = {};
      Object.entries(updatedClient.materialMaster).forEach(([sku, value]) => {
        if (typeof value === 'string') {
          newMaster[sku] = { description: value };
        } else {
          newMaster[sku] = value;
        }
      });
      updatedClient.materialMaster = newMaster;
      return updatedClient;
    });
    return data;
  });
  
  const [activeClientId, setActiveClientId] = useState<string>(() => {
    let id = localStorage.getItem('active_client_id') || 'eg';
    if (id === 'zuccardi') id = 'rutini';
    return id;
  });

  const activeClient = clients.find(c => c.id === activeClientId) || clients[0];

  const [printQueue, setPrintQueue] = useState<LabelData[]>([]);
  const [selectedTab, setSelectedTab] = useState<'master' | 'print' | 'config'>('master');
  const [skuInput, setSkuInput] = useState('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('clients_data', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('active_client_id', activeClientId);
  }, [activeClientId]);

  const updateActiveClient = (updates: Partial<Client>) => {
    setClients(prev => prev.map(c => 
      c.id === activeClientId ? { ...c, ...updates } : c
    ));
  };

  const handleLogoUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (side === 'left') updateActiveClient({ leftLogo: result });
        else updateActiveClient({ rightLogo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMasterImport = (data: LabelData[]) => {
    const newMaster = { ...activeClient.materialMaster };
    data.forEach(item => {
      newMaster[item.sku.trim().toUpperCase()] = {
        description: item.description,
        boxes: item.boxes
      };
    });
    updateActiveClient({ materialMaster: newMaster });
  };

  const addToQueue = (skusInput: string) => {
    const lines = skusInput.split('\n').filter(line => line.trim() !== '');
    const newItems: LabelData[] = [];
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const sku = parts[0].toUpperCase();
      const qtyStr = parts[1];
      const totalQty = qtyStr ? parseInt(qtyStr, 10) : 0;
      
      const info = activeClient.materialMaster[sku];
      if (info) {
        const boxesPerPallet = info.boxes ? Number(info.boxes) : 1;
        // If total quantity is provided, calculate pallets. Otherwise assume 1.
        const palletsNeeded = totalQty > 0 ? Math.ceil(totalQty / boxesPerPallet) : 1;
        
        for (let i = 0; i < palletsNeeded; i++) {
          newItems.push({
            sku,
            description: info.description,
            boxes: info.boxes,
            totalQuantity: totalQty,
            palletCount: palletsNeeded
          });
        }
      } else {
        newItems.push({
          sku,
          description: 'SKU NO ENCONTRADO EN MAESTRO',
          boxes: undefined
        });
      }
    });
    
    setPrintQueue([...printQueue, ...newItems]);
    setSkuInput('');
  };

  const handlePrint = () => {
    if (printQueue.length === 0) {
      alert('La cola de impresión está vacía. Añade SKUs primero con su cantidad.');
      return;
    }
    
    // Switch to print tab always to ensure elements are mounted for the browser
    setSelectedTab('print');
    
    // Use a longer delay and ensure we target the next tick
    setTimeout(() => {
      window.print();
    }, 800);
  };

  const processAndAddToQueue = (data: LabelData[]) => {
    const newItems: LabelData[] = [];
    
    data.forEach(item => {
      const sku = item.sku.toUpperCase();
      const info = activeClient.materialMaster[sku] || { description: item.description, boxes: item.boxes };
      
      const boxesPerPallet = info.boxes ? Number(info.boxes) : 1;
      const totalQty = item.quantity || 0;
      
      // Calculate pallets if quantity is provided, otherwise just add 1
      const palletsNeeded = totalQty > 0 ? Math.ceil(totalQty / boxesPerPallet) : 1;
      
      for (let i = 0; i < palletsNeeded; i++) {
        newItems.push({
          sku,
          description: info.description || item.description,
          boxes: info.boxes || item.boxes,
          totalQuantity: totalQty,
          palletCount: palletsNeeded
        });
      }
    });

    setPrintQueue(prev => [...prev, ...newItems]);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden selection:bg-brand-primary selection:text-white">
      {/* Header - Dark Sleek */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-8 z-20 shrink-0 print:hidden shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary flex items-center justify-center text-white font-serif text-2xl italic rounded-xl shadow-lg shadow-indigo-900/40">
              {activeClient.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-black tracking-tight text-lg leading-none">
                Label <span className="text-brand-accent">Hub</span>
              </h1>
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-500 mt-1">CLIENTE: {activeClient.name}</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-zinc-800" />

          {/* Client Switcher */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {clients.map(client => (
              <button
                key={client.id}
                onClick={() => {
                  setActiveClientId(client.id);
                  setPrintQueue([]);
                }}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                  activeClientId === client.id 
                    ? "bg-zinc-800 text-brand-accent shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {client.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {printQueue.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end print:hidden">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{printQueue.length} ETIQUETAS</span>
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">EN COLA DE IMPRESIÓN</span>
              </div>
              <button 
                onClick={handlePrint}
                className="bg-brand-primary text-white ml-2 px-10 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center gap-3 animate-pulse hover:animate-none group"
              >
                <Printer className="w-4 h-4 group-hover:scale-125 transition-transform" />
                Imprimir Todo
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-20 bg-zinc-950 border-r border-zinc-900 flex flex-col items-center py-8 gap-8 shrink-0 print:hidden">
          <NavItem icon={<Database />} active={selectedTab === 'master'} onClick={() => setSelectedTab('master')} label="Maestro" />
          <NavItem icon={<LayoutList />} active={selectedTab === 'print'} onClick={() => setSelectedTab('print')} label="Imprimir" />
          <NavItem icon={<Settings />} active={selectedTab === 'config'} onClick={() => setSelectedTab('config')} label="Config" />
          
          <button 
            onClick={() => { if(confirm('¿Reiniciar App?')) { localStorage.clear(); window.location.reload(); } }}
            className="mt-auto p-4 text-zinc-700 hover:text-red-500 transition-colors"
            title="Borrar Todo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </nav>

        {/* Controls Panel */}
        <aside className="w-[340px] bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col gap-8 overflow-y-auto shrink-0 print:hidden">
          <AnimatePresence mode="wait">
            {selectedTab === 'master' && (
              <motion.div key="master" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xs uppercase tracking-widest text-brand-primary font-black">Maestro Materiales</h2>
                  <p className="text-[10px] text-zinc-500 font-medium">Base de datos SKU + Descripción</p>
                </div>
                
                <ExcelImporter 
                  onDataLoaded={handleMasterImport} 
                  title="Importar Catálogo"
                  description="Carga tu base de datos (.xlsx)"
                  className="bg-zinc-800 border-zinc-700"
                />

                <div className="bg-brand-primary/5 border border-brand-primary/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-primary">Estado</span>
                    <span className="text-xs font-mono font-bold text-white">{Object.keys(activeClient.materialMaster).length} registrados</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-tight">
                    El maestro se guarda automáticamente para {activeClient.name}.
                  </p>
                </div>

                {Object.keys(activeClient.materialMaster).length > 0 && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        const allLabels = Object.entries(activeClient.materialMaster).map(([sku, info]: [string, any]) => ({ 
                          sku, 
                          description: info.description, 
                          boxes: info.boxes 
                        }));
                        setPrintQueue([...printQueue, ...allLabels]);
                        setSelectedTab('print');
                      }}
                      className="w-full py-3 bg-zinc-800 border-2 border-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-widest hover:border-brand-primary hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3 h-3" />
                      Cargar Todo al Pedido
                    </button>
                    
                    <div className="max-h-64 overflow-y-auto border border-zinc-800 rounded-lg">
                      <table className="w-full text-left">
                        <thead className="bg-zinc-950 sticky top-0">
                          <tr>
                            <th className="text-[8px] uppercase tracking-widest p-2 font-black text-zinc-600">SKU</th>
                            <th className="text-[8px] uppercase tracking-widest p-2 font-black text-zinc-600">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {Object.entries(activeClient.materialMaster).slice(0, 50).map(([sku, info]: [string, any]) => (
                            <tr key={sku} className="hover:bg-zinc-800/50 transition-colors group">
                              <td className="p-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-mono font-bold text-zinc-300">{sku}</span>
                                  <span className="text-[8px] text-zinc-500 truncate w-32">{info.description}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                <button 
                                  onClick={() => addToQueue(sku)}
                                  className="p-1.5 text-brand-accent hover:bg-brand-accent hover:text-black rounded transition-all"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'print' && (
              <motion.div key="print" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xs uppercase tracking-widest text-brand-primary font-black">Orden de Impresión</h2>
                  <p className="text-[10px] text-zinc-500 font-medium">Carga masiva por SKU</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-700/50 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <PlusSquare className="w-5 h-5 text-brand-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Carga por Cantidad</h3>
                  </div>
                  <textarea 
                    value={skuInput}
                    onChange={(e) => setSkuInput(e.target.value)}
                    placeholder="Escribe SKU y Cantidad Total&#10;Ejemplo:&#10;80001 300&#10;80002 120"
                    className="w-full bg-zinc-950 border border-zinc-800 p-4 text-xs font-mono text-zinc-300 rounded-xl h-40 focus:border-brand-primary/50 outline-none transition-all placeholder:text-zinc-700"
                  />
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => addToQueue(skuInput)}
                      className="w-full py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all rounded-xl shadow-lg border border-brand-primary/20"
                    >
                      Añadir a Fila de Impresión
                    </button>
                    <div className="py-2 flex items-center gap-4">
                      <div className="h-[1px] flex-1 bg-zinc-800" />
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">O IMPORTAR ARCHIVO</span>
                      <div className="h-[1px] flex-1 bg-zinc-800" />
                    </div>
                    <ExcelImporter 
                      onDataLoaded={(data) => processAndAddToQueue(data)}
                      title="Importar Pedido"
                      description="Carga SKUs y cantidades (Excel/CSV)"
                      className="bg-zinc-800/30 border-zinc-700/20"
                    />
                    <p className="text-[9px] text-zinc-600 text-center italic">Calcularemos el total de etiquetas según las cajas por pallet del maestro.</p>
                  </div>
                </div>

                {printQueue.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={handlePrint}
                        className="w-full py-5 bg-brand-accent text-zinc-950 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-accent/20"
                      >
                        <Printer className="w-5 h-5" />
                        Imprimir Cola Completa
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <h3 className="text-[9px] uppercase tracking-widest font-black text-zinc-600">Contenido de la Fila</h3>
                      <button onClick={() => setPrintQueue([])} className="text-[8px] text-red-500 font-bold uppercase hover:underline">Limpiar Todo</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto border border-zinc-800 rounded-lg divide-y divide-zinc-800 bg-zinc-950">
                      {printQueue.map((item, index) => (
                        <div key={index} className="p-3 flex items-center justify-between group hover:bg-zinc-900 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-zinc-300">{item.sku}</span>
                            <span className="text-[8px] text-zinc-500 truncate w-32">{item.description}</span>
                          </div>
                          <button 
                            onClick={() => {
                              const newQueue = [...printQueue];
                              newQueue.splice(index, 1);
                              setPrintQueue(newQueue);
                            }}
                            className="p-1 hover:text-red-500 text-zinc-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'config' && (
              <motion.div key="config" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <h2 className="text-xs uppercase tracking-widest text-brand-primary font-black">Activos y Logos - {activeClient.name}</h2>
                {['left', 'right'].map((side) => (
                  <LogoUploader 
                    key={side}
                    side={side as 'left' | 'right'}
                    logo={side === 'left' ? activeClient.leftLogo : activeClient.rightLogo}
                    onUpload={handleLogoUpload}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Main Stage */}
        <main className="flex-1 bg-zinc-950 relative overflow-y-auto p-12 flex flex-col items-center print:p-0 print:bg-white selection:bg-brand-primary/20">
          {/* Permanent Print Container (Always in DOM for window.print()) */}
          <div className="hidden print:block w-full">
            {printQueue.map((item, idx) => (
              <PalletLabel 
                key={`print-${item.sku}-${idx}`}
                sku={item.sku}
                description={item.description}
                boxes={item.boxes}
                leftLogo={activeClient.leftLogo || undefined}
                rightLogo={activeClient.rightLogo || undefined}
                clientName={activeClient.name}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedTab === 'master' ? (
              <motion.div key="master-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Maestro de Materiales</h2>
                    <p className="text-sm text-zinc-500 font-medium">Visualización completa de la base de datos de {activeClient.name}</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl flex items-center gap-4">
                    <Database className="w-5 h-5 text-brand-accent" />
                    <span className="text-lg font-mono font-bold text-white">{Object.keys(activeClient.materialMaster).length} <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Items</span></span>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-zinc-950 border-b border-zinc-800">
                        <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-left w-1/4">SKU / Código</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-left w-1/2">Descripción de Producto</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center w-1/4">Cajas por Pallet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {Object.keys(activeClient.materialMaster).length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-20 text-center">
                             <div className="flex flex-col items-center gap-4 grayscale opacity-30">
                               <LayoutList size={48} className="text-zinc-600" />
                               <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">No hay datos cargados en el maestro</p>
                             </div>
                          </td>
                        </tr>
                      ) : (
                        Object.entries(activeClient.materialMaster).map(([sku, info]: [string, any]) => (
                          <tr key={sku} className="hover:bg-zinc-800/40 transition-colors group">
                            <td className="p-5 font-mono text-sm font-bold text-brand-accent uppercase tracking-tight">{sku}</td>
                            <td className="p-5 text-sm font-bold text-zinc-300 uppercase tracking-tight leading-relaxed">{info.description}</td>
                            <td className="p-5 text-center">
                               <span className="inline-block px-4 py-1.5 bg-zinc-950 border border-zinc-800 text-white rounded-full font-mono text-sm font-black shadow-inner">
                                 {info.boxes || '—'}
                               </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : selectedTab === 'config' ? (
              <motion.div key="config-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl flex flex-col items-center justify-center min-h-full gap-12">
                 <div className="text-center space-y-4">
                   <Settings size={64} className="mx-auto text-brand-primary" />
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Configuración del Cliente</h2>
                   <p className="text-zinc-500 text-sm max-w-md mx-auto">Ajusta los parámetros visuales y logísticos específicos para {activeClient.name}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 w-full">
                    {['left', 'right'].map((side) => (
                      <LogoUploader 
                        key={side}
                        side={side as 'left' | 'right'}
                        logo={side === 'left' ? activeClient.leftLogo : activeClient.rightLogo}
                        onUpload={handleLogoUpload}
                      />
                    ))}
                 </div>
              </motion.div>
            ) : printQueue.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center grayscale opacity-10">
                <div className="w-[800px] h-[565px] bg-black shadow-2xl flex flex-col items-center justify-center gap-6 border-2 border-dashed border-zinc-800">
                  <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center">
                    <Printer className="w-10 h-10 text-zinc-700" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-serif italic text-2xl text-zinc-700">Selecciona cliente y carga SKUs</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12 print:hidden">
                <div className="flex justify-between items-center w-full max-w-[297mm] px-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-zinc-500">{printQueue.length} ETIQUETAS {activeClient.name.toUpperCase()}</span>
                  </div>
                  <div className="flex gap-6 font-mono text-[9px] text-zinc-700">
                    <span>VISTA PREVIA DE IMPRESIÓN</span>
                  </div>
                </div>
                <div className="space-y-12">
                  {printQueue.map((item, idx) => (
                    <PalletLabel 
                      key={`preview-${item.sku}-${idx}`}
                      sku={item.sku}
                      description={item.description}
                      boxes={item.boxes}
                      leftLogo={activeClient.leftLogo || undefined}
                      rightLogo={activeClient.rightLogo || undefined}
                      clientName={activeClient.name}
                    />
                  ))}
                  
                  <div className="flex justify-center pb-20">
                     <button 
                       onClick={handlePrint}
                       className="px-16 py-8 bg-brand-accent text-zinc-950 font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-105 transition-all flex items-center gap-6"
                     >
                       <Printer size={32} />
                       <span className="text-2xl">Confirmar e Imprimir {printQueue.length} Etiquetas</span>
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media print {
          @page { 
            size: A4 landscape; 
            margin: 0; 
          }
          html, body, #root, [class*="h-screen"], [class*="overflow-hidden"] { 
            height: auto !important; 
            overflow: visible !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          main { 
            padding: 0 !important; 
            margin: 0 !important; 
            background: white !important; 
            display: block !important; 
            position: static !important; 
            overflow: visible !important; 
            height: auto !important;
          }
          .label-container { 
            width: 297mm !important; 
            height: 210mm !important; 
            margin: 0 !important; 
            border: none !important; 
            page-break-after: always !important; 
            break-after: page !important;
            box-shadow: none !important; 
            display: flex !important;
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
          }
          header, nav, aside, .print\\:hidden { 
            display: none !important; 
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
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
        active ? "text-brand-accent scale-110" : "text-zinc-700 hover:text-zinc-500"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
        active ? "bg-brand-accent/10" : ""
      )}>
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <span className="text-[8px] uppercase tracking-widest font-black opacity-60">{label}</span>
    </button>
  );
}

function LogoUploader({ side, logo, onUpload }: any) {
  return (
    <div className="group relative border border-zinc-800 p-5 transition-all hover:border-brand-primary bg-zinc-950">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Logo {side === 'left' ? 'Izquierdo' : 'Derecho'}</span>
        {logo && <CheckCircle2 className="w-3 h-3 text-brand-accent" />}
      </div>
      <div className="h-16 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden p-2 relative">
        {logo ? <img src={logo} className="max-h-full max-w-full object-contain" /> : <Plus className="w-4 h-4 text-zinc-700" />}
        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => onUpload(side, e)} />
      </div>
    </div>
  );
}



