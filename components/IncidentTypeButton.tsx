
import React from 'react';
import { IncidentType } from '../types';

interface IncidentTypeButtonProps {
  type: IncidentType;
  isSelected: boolean;
  onClick: (type: IncidentType) => void;
}

const IncidentTypeButton: React.FC<IncidentTypeButtonProps> = ({ type, isSelected, onClick }) => {
  const baseClasses = "flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 transition-colors text-sm font-medium leading-normal";
  const activeClasses = "bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-[#101622]";
  const inactiveClasses = "bg-[#282e39] hover:bg-[#3b4354] text-white";

  return (
    <button 
      onClick={() => onClick(type)}
      className={`${baseClasses} ${isSelected ? activeClasses : inactiveClasses}`}
    >
      {isSelected && <span className="material-symbols-outlined text-white text-[18px]">check</span>}
      <p>{type}</p>
    </button>
  );
};

export default IncidentTypeButton;
