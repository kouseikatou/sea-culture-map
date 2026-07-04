// 東南アジア11か国の文化・観光データ（単一のソース）
// 世界遺産・首都・宗教・通貨は公知の安定した事実に基づく。
// 人口は概数（約）で表記。座標は [緯度, 経度]。

export type HeritageKind = 'cultural' | 'natural' | 'mixed'

export type HeritageSite = {
  name: string
  kind: HeritageKind
  coords: [number, number] // [lat, lng]
  inscribedYear: number
  note: string
}

export type Country = {
  id: string
  name: string
  nameEn: string
  capital: string
  coords: [number, number] // 国ピンの位置（首都）
  population: string
  languages: string[]
  religion: string
  currency: string
  summary: string
  culture: string
  highlights: string[]
  heritageSites: HeritageSite[]
}

export const countries: Country[] = [
  {
    id: 'thailand',
    name: 'タイ',
    nameEn: 'Thailand',
    capital: 'バンコク',
    coords: [13.7563, 100.5018],
    population: '約7,100万人',
    languages: ['タイ語'],
    religion: '仏教（上座部）',
    currency: 'バーツ (THB)',
    summary: '黄金の寺院と微笑みの国。上座部仏教が暮らしの中心。',
    culture:
      '一度も西欧列強に植民地化されなかった歴史をもち、王室と上座部仏教が今も社会の柱となっている。全国に無数の寺院（ワット）が建ち、托鉢や出家が日常に溶け込む。\n\nアユタヤ朝・スコータイ朝の遺跡群が往時の栄華を伝え、トムヤムクンやガパオに代表される食文化、ソンクラーン（水かけ祭り）など季節の行事も豊か。北部・東北（イサーン）・南部で言葉や料理の色合いが大きく異なる。',
    highlights: ['バンコクの王宮とワット・ポー', 'アユタヤ遺跡めぐり', '北部チェンマイの寺院と山岳文化', 'ソンクラーン（水かけ祭り）'],
    heritageSites: [
      { name: '古都アユタヤ', kind: 'cultural', coords: [14.3532, 100.5689], inscribedYear: 1991, note: '14〜18世紀に栄えたアユタヤ朝の都。煉瓦の仏塔と首のない仏像群が残る。' },
      { name: 'スコータイと周辺の古代都市群', kind: 'cultural', coords: [17.0206, 99.7031], inscribedYear: 1991, note: 'タイ族最初の王朝スコータイ朝の都。優美なスコータイ様式の仏像で知られる。' },
      { name: 'トゥンヤイ‐ファイ・カ・ケン野生生物保護区', kind: 'natural', coords: [15.3, 98.9], inscribedYear: 1991, note: '東南アジア大陸部で最大級の原生林。多様な大型哺乳類が生息する。' },
      { name: 'バンチエンの古代遺跡', kind: 'cultural', coords: [17.4, 103.24], inscribedYear: 1992, note: '東南アジアの先史時代を代表する彩文土器と金属器の遺跡。' },
      { name: 'ドンパヤーイェン‐カオヤイ森林群', kind: 'natural', coords: [14.44, 101.37], inscribedYear: 2005, note: 'カオヤイ国立公園を含む山岳森林。ゾウやテナガザルが暮らす。' },
      { name: 'ケーンクラチャン森林群', kind: 'natural', coords: [12.9, 99.4], inscribedYear: 2021, note: 'ミャンマー国境沿いの広大な森林。生物多様性のホットスポット。' },
    ],
  },
  {
    id: 'vietnam',
    name: 'ベトナム',
    nameEn: 'Vietnam',
    capital: 'ハノイ',
    coords: [21.0278, 105.8342],
    population: '約9,800万人',
    languages: ['ベトナム語'],
    religion: '仏教・民間信仰・カトリック',
    currency: 'ドン (VND)',
    summary: '南北に長い国土。中国とフランスの影響が独自に融合。',
    culture:
      '中国文化圏に長くありながら、19〜20世紀のフランス統治で洋風建築やコーヒー文化が根づいた独特の混交文化をもつ。祖先崇拝が篤く、家庭に祭壇を置く習慣が広い。\n\nフォーやバインミーに代表される食、アオザイの装い、旧正月テトの行事など、北（ハノイ）と南（ホーチミン）で気質も味つけも異なる。ハロン湾の奇岩やフエの王宮が代表的な景観。',
    highlights: ['ハロン湾のクルーズ', 'ホイアンの灯り', 'フエの王宮（阮朝）', 'ハノイ旧市街とフランス建築'],
    heritageSites: [
      { name: 'フエの建造物群', kind: 'cultural', coords: [16.4637, 107.5909], inscribedYear: 1993, note: 'ベトナム最後の王朝・阮朝の都。城塞と皇帝陵が並ぶ。' },
      { name: 'ハロン湾', kind: 'natural', coords: [20.9101, 107.1839], inscribedYear: 1994, note: '無数の石灰岩の島が海に林立する景勝。ベトナムを象徴する風景。' },
      { name: 'ホイアンの古い町並み', kind: 'cultural', coords: [15.8801, 108.338], inscribedYear: 1999, note: '交易で栄えた港町。日本橋や中国風の町家が残る。' },
      { name: 'ミーソン聖域', kind: 'cultural', coords: [15.7636, 108.124], inscribedYear: 1999, note: 'チャンパ王国のヒンドゥー教寺院群の遺跡。' },
      { name: 'フォンニャ‐ケバン国立公園', kind: 'natural', coords: [17.5, 106.2833], inscribedYear: 2003, note: '世界最大級のソンドン洞窟を擁するカルスト地帯。' },
      { name: 'ハノイのタンロン皇城中心区域', kind: 'cultural', coords: [21.0353, 105.8402], inscribedYear: 2010, note: '千年にわたり政治の中心だった皇城の遺構。' },
      { name: 'チャンアン複合景観', kind: 'mixed', coords: [20.25, 105.9], inscribedYear: 2014, note: '奇岩と水田・古刹が織りなす自然と文化の複合遺産。' },
    ],
  },
  {
    id: 'cambodia',
    name: 'カンボジア',
    nameEn: 'Cambodia',
    capital: 'プノンペン',
    coords: [11.5564, 104.9282],
    population: '約1,700万人',
    languages: ['クメール語'],
    religion: '仏教（上座部）',
    currency: 'リエル (KHR)',
    summary: 'アンコール王朝の遺産を受け継ぐクメール文化の国。',
    culture:
      '9〜15世紀に東南アジアを広く支配したクメール（アンコール）王朝の後裔。国旗にアンコール・ワットを掲げるほど、その遺産は国民的な誇りとなっている。\n\n上座部仏教が主流だが、寺院にはヒンドゥーの神々の名残も色濃い。20世紀後半の内戦を経て復興を続けており、アプサラ舞踊や絹織物など伝統文化の再生も進む。',
    highlights: ['アンコール・ワットの日の出', 'アンコール・トムとバイヨン', 'タ・プロームの巨木', 'トンレサップ湖の水上生活'],
    heritageSites: [
      { name: 'アンコール', kind: 'cultural', coords: [13.4125, 103.867], inscribedYear: 1992, note: 'アンコール・ワットやバイヨンを含む巨大な寺院都市遺跡群。' },
      { name: 'プレア・ヴィヒア寺院', kind: 'cultural', coords: [14.3931, 104.6803], inscribedYear: 2008, note: '断崖の上に築かれたヒンドゥー教寺院。タイ国境に位置する。' },
      { name: 'サンボー・プレイ・クック', kind: 'cultural', coords: [12.87, 105.05], inscribedYear: 2017, note: 'アンコールに先立つ真臘（チェンラ）期の煉瓦寺院群。' },
      { name: 'コー・ケー', kind: 'cultural', coords: [13.94, 104.68], inscribedYear: 2023, note: '10世紀に一時的に都が置かれた、ピラミッド状寺院で名高い遺跡。' },
    ],
  },
  {
    id: 'laos',
    name: 'ラオス',
    nameEn: 'Laos',
    capital: 'ヴィエンチャン',
    coords: [17.9757, 102.6331],
    population: '約760万人',
    languages: ['ラオ語'],
    religion: '仏教（上座部）',
    currency: 'キープ (LAK)',
    summary: '東南アジア唯一の内陸国。ゆるやかに時が流れる仏教国。',
    culture:
      'メコン川に沿って広がる内陸国で、多くの山岳少数民族が暮らす。上座部仏教が篤く、早朝の托鉢はルアンパバーンの名物風景となっている。\n\nかつてのランサーン王国の文化を受け継ぎ、金色の寺院と木造家屋が調和した町並みが残る。フランス統治の名残でバゲットやカフェ文化も根づく。もち米（カオニャオ）を主食とし、素朴で穏やかな暮らしが息づく。',
    highlights: ['ルアンパバーンの托鉢', 'ワット・シェントーン', 'メコン川の夕景', 'ジャール平原の石壺'],
    heritageSites: [
      { name: 'ルアンパバーンの町', kind: 'cultural', coords: [19.8856, 102.1347], inscribedYear: 1995, note: '寺院とフランス植民地建築が調和した古都。町全体が遺産。' },
      { name: 'チャンパサック県 ワット・プーと関連古代遺産群', kind: 'cultural', coords: [14.848, 105.822], inscribedYear: 2001, note: 'アンコールに先立つクメール様式の山岳ヒンドゥー寺院。' },
      { name: 'ジャール平原の巨大石壺群', kind: 'cultural', coords: [19.43, 103.15], inscribedYear: 2019, note: '用途に謎が残る、鉄器時代の巨大な石壺が点在する平原。' },
    ],
  },
  {
    id: 'myanmar',
    name: 'ミャンマー',
    nameEn: 'Myanmar',
    capital: 'ネピドー',
    coords: [19.7633, 96.0785],
    population: '約5,400万人',
    languages: ['ビルマ語'],
    religion: '仏教（上座部）',
    currency: 'チャット (MMK)',
    summary: '無数の仏塔が林立する、敬虔な上座部仏教の国。',
    culture:
      '多数のビルマ族と多様な少数民族からなる国で、上座部仏教が生活と精神の基盤。全土に金色のパゴダ（仏塔）が建ち、ヤンゴンのシュエダゴン・パゴダは信仰の象徴となっている。\n\nバガンの平原に無数の仏塔が広がる光景は世界屈指の遺跡景観。頬に塗るタナカ、腰布ロンジー、発酵茶葉のサラダなど独特の生活文化が今も色濃く残る。',
    highlights: ['バガンの仏塔群と気球', 'シュエダゴン・パゴダ', 'インレー湖の水上集落', 'マンダレーの旧王宮'],
    heritageSites: [
      { name: 'ピュー古代都市群', kind: 'cultural', coords: [18.81, 95.29], inscribedYear: 2014, note: 'ミャンマー初の世界遺産。紀元前後に栄えたピュー人の城郭都市。' },
      { name: 'バガン', kind: 'cultural', coords: [21.1717, 94.8585], inscribedYear: 2019, note: '平原に数千の仏塔・寺院が林立する、仏教建築の一大遺跡。' },
    ],
  },
  {
    id: 'malaysia',
    name: 'マレーシア',
    nameEn: 'Malaysia',
    capital: 'クアラルンプール',
    coords: [3.139, 101.6869],
    population: '約3,400万人',
    languages: ['マレー語'],
    religion: 'イスラム教（連邦の宗教）',
    currency: 'リンギット (MYR)',
    summary: 'マレー・中華・インドが共生する多民族国家。',
    culture:
      'マレー系・中華系・インド系が暮らす多民族・多宗教社会で、モスク・寺院・教会が同じ街に並ぶ。公用語はマレー語だが英語も広く通じる。\n\n半島部とボルネオ島（サバ・サラワク）に国土が分かれ、後者には熱帯雨林と先住民文化が広がる。ナシレマやラクサなど各民族の料理が混ざり合い、多彩な祝祭が一年を彩る。近代的な高層都市と豊かな自然が同居する。',
    highlights: ['ペトロナスツインタワー', 'マラッカの歴史地区', 'ジョージタウンの街歩き', 'ボルネオ島キナバル山'],
    heritageSites: [
      { name: 'キナバル公園', kind: 'natural', coords: [6.075, 116.558], inscribedYear: 2000, note: '東南アジア最高峰キナバル山を擁し、固有の動植物が豊富。' },
      { name: 'グヌン・ムル国立公園', kind: 'natural', coords: [4.05, 114.9], inscribedYear: 2000, note: '巨大な洞窟群と尖峰（ピナクルズ）で知られるカルスト地帯。' },
      { name: 'マラッカとジョージタウン（海峡都市）', kind: 'cultural', coords: [2.1896, 102.2501], inscribedYear: 2008, note: 'マラッカ海峡交易で栄えた、多文化が融合する歴史都市。' },
      { name: 'レンゴン渓谷の考古遺産', kind: 'cultural', coords: [5.11, 100.97], inscribedYear: 2012, note: '「ペラ人」の人骨など、旧石器時代からの人類活動を伝える遺跡。' },
    ],
  },
  {
    id: 'singapore',
    name: 'シンガポール',
    nameEn: 'Singapore',
    capital: 'シンガポール',
    coords: [1.3521, 103.8198],
    population: '約590万人',
    languages: ['英語', 'マレー語', '華語', 'タミル語'],
    religion: '多宗教（仏教・イスラム・キリスト・道教・ヒンドゥー）',
    currency: 'シンガポールドル (SGD)',
    summary: '多文化が凝縮した都市国家。緑と超高層が共存。',
    culture:
      '東京23区ほどの面積に多民族が暮らす都市国家。中華系を中心にマレー系・インド系が共生し、4つの公用語が並立する。チャイナタウン・リトルインディア・アラブストリートが徒歩圏に共存する。\n\n「ガーデン・シティ」を掲げた緑化政策で、超高層ビルと熱帯の緑が調和する。ホーカーセンターの多国籍な屋台料理は暮らしの中心で、ユネスコ無形文化遺産にも登録されている。',
    highlights: ['マリーナベイ・サンズ', 'ガーデンズ・バイ・ザ・ベイ', 'ホーカーセンターの食べ歩き', '多文化の街区めぐり'],
    heritageSites: [
      { name: 'シンガポール植物園', kind: 'cultural', coords: [1.3138, 103.8159], inscribedYear: 2015, note: '19世紀開園の熱帯植物園。ランの育種で世界的に名高い。' },
    ],
  },
  {
    id: 'indonesia',
    name: 'インドネシア',
    nameEn: 'Indonesia',
    capital: 'ジャカルタ',
    coords: [-6.2088, 106.8456],
    population: '約2億7,700万人',
    languages: ['インドネシア語'],
    religion: 'イスラム教（世界最大のムスリム人口）',
    currency: 'ルピア (IDR)',
    summary: '1万7千余の島からなる世界最大の島嶼国家。',
    culture:
      '赤道をまたいで1万7千を超える島々が連なる、世界最大の群島国家。世界最多のムスリム人口を抱える一方、バリ島にはヒンドゥー文化が色濃く残るなど、島ごとに宗教も言語も大きく異なる。\n\n「多様性の中の統一」を国是に、数百の民族が共存する。バティック（ろうけつ染め）やガムラン音楽、影絵芝居ワヤンなどの伝統芸能が受け継がれ、ボロブドゥールやバリの棚田景観が世界に知られる。',
    highlights: ['ボロブドゥール遺跡の朝', 'バリ島の寺院と棚田', 'コモドドラゴン', 'ジャワの影絵芝居ワヤン'],
    heritageSites: [
      { name: 'ボロブドゥール寺院遺跡群', kind: 'cultural', coords: [-7.6079, 110.2038], inscribedYear: 1991, note: '8〜9世紀に築かれた世界最大級の仏教遺跡。' },
      { name: 'プランバナン寺院遺跡群', kind: 'cultural', coords: [-7.752, 110.4915], inscribedYear: 1991, note: '尖塔が林立する壮麗なヒンドゥー教寺院群。' },
      { name: 'コモド国立公園', kind: 'natural', coords: [-8.55, 119.48], inscribedYear: 1991, note: '世界最大のトカゲ・コモドドラゴンが生息する島々。' },
      { name: 'ウジュン・クロン国立公園', kind: 'natural', coords: [-6.75, 105.33], inscribedYear: 1991, note: '希少なジャワサイが残る低地熱帯雨林。' },
      { name: 'サンギラン初期人類遺跡', kind: 'cultural', coords: [-7.45, 110.83], inscribedYear: 1996, note: 'ジャワ原人の化石が多数出土した人類進化の重要遺跡。' },
      { name: 'ロレンツ国立公園', kind: 'natural', coords: [-4.5, 137.5], inscribedYear: 1999, note: '雪を頂く高山から熱帯海岸まで連なる、東南アジア最大の保護区。' },
      { name: 'スマトラの熱帯雨林遺産', kind: 'natural', coords: [3.0, 98.0], inscribedYear: 2004, note: 'オランウータンやスマトラトラが生息する三つの国立公園。' },
      { name: 'バリの文化的景観（スバック）', kind: 'cultural', coords: [-8.4, 115.15], inscribedYear: 2012, note: '水利組合スバックが支える棚田と水寺院の景観。' },
      { name: 'サワルントのオンビリン炭鉱遺産', kind: 'cultural', coords: [-0.6, 100.77], inscribedYear: 2019, note: 'オランダ統治期に開かれた炭鉱と鉄道の産業遺産。' },
    ],
  },
  {
    id: 'philippines',
    name: 'フィリピン',
    nameEn: 'Philippines',
    capital: 'マニラ',
    coords: [14.5995, 120.9842],
    population: '約1億1,500万人',
    languages: ['フィリピノ語', '英語'],
    religion: 'カトリック（アジア有数のキリスト教国）',
    currency: 'ペソ (PHP)',
    summary: '7千余の島々。アジアで珍しいカトリック文化の国。',
    culture:
      '7千を超える島からなり、約300年に及ぶスペイン統治とその後のアメリカ統治が、言語・宗教・生活に深い刻印を残した。人口の大半がカトリックで、荘厳な祭りフィエスタが各地で開かれる。\n\n英語が広く通じ、家族や共同体の結びつきを重んじる文化が根づく。北部コルディリェーラの棚田や、スペイン風の古都ビガンなど、多様な景観と歴史が共存する。陽気な音楽と歓待の精神で知られる。',
    highlights: ['バナウェの棚田', '古都ビガンの石畳', 'ボラカイ島のビーチ', 'マニラのスペイン建築（イントラムロス）'],
    heritageSites: [
      { name: 'フィリピンのバロック様式教会群', kind: 'cultural', coords: [18.06, 120.52], inscribedYear: 1993, note: 'スペイン統治期に築かれた4つのバロック教会。地震に備えた独特の意匠。' },
      { name: 'トゥバタハ岩礁自然公園', kind: 'natural', coords: [8.85, 119.92], inscribedYear: 1993, note: 'スールー海に浮かぶ、手つかずのサンゴ礁と海洋生物の宝庫。' },
      { name: 'フィリピン・コルディリェーラの棚田群', kind: 'cultural', coords: [16.93, 121.13], inscribedYear: 1995, note: '2千年をかけて山肌に刻まれたイフガオ族の棚田。' },
      { name: '古都ビガン', kind: 'cultural', coords: [17.5747, 120.3869], inscribedYear: 1999, note: 'スペイン期の街割りと石造家屋が残る、アジア随一の植民地都市。' },
      { name: 'プエルト・プリンセサ地底河川国立公園', kind: 'natural', coords: [10.2, 118.92], inscribedYear: 1999, note: '海へ注ぐ長大な地底河川と鍾乳洞の国立公園。' },
      { name: 'ハミギタン山地野生生物保護区', kind: 'natural', coords: [6.72, 126.18], inscribedYear: 2014, note: 'ミンダナオ島の固有種が多く残る山岳保護区。' },
    ],
  },
  {
    id: 'brunei',
    name: 'ブルネイ',
    nameEn: 'Brunei',
    capital: 'バンダルスリブガワン',
    coords: [4.9031, 114.9398],
    population: '約45万人',
    languages: ['マレー語'],
    religion: 'イスラム教（国教）',
    currency: 'ブルネイドル (BND)',
    summary: '石油で栄える、ボルネオ島の豊かなイスラム王国。',
    culture:
      'ボルネオ島北部に位置する小国で、国王（スルタン）が国家元首を務める君主制。豊富な石油・天然ガス資源により、税負担が少なく手厚い社会保障で知られる。\n\nイスラム教を国教とし、荘厳なモスクが街の象徴。マレー・イスラム・王政を柱とする国是のもと、穏やかで保守的な暮らしが営まれる。首都近くには水上集落カンポン・アイールが今も残り、伝統的な暮らしを伝える。',
    highlights: ['スルタン・オマール・アリ・サイフディン・モスク', '水上集落カンポン・アイール', 'ジャメ・アスル・ハサナル・ボルキア・モスク', '熱帯雨林ウル・トゥンブロン国立公園'],
    heritageSites: [],
  },
  {
    id: 'timor-leste',
    name: '東ティモール',
    nameEn: 'Timor-Leste',
    capital: 'ディリ',
    coords: [-8.5569, 125.5603],
    population: '約135万人',
    languages: ['テトゥン語', 'ポルトガル語'],
    religion: 'カトリック',
    currency: '米ドル (USD)',
    summary: '21世紀最初の独立国。カトリックと山の文化。',
    culture:
      'ティモール島の東半分を占め、2002年に独立を果たした21世紀最初の新独立国。長いポルトガル統治の影響でカトリックが広く信仰され、公用語にもポルトガル語が残る。\n\n山がちな地形に多くの言語集団が暮らし、伝統家屋ウマ・ルリックや織物タイスなど固有の文化が息づく。コーヒーの産地としても知られ、独立をめぐる近現代史が国民のアイデンティティに深く刻まれている。',
    highlights: ['首都ディリのキリスト像', 'アタウロ島の海', '山岳の伝統家屋と織物タイス', '高地のコーヒー農園'],
    heritageSites: [],
  },
]
