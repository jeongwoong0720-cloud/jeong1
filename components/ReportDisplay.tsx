
import React from 'react';
import { ReportData, ReportType, IncidentType } from '../types';

interface ReportDisplayProps {
  report: ReportData;
  onClose: () => void;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, onClose }) => {
  const formattedDate = new Date(report.dateTime).toLocaleString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(/\. /g, '. ').replace(':', ':');

  const formatPerson = (p: any, defaultVal: string) => {
    if (!p.name) return defaultVal;
    return `${p.name} (${p.age}${p.age ? '세' : ''}, ${p.gender})`;
  };

  const reportTitle = `[ 영암군 ${report.eupMyeon} ${report.incidentType} 사건 ${report.reportType} 보고 ]`;

  const isEnforcement = report.reportType === ReportType.ENFORCEMENT;
  const isFire = report.incidentType === IncidentType.FIRE;
  const isDomesticViolence = report.incidentType === IncidentType.DOMESTIC_VIOLENCE;

  // 보고 유형에 따른 일시 레이블 결정
  const dateLabel = report.reportType === ReportType.OCCURRENCE ? '발생 일시' :
                    report.reportType === ReportType.APPREHENSION ? '검거 일시' : '단속 일시';

  let reportText = `${reportTitle}\n\n`;
  reportText += `1. ${dateLabel} : ${formattedDate}\n`;
  reportText += `2. 발생 장소 : 영암군 ${report.eupMyeon} 소재 ${report.detailAddress}\n`;

  if (isEnforcement) {
    // 단속 보고서 전용 구조
    reportText += `3. 위반 사항 : ${report.description}\n`;
    reportText += `4. 적발 경위 : ${report.apprehensionProcess || '불상'}\n`;
    reportText += `5. 관련자 인적사항 \n`;
    reportText += `  1) 신고자 : ${report.involvedReporter || '불상'}\n`;
    reportText += `  2) 피의자 : ${formatPerson(report.suspect, '불상')}\n`;
    reportText += `6. 조치사항 : ${report.actionsTaken}`;
  } else {
    // 발생/검거 보고서 구조
    reportText += `3. 신고 내용 : ${report.description}\n`;
    
    // 화재 시 현장 상황 추가 (사용자 요청 6번: 현장 상황 항목 추가)
    if (isFire && report.siteSituation) {
      reportText += `  - 현장 상황 : ${report.siteSituation}\n`;
    }

    reportText += `4. 관련자 인적사항 \n`;
    reportText += `  1) 신고자 : ${report.involvedReporter || '불상'}\n`;
    reportText += `  2) 피의자 : ${formatPerson(report.suspect, '불상')}\n`;
    reportText += `  3) 피해자 : ${formatPerson(report.victim, '불상')}\n`;
    
    reportText += `5. 조치사항 : ${report.actionsTaken}\n`;

    if (isFire) {
      reportText += `6. 피해 상황\n  - 인피 : ${report.fireHumanDamage || '없음'}\n  - 물피 : ${report.firePropertyDamage || '없음'}`;
    } else {
      const damageLabel = isDomesticViolence ? '피해자 보호조치' : '피해 상황';
      reportText += `6. ${damageLabel} : ${report.damageSituation}`;
    }
  }

  reportText += `\n\n(보고자 : ${report.reporterTitle} ${report.reporterName})`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportText);
    alert('보고서가 클립보드에 복사되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-dark/95 flex flex-col p-6 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">생성된 보고서</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="flex-1 bg-[#1b1f27] rounded-xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap border border-gray-800 overflow-y-auto">
        {reportText}
      </div>

      <div className="mt-6 flex gap-3">
        <button 
          onClick={copyToClipboard}
          className="flex-1 bg-primary h-12 rounded-lg font-bold flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">content_copy</span>
          복사하기
        </button>
        <button 
          onClick={onClose}
          className="flex-1 bg-gray-700 h-12 rounded-lg font-bold"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;
