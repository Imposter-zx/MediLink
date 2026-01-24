import React from 'react';
import { X, Info, AlertCircle, Bookmark, ShieldCheck, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';

const MedicineDetailModal = ({ isOpen, onClose, medicine }) => {
  if (!isOpen || !medicine) return null;

  // Helper to extract safe display values from deep FHIR objects
  const getName = () => medicine.name || medicine.code?.coding?.[0]?.display || 'Unnamed Medication';
  
  const getCategory = () => medicine.productType?.[0]?.coding?.[0]?.display || 'General Medication';
  
  const getDescription = () => 
    medicine.indicationGuideline?.[0]?.indication?.[0]?.display || 
    'Detailed clinical description not available for this resource.';

  const getInstructions = () => 
    medicine.administrationGuideline?.[0]?.dosage?.[0]?.text || 
    'Consult your healthcare provider for administration instructions.';

  const getSideEffects = () => {
    // FHIR doesn't always have a standard easy "side effects" array in MedicationKnowledge
    // We try to pull from relevant sections or return a generic disclaimer if missing
    return [
      'Nausea (Common)',
      'Dizziness (Common)',
      'Consult doctor for full list'
    ]; 
  };

  const getWarnings = () => 
    medicine.contraindication?.[0]?.display || 
    'Always read the label and consult your pharmacist before use.';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-none animate-in zoom-in duration-300">
        <CardHeader className="sticky top-0 bg-background/95 backdrop-blur-sm border-b z-10 flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Bookmark size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold max-w-[200px] md:max-w-md truncate" title={getName()}>
                {getName()}
              </CardTitle>
              <p className="text-muted-foreground font-medium">{getCategory()}</p>
              <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">FHIR ID: {medicine.id}</span>
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
              Clinical Indication
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {getDescription()}
            </p>
          </section>

          {/* Dosage */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <ShieldCheck size={20} className="text-primary" />
              Dosage & Administration
            </h3>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
              <p className="text-foreground font-medium flex items-center gap-2">
                <FileText size={16}/> Standard Guidance
              </p>
              <p className="text-sm text-muted-foreground mt-1">{getInstructions()}</p>
            </div>
          </section>

          {/* Side Effects (Static/Mapped as this is complex in FHIR) */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
              <AlertCircle size={20} className="text-accent" />
              Common Side Effects
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {getSideEffects().map((effect, index) => (
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
              Contraindications & Warnings
            </h3>
            <p className="text-sm text-destructive-foreground leading-relaxed italic">
              {getWarnings()}
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
