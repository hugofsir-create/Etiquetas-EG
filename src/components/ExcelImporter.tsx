import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, XCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LabelData {
  sku: string;
  description: string;
  boxes?: string | number;
  quantity?: number;
}

interface ExcelImporterProps {
  onDataLoaded: (data: LabelData[]) => void;
  className?: string;
  title?: string;
  description?: string;
}

export const ExcelImporter: React.FC<ExcelImporterProps> = ({ 
  onDataLoaded, 
  className,
  title = "Cargar Inventario",
  description = "Arrastra tu archivo .xlsx o .csv aquí para procesar las etiquetas."
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isHovering, setIsHovering] = React.useState(false);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        if (json.length === 0) {
          setError('El archivo está vacío.');
          return;
        }

        const mappedData: LabelData[] = json.map((row) => {
          const keys = Object.keys(row);
          const skuKey = keys.find(k => k.toLowerCase().includes('sku') || k.toLowerCase().includes('codigo'));
          const descKey = keys.find(k => k.toLowerCase().includes('desc') || k.toLowerCase().includes('nombre') || k.toLowerCase().includes('articulo'));
          const boxesKey = keys.find(k => k.toLowerCase().includes('caja') || k.toLowerCase().includes('pallet') || k.toLowerCase().includes('box'));
          const qtyKey = keys.find(k => k.toLowerCase().includes('cant') || k.toLowerCase().includes('total') || k.toLowerCase().includes('stock'));
          
          return {
            sku: skuKey ? String(row[skuKey]).trim() : 'N/A',
            description: descKey ? String(row[descKey]).trim() : 'SIN DESCRIPCIÓN',
            boxes: boxesKey ? row[boxesKey] : undefined,
            quantity: qtyKey ? Number(row[qtyKey]) : undefined,
          };
        });

        setError(null);
        onDataLoaded(mappedData);
      } catch (err) {
        setError('Error al procesar el archivo Excel.');
        console.error(err);
      }
    };
    reader.onerror = () => setError('Error al leer el archivo.');
    reader.readAsBinaryString(file);
  }, [onDataLoaded]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className={cn("w-full mx-auto", className)}>
      <div
        className={cn(
          "relative group border border-zinc-800 rounded-lg p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden",
          isHovering ? "border-brand-primary bg-brand-primary/5" : "bg-zinc-900 hover:border-zinc-700",
          error ? "border-red-900 bg-red-950/20" : ""
        )}
        onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
        onDragLeave={() => setIsHovering(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('excel-upload')?.click()}
      >
        <input
          id="excel-upload"
          type="file"
          className="hidden"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
        />
        
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-brand-primary blur-xl opacity-20" />
          <FileSpreadsheet className="w-8 h-8 text-brand-primary stroke-[1.5px] relative" />
        </div>

        <h3 className="text-sm font-bold mb-1 text-zinc-100 uppercase tracking-tight">{title}</h3>
        <p className="text-zinc-500 text-[10px] mb-6 font-medium max-w-[200px]">
          {description}
        </p>

        <div className="flex gap-2">
          <button className="px-6 py-2 bg-brand-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-brand-primary/10">
            Elegir Archivo
          </button>
        </div>

        {error && (
          <div className="mt-4 py-1 px-3 bg-red-500 text-white text-[8px] uppercase font-bold tracking-widest">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};


