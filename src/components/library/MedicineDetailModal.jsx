import React from 'react';
import { X, Info, AlertCircle, Bookmark, ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

const MedicineDetailModal = ({ isOpen, onClose, medicine }) => {
  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-none animate-in zoom-in duration-300">
        <CardHeader className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10 flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Bookmark size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{medicine.name}</CardTitle>
              <p className="text-muted-foreground font-medium">{medicine.category}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Overview */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <Info size={20} className="text-primary" />
              Overview
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {medicine.description}
            </p>
          </section>

          {/* Dosage */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <ShieldCheck size={20} className="text-primary" />
              Dosage & Administration
            </h3>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-foreground font-medium">{medicine.dosage}</p>
              <p className="text-sm text-muted-foreground mt-1">{medicine.administration}</p>
            </div>
          </section>

          {/* Side Effects */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <AlertCircle size={20} className="text-accent" />
              Side Effects
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {medicine.sideEffects.map((effect, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                  {effect}
                </li>
              ))}
            </ul>
          </section>

          {/* Warnings */}
          <section className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
            <h3 className="text-destructive font-bold flex items-center gap-2 mb-3">
              <AlertCircle size={20} />
              Important Warnings
            </h3>
            <p className="text-sm text-destructive-foreground leading-relaxed italic">
              {medicine.warnings}
            </p>
          </section>

          <div className="pt-4">
            <Button onClick={onClose} className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
              Back to Library
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineDetailModal;
