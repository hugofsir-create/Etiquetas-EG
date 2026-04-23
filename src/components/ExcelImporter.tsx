import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, XCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LabelData {
  sku: string;
  description: string;
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
          
          return {
            sku: skuKey ? String(row[skuKey]) : 'N/A',
            description: descKey ? String(row[descKey]) : 'SIN DESCRIPCIÓN',
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
          "relative group border border-stone-200 rounded-none p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer",
          isHovering ? "border-brand-primary bg-indigo-50/30" : "bg-white hover:border-brand-primary/30",
          error ? "border-red-200 bg-red-50" : ""
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
        
        <div className="mb-4">
          <FileSpreadsheet className="w-8 h-8 text-brand-primary stroke-[1.5px]" />
        </div>

        <h3 className="text-sm font-bold mb-1 text-stone-800 uppercase tracking-tight">{title}</h3>
        <p className="text-stone-400 text-[10px] mb-6 font-medium max-w-[200px]">
          {description}
        </p>

        <div className="flex gap-2">
          <button className="px-6 py-2 bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-900 transition-colors shadow-sm">
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


