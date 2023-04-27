export enum AlarmTypeEnum {
  FIRE = 'fire',
  SAFE = 'safe',
  ELECTRIC = 'electric'
}

export const alarmTypeOptions = [
  { key: '火警', value: AlarmTypeEnum.FIRE, texture: '../../../textures/tag/fire.png' },
  { key: '治安', value: AlarmTypeEnum.SAFE, texture: '../../../textures/tag/safe.png' },
  { key: '供电', value: AlarmTypeEnum.ELECTRIC, texture: '../../../textures/tag/electric.png' }
]
