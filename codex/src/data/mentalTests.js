export const RESULT_LABELS = {
  Ok: '良好',
  Normal: '平均',
  Caution: '注意',
  Warning: '要注意',
  Danger: '危険',
}

export const BURNOUT_OPTIONS = [
  { value: 1, label: 'ない' },
  { value: 2, label: 'まれにある' },
  { value: 3, label: '時々ある' },
  { value: 4, label: 'しばしばある' },
  { value: 5, label: 'いつもある' },
]

export const BOREOUT_OPTIONS = [
  { value: 0, label: 'いいえ' },
  { value: 1, label: 'はい' },
]

export const burnoutQuestions = [
  { text: 'こんな、仕事もうやめたいと思うことがある。', category: 'emotionalExhaustion' },
  { text: 'われを忘れるほど仕事に熱中することがある。', category: 'personalAccomplishment' },
  { text: 'こまごまと気くばりをすることが面倒に感じることがある。', category: 'depersonalization' },
  { text: 'この仕事は私の性分に合っていると思うことがある。', category: 'personalAccomplishment' },
  { text: '同僚や患者の顔を見るのもいやになることがある。', category: 'depersonalization' },
  { text: '自分の仕事がつまらなく思えてしかたのないことがある。', category: 'depersonalization' },
  { text: '1日の仕事が終わると「やっと終わった」と感じることがある。', category: 'emotionalExhaustion' },
  { text: '出勤前、職場に出るのが嫌になって、家にいたいと思うことがある。', category: 'emotionalExhaustion' },
  { text: '仕事を終えて、今日は気持ちのよい日だったと思うことがある。', category: 'personalAccomplishment' },
  { text: '同僚や患者と、何も話したくなくなるようなことがある。', category: 'depersonalization' },
  { text: '仕事の結果はどうでもよいと思うことがある。', category: 'depersonalization' },
  { text: '仕事のために心にゆとりがなくなったと感じることがある。', category: 'emotionalExhaustion' },
  { text: 'いまの仕事に心から喜びを感じることがある。', category: 'personalAccomplishment' },
  { text: 'いまの仕事の結果はたいしたことはないと思うことがある。', category: 'depersonalization' },
  { text: '仕事が楽しくて、知らないうちに時間が過ぎることがある。', category: 'personalAccomplishment' },
  { text: '身体も気持ちも疲れ果てたと思うことがある。', category: 'emotionalExhaustion' },
  { text: 'われながら、仕事をうまくやり終えたと思うことがある。', category: 'personalAccomplishment' },
]

export const boreoutQuestions = [
  '仕事中に内職をする。',
  '仕事が暇すぎると感じる場面がある。',
  '時には、実際には忙しそうに仕事をしているふりをする。',
  '上司に話しかけられた時、必ず「忙しい」と答える。',
  'どちらかと言えば今の仕事に満足だ。',
  '仕事に意義を見いだせない。',
  'その場にいればもっと楽に仕事を終えられると感じる。',
  '本来のほかのことをしたいのだが、収入が減るからと理由をつけてやらない。',
  '仕事中に内職のメールを見る。',
  '仕事にあまりやりがいがない。',
]

export const burnoutResultDefinitions = [
  {
    key: 'emotionalExhaustion',
    title: '情緒的消耗感',
    guide:
      '仕事に取り組んで消耗した感覚。ここが高い場合は、休息の確保と業務負荷の調整を優先してください。',
    evaluator: (score) => {
      if (score < 16) return 'Ok'
      if (score < 19) return 'Normal'
      if (score < 21) return 'Caution'
      if (score < 24) return 'Warning'
      return 'Danger'
    },
  },
  {
    key: 'depersonalization',
    title: '脱人格化',
    guide:
      '人に対する距離感が極端になる傾向。高い場合は、業務の振り返りや相談の機会を増やしてください。',
    evaluator: (score) => {
      if (score < 12) return 'Ok'
      if (score < 15) return 'Normal'
      if (score < 18) return 'Caution'
      if (score < 21) return 'Warning'
      return 'Danger'
    },
  },
  {
    key: 'personalAccomplishment',
    title: '個人的達成感',
    guide:
      '仕事の達成実感を示す指標。低いほど負荷が高い状態です。評価だけでなく、達成を言語化して可視化することが有効です。',
    evaluator: (score) => {
      if (score < 10) return 'Danger'
      if (score < 13) return 'Warning'
      if (score < 16) return 'Caution'
      if (score < 18) return 'Warning'
      return 'Ok'
    },
  },
]

export function createBurnoutInitialAnswers() {
  return burnoutQuestions.reduce((acc, _, index) => {
    acc[index] = BURNOUT_OPTIONS[0].value
    return acc
  }, {})
}

export function createBoreoutInitialAnswers() {
  return boreoutQuestions.reduce((acc, _, index) => {
    acc[index] = BOREOUT_OPTIONS[0].value
    return acc
  }, {})
}
