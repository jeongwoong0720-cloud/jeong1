
import React, { useState, useEffect } from 'react';
import { IncidentType, ReportType, ReportData, PersonInfo } from './types';
import IncidentTypeButton from './components/IncidentTypeButton';
import ReportDisplay from './components/ReportDisplay';
import ApiKeyModal from './components/ApiKeyModal';

const EUP_MYEON_LIST = [
  '영암읍', '삼호읍', '덕진면', '금정면', '신북면', 
  '시종면', '도포면', '군서면', '서호면', '학산면', '미암면'
];

const App: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>(ReportType.OCCURRENCE);
  const [incidentType, setIncidentType] = useState<IncidentType>(IncidentType.ASSAULT);
  const [dateTime, setDateTime] = useState<string>('2026-01-04T12:10');
  
  const [eupMyeon, setEupMyeon] = useState<string>('삼호읍');
  const [detailAddress, setDetailAddress] = useState<string>('');
  
  const [description, setDescription] = useState<string>('');
  const [apprehensionProcess, setApprehensionProcess] = useState<string>('');
  const [siteSituation, setSiteSituation] = useState<string>('');
  
  const [involvedReporter, setInvolvedReporter] = useState<string>('');
  
  const [suspect, setSuspect] = useState<PersonInfo>({ name: '홍길동', age: '30', gender: '남' });
  const [victim, setVictim] = useState<PersonInfo>({ name: '황진이', age: '26', gender: '여' });
  
  const [actionsTaken, setActionsTaken] = useState<string>('(예) 상황관리관 및 초동대응팀 현장 출동');
  const [damageSituation, setDamageSituation] = useState<string>('');
  const [fireHumanDamage, setFireHumanDamage] = useState<string>('');
  const [firePropertyDamage, setFirePropertyDamage] = useState<string>('');
  
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterTitle, setReporterTitle] = useState<string>('상황관리관');

  const [showReport, setShowReport] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);

  // 초기 로드 시 키 확인
  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY_ENC');
    if (!savedKey) {
      // 키가 없으면 처음 한 번은 안내 팝업을 띄울 수 있습니다.
    }
  }, []);

  const handleSubmit = () => {
    const report: ReportData = {
      incidentType,
      reportType,
      dateTime,
      eupMyeon,
      detailAddress,
      description,
      apprehensionProcess,
      siteSituation,
      involvedReporter,
      suspect,
      victim,
      actionsTaken,
      damageSituation,
      fireHumanDamage,
      firePropertyDamage,
      reporterName,
      reporterTitle
    };
    setGeneratedReport(report);
    setShowReport(true);
  };

  const handlePersonChange = (type: 'suspect' | 'victim', field: keyof PersonInfo, value: string) => {
    if (type === 'suspect') {
      setSuspect(prev => ({ ...prev, [field]: value }));
    } else {
      setVictim(prev => ({ ...prev, [field]: value }));
    }
  };

  const isEnforcement = reportType === ReportType.ENFORCEMENT;
  const isDomesticViolence = incidentType === IncidentType.DOMESTIC_VIOLENCE;
  const isFire = incidentType === IncidentType.FIRE;

  const dateTimeLabel = reportType === ReportType.OCCURRENCE ? '발생 일시' :
                        reportType === ReportType.APPREHENSION ? '검거 일시' : '단속 일시';

  const descriptionLabel = isEnforcement ? '위반 사항' : '신고 내용';
  const damageLabel = isDomesticViolence ? '피해자 보호조치' : '피해 상황';

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32">
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">사건 발생 보고 작성</h2>
        <button 
          onClick={() => setShowKeyModal(true)}
          className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="flex flex-col max-w-2xl mx-auto w-full">
        {/* Report Type Selection */}
        <div className="flex flex-col px-4 pt-6">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3">보고 유형</h3>
          <div className="flex gap-4">
            {Object.values(ReportType).map((type) => (
              <button 
                key={type}
                onClick={() => setReportType(type)}
                className={`flex-1 h-11 rounded-lg font-bold transition-all border ${reportType === type ? 'bg-primary border-primary text-white' : 'bg-[#1b1f27] border-gray-800 text-slate-400'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Incident Type Section */}
        <div className="flex flex-col">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-6">사건 유형</h3>
          <div className="flex gap-3 px-4 py-1 flex-wrap">
            {Object.values(IncidentType).map((type) => (
              <IncidentTypeButton 
                key={type} 
                type={type} 
                isSelected={incidentType === type} 
                onClick={setIncidentType} 
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-800 my-6 mx-4"></div>

        {/* Date/Time & Location Section */}
        <div className="flex flex-col">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2">일시 및 장소</h3>
          <div className="flex flex-col gap-4 px-4 py-3">
            <label className="flex flex-col w-full">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal pb-2">{dateTimeLabel}</span>
              <input 
                className="form-input w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] h-14 p-[15px] text-base font-normal" 
                type="datetime-local" 
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col w-full">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal pb-2">영암군 읍/면</span>
                <select 
                  className="form-select w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] h-14 p-[15px] text-base font-normal"
                  value={eupMyeon}
                  onChange={(e) => setEupMyeon(e.target.value)}
                >
                  {EUP_MYEON_LIST.map(em => <option key={em} value={em}>{em}</option>)}
                </select>
              </label>

              <label className="flex flex-col w-full">
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal pb-2">상세 주소 (추가 기재)</span>
                <input 
                  className="form-input w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] h-14 p-[15px] text-base font-normal" 
                  type="text" 
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="추가 주소를 입력하세요"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-800 my-6 mx-4"></div>

        {/* Details Section */}
        <div className="flex flex-col">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2">{isEnforcement ? '단속 정보' : '사건 정보'}</h3>
          <div className="px-4 py-2 flex flex-col gap-4">
            
            <label className="flex flex-col w-full">
              <span className="text-sm font-medium text-slate-500 mb-2">{descriptionLabel}</span>
              <textarea 
                className="form-textarea w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] min-h-[100px] p-4 text-base font-normal leading-relaxed resize-none" 
                placeholder={`${descriptionLabel}을 입력해 주세요.`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            {isEnforcement && (
              <label className="flex flex-col w-full">
                <span className="text-sm font-medium text-slate-500 mb-2">적발 경위</span>
                <textarea 
                  className="form-textarea w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] min-h-[80px] p-4 text-base font-normal leading-relaxed resize-none" 
                  placeholder="적발 경위를 입력해 주세요."
                  value={apprehensionProcess}
                  onChange={(e) => setApprehensionProcess(e.target.value)}
                />
              </label>
            )}

            {isFire && (
              <label className="flex flex-col w-full">
                <span className="text-sm font-medium text-slate-500 mb-2">현장 상황</span>
                <textarea 
                  className="form-textarea w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] min-h-[80px] p-4 text-base font-normal leading-relaxed resize-none" 
                  placeholder="현장 상황을 입력해 주세요."
                  value={siteSituation}
                  onChange={(e) => setSiteSituation(e.target.value)}
                />
              </label>
            )}

            <div className="h-px bg-gray-800 my-2"></div>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-slate-500 mb-2">신고자</span>
              <input 
                className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                value={involvedReporter}
                onChange={(e) => setInvolvedReporter(e.target.value)}
                placeholder="신고자 성명 혹은 정보"
              />
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-500">피의자 인적사항</span>
              <div className="grid grid-cols-3 gap-3">
                <input 
                  placeholder="이름"
                  className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                  value={suspect.name}
                  onChange={(e) => handlePersonChange('suspect', 'name', e.target.value)}
                />
                <input 
                  placeholder="나이"
                  type="number"
                  className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                  value={suspect.age}
                  onChange={(e) => handlePersonChange('suspect', 'age', e.target.value)}
                />
                <select 
                  className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                  value={suspect.gender}
                  onChange={(e) => handlePersonChange('suspect', 'gender', e.target.value)}
                >
                  <option value="남">남</option>
                  <option value="여">여</option>
                  <option value="불상">불상</option>
                </select>
              </div>
            </div>

            {!isEnforcement && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">피해자 인적사항</span>
                <div className="grid grid-cols-3 gap-3">
                  <input 
                    placeholder="이름"
                    className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                    value={victim.name}
                    onChange={(e) => handlePersonChange('victim', 'name', e.target.value)}
                  />
                  <input 
                    placeholder="나이"
                    type="number"
                    className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                    value={victim.age}
                    onChange={(e) => handlePersonChange('victim', 'age', e.target.value)}
                  />
                  <select 
                    className="bg-[#1b1f27] border border-gray-800 rounded-xl h-12 px-4 text-sm"
                    value={victim.gender}
                    onChange={(e) => handlePersonChange('victim', 'gender', e.target.value)}
                  >
                    <option value="남">남</option>
                    <option value="여">여</option>
                    <option value="불상">불상</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="h-px bg-gray-800 my-2"></div>

            {!isEnforcement && (
              <>
                {isFire ? (
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col">
                      <span className="text-sm font-medium text-slate-500 mb-2">피해 상황 (인피)</span>
                      <textarea 
                        className="bg-[#1b1f27] border border-gray-800 rounded-xl p-4 text-sm resize-none min-h-[60px]"
                        value={fireHumanDamage}
                        onChange={(e) => setFireHumanDamage(e.target.value)}
                        placeholder="인명 피해 내용을 입력하세요"
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="text-sm font-medium text-slate-500 mb-2">피해 상황 (물피)</span>
                      <textarea 
                        className="bg-[#1b1f27] border border-gray-800 rounded-xl p-4 text-sm resize-none min-h-[60px]"
                        value={firePropertyDamage}
                        onChange={(e) => setFirePropertyDamage(e.target.value)}
                        placeholder="재산 피해 내용을 입력하세요"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-slate-500 mb-2">{damageLabel}</span>
                    <textarea 
                      className="bg-[#1b1f27] border border-gray-800 rounded-xl p-4 text-sm resize-none min-h-[80px]"
                      value={damageSituation}
                      onChange={(e) => setDamageSituation(e.target.value)}
                      placeholder={`${damageLabel} 내용을 입력하세요`}
                    />
                  </label>
                )}
              </>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <label className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">보고자 직함</span>
                <input 
                  className="bg-[#1b1f27] border-gray-800 rounded-lg p-3 text-sm"
                  value={reporterTitle}
                  onChange={(e) => setReporterTitle(e.target.value)}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-xs text-slate-500 mb-1">보고자 성명</span>
                <input 
                  className="bg-[#1b1f27] border-gray-800 rounded-lg p-3 text-sm"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="성명"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 조치사항 Section */}
        <div className="h-px bg-gray-200 dark:bg-gray-800 my-6 mx-4"></div>
        <div className="flex flex-col">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2">조치사항</h3>
          <div className="px-4 py-3">
            <textarea 
              className="form-textarea w-full rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-gray-300 dark:border-[#3b4354] bg-white dark:bg-[#1b1f27] min-h-[100px] p-4 text-base font-normal leading-relaxed resize-none" 
              placeholder="조치사항을 입력해 주세요."
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-background-light dark:bg-[#111318] border-t border-gray-200 dark:border-[#282e39] p-4 z-40 safe-area-pb">
        <button 
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold h-12 rounded-lg shadow-lg shadow-blue-900/20 transition-all max-w-2xl mx-auto"
        >
          <span className="material-symbols-outlined">description</span>
          보고서 생성
        </button>
      </div>

      {/* Modals */}
      {showReport && generatedReport && (
        <ReportDisplay 
          report={generatedReport} 
          onClose={() => setShowReport(false)} 
        />
      )}
      {showKeyModal && (
        <ApiKeyModal 
          onClose={() => setShowKeyModal(false)}
          onKeyUpdate={(newKey) => {
            // 전역 상태가 필요하다면 여기서 처리
          }}
        />
      )}
    </div>
  );
};

export default App;
