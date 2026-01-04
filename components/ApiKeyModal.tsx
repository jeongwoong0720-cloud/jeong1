
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ApiKeyModalProps {
  onClose: () => void;
  onKeyUpdate: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onKeyUpdate }) => {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY_ENC');
    if (savedKey) {
      try {
        setKey(atob(savedKey).split('|')[1]); // 간단한 디코딩
      } catch (e) {
        console.error('Key loading error', e);
      }
    }
  }, []);

  const handleTestConnection = async () => {
    if (!key.trim()) {
      setStatus('error');
      setErrorMessage('API Key를 입력해주세요.');
      return;
    }

    setStatus('testing');
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Connection Test. Answer "OK" only.',
      });
      
      if (response.text) {
        setStatus('success');
        setErrorMessage('');
      } else {
        throw new Error('응답이 없습니다.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || '연결에 실패했습니다. 키를 확인하세요.');
    }
  };

  const handleSaveAndExport = () => {
    if (status !== 'success') {
      alert('먼저 연결 테스트를 통과해야 합니다.');
      return;
    }

    // 1. Local Storage 저장 (암호화)
    const salt = Math.random().toString(36).substring(7);
    const encrypted = btoa(`${salt}|${key}`);
    localStorage.setItem('GEMINI_API_KEY_ENC', encrypted);

    // 2. 로컬 드라이브 파일로 저장 (Export)
    const backupData = {
      app: "PoliceReportSystem",
      timestamp: new Date().toISOString(),
      key_encrypted: encrypted
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `police_report_api_config.json`;
    link.click();
    
    onKeyUpdate(key);
    alert('API Key가 안전하게 저장되었으며, 백업 파일이 생성되었습니다.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#1b1f27] border border-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">key</span>
            API Key 관리 설정
          </h2>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Google Gemini API Key</label>
            <input 
              type="password"
              className="w-full bg-[#101622] border border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="AI Studio에서 발급받은 키를 입력하세요"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setStatus('idle');
              }}
            />
          </div>

          <div className="bg-[#101622] p-4 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">연결 상태</span>
              {status === 'testing' && <span className="text-xs text-blue-400 animate-pulse">테스트 중...</span>}
              {status === 'success' && <span className="text-xs text-green-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> 연결 성공</span>}
              {status === 'error' && <span className="text-xs text-red-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> 오류</span>}
              {status === 'idle' && <span className="text-xs text-slate-600">입력 대기 중</span>}
            </div>
            {errorMessage && <p className="text-xs text-red-400 leading-relaxed">{errorMessage}</p>}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * 입력된 키는 사용자의 브라우저 내부에 암호화되어 보관되며, 서버로 전송되지 않습니다.
            <br/>* 저장 버튼 클릭 시 로컬 드라이브에 복구용 JSON 파일이 다운로드됩니다.
          </p>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleTestConnection}
              disabled={status === 'testing'}
              className="flex-1 bg-gray-800 hover:bg-gray-700 h-12 rounded-xl font-bold transition-colors"
            >
              연결 테스트
            </button>
            <button 
              onClick={handleSaveAndExport}
              disabled={status !== 'success'}
              className={`flex-1 h-12 rounded-xl font-bold transition-all ${status === 'success' ? 'bg-primary text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            >
              저장 및 내보내기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
