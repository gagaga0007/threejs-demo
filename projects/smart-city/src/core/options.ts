export enum AlarmTypeEnum {
  FIRE = 'fire',
  SAFE = 'safe',
  ELECTRIC = 'electric'
}

export const alarmTypeOptions = [
  { key: '火警', value: AlarmTypeEnum.FIRE },
  { key: '治安', value: AlarmTypeEnum.SAFE },
  { key: '供电', value: AlarmTypeEnum.ELECTRIC }
]
