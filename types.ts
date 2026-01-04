
export enum IncidentType {
  MURDER = '살인',
  ROBBERY = '강도',
  THEFT = '절도',
  ASSAULT = '(특수)폭행',
  INJURY = '(특수)상해',
  DOMESTIC_VIOLENCE = '가정폭력',
  VOICE_PHISHING = '보이스피싱',
  TRAFFIC_FATALITY = '교통사망사고',
  FIRE = '화재',
  RAPE = '강간',
  INDECENT_ASSAULT = '강제추행',
  OBSTRUCTION = '공무집행방해',
  GAMBLING = '도박'
}

export enum ReportType {
  OCCURRENCE = '발생',
  APPREHENSION = '검거',
  ENFORCEMENT = '단속'
}

export interface PersonInfo {
  name: string;
  age: string;
  gender: string;
}

export interface ReportData {
  incidentType: IncidentType;
  reportType: ReportType;
  dateTime: string;
  eupMyeon: string;
  detailAddress: string;
  description: string;
  apprehensionProcess?: string; // 단속 시 추가
  siteSituation?: string; // 화재 시 추가
  involvedReporter: string;
  suspect: PersonInfo;
  victim: PersonInfo;
  actionsTaken: string;
  damageSituation: string;
  fireHumanDamage?: string; // 화재 시 추가
  firePropertyDamage?: string; // 화재 시 추가
  reporterName: string;
  reporterTitle: string;
}
