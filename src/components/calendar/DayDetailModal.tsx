
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CycleDay, FlowLevel, Symptom, Mood } from '@/types';
import { X, Trash2, ChevronDown, Edit, Save, XCircle } from 'lucide-react';

interface DayDetailModalProps {
  date: Date;
  cycleDay?: CycleDay;
  onClose: () => void;
  onSave: (date: Date, data: { flow?: FlowLevel, symptoms?: Symptom[], notes?: string }) => void;
  onDelete: (date: Date) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  date,
  cycleDay,
  onClose,
  onSave,
  onDelete
}) => {
  // Ensure date is properly initialized as a Date object
  const modalDate = date instanceof Date ? date : new Date(date);
  
  const [flow, setFlow] = useState<FlowLevel | undefined>(cycleDay?.flow);
  const [symptoms, setSymptoms] = useState<Symptom[]>(cycleDay?.symptoms || []);
  const [notes, setNotes] = useState<string>(cycleDay?.notes || '');
  const [showPreviousEntries, setShowPreviousEntries] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(!cycleDay);
  
  // Handle outside click to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        onClose();
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [onClose]);
  
  const handleSave = () => {
    onSave(modalDate, { flow, symptoms, notes });
    setEditMode(false);
  };
  
  const handleDelete = () => {
    onDelete(modalDate);
  };
  
  const toggleSymptom = (symptom: Symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(modalDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="flex items-center space-x-2">
            {cycleDay && !editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="text-gray-600 hover:text-gray-800"
                title="Edit"
              >
                <Edit size={18} />
              </button>
            )}
            
            {cycleDay && (
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Previous entries dropdown */}
        {cycleDay && (
          <div className="p-4 border-b">
            <button
              className="flex items-center justify-between w-full text-sm font-medium text-gray-700"
              onClick={() => setShowPreviousEntries(!showPreviousEntries)}
            >
              <span>Previous entries for this day</span>
              <ChevronDown size={16} className={`transform transition-transform ${showPreviousEntries ? 'rotate-180' : ''}`} />
            </button>
            
            {showPreviousEntries && (
              <div className="mt-2 bg-gray-50 p-3 rounded-md text-sm">
                <div className="flex justify-between">
                  <span>Created: {format(new Date(cycleDay.createdAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
                {cycleDay.updatedAt !== cycleDay.createdAt && (
                  <div className="mt-1">
                    Last updated: {format(new Date(cycleDay.updatedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="p-4">
          {!editMode ? (
            <div className="space-y-4">
              {flow && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Period flow</h4>
                  <div className="inline-block px-3 py-1 bg-phase-menstrual text-white text-sm rounded-md">
                    {flow.charAt(0).toUpperCase() + flow.slice(1).replace('_', ' ')}
                  </div>
                </div>
              )}
              
              {symptoms.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(symptom => (
                      <span 
                        key={symptom} 
                        className="px-3 py-1 bg-symptom-mood text-white text-sm rounded-md"
                      >
                        {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {notes}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center"
                  onClick={() => setEditMode(true)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Period flow</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.values(FlowLevel).map(flowLevel => (
                    <button
                      key={flowLevel}
                      className={`py-2 px-3 rounded-md text-xs font-medium ${flow === flowLevel ? 'bg-phase-menstrual text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      onClick={() => setFlow(flow === flowLevel ? undefined : flowLevel)}
                    >
                      {flowLevel.charAt(0).toUpperCase() + flowLevel.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(Symptom).map(symptom => (
                    <button
                      key={symptom}
                      className={`py-2 px-3 rounded-md text-xs font-medium text-left ${symptoms.includes(symptom) ? 'bg-symptom-mood text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      onClick={() => toggleSymptom(symptom)}
                    >
                      {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 h-24"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about your day..."
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md flex items-center"
                  onClick={() => {
                    if (cycleDay) {
                      setFlow(cycleDay.flow);
                      setSymptoms(cycleDay.symptoms || []);
                      setNotes(cycleDay.notes || '');
                      setEditMode(false);
                    } else {
                      onClose();
                    }
                  }}
                >
                  <XCircle size={16} className="mr-1" />
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-cycle-primary hover:bg-cycle-secondary text-white rounded-md flex items-center"
                  onClick={handleSave}
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
