export const i18nConst = {
    imageTypeSet: {
        zh: [
            {label: "默认", value: 0},
            {label: "缩略图", value: 1},
            {label: "封面", value: 2},
            {label: "其他", value: 99}
        ],
        en: [
            {label: "Default", value: 0},
            {label: "Thumb", value: 1},
            {label: "Cover", value: 2},
            {label: "Other", value: 99}
        ]
    } as Record<string, Attribute<number>[]>,
    genderSet: {
        zh: [
            {label: "未知", value: 0},
            {label: "男", value: 1},
            {label: "女", value: 2}
        ],
        en: [
            {label: "Unknown", value: 0},
            {label: "Male", value: 1},
            {label: "Female", value: 2}
        ]
    } as Record<string, Attribute<number>[]>,
    goodsTypeSet: {
        zh: [
            {label: "默认", value: 0},
            {label: "杂项", value: 1},
            {label: "挂饰", value: 2},
            {label: "毛绒玩具", value: 3},
            {label: "文具", value: 4},
            {label: "餐具", value: 5},
            {label: "服饰", value: 6},
            {label: "床上用品", value: 7},
            {label: "壁饰", value: 8}
        ],
        en: [
            {label: "Default", value: 0},
            {label: "Misc", value: 1},
            {label: "Hang up", value: 2},
            {label: "Plush toy", value: 3},
            {label: "Stationery", value: 4},
            {label: "Dishes", value: 5},
            {label: "Apparel", value: 6},
            {label: "Linens", value: 7},
            {label: "On walls", value: 8}
        ]
    } as Record<string, Attribute<number>[]>,
    figureTypeSet: {
        zh: [
            {label: "默认", value: 0},
            {label: "涂装模型", value: 9},
            {label: "可动模型", value: 10},
            {label: "粘土模型", value: 11},
            {label: "模型配件", value: 12},
            {label: "套件模型", value: 13},
            {label: "GK手办", value: 14}
        ],
        en: [
            {label: "Default", value: 0},
            {label: "Prepainted", value: 9},
            {label: "Action dolls", value: 10},
            {label: "Trading", value: 11},
            {label: "Accessories", value: 12},
            {label: "Model kits", value: 13},
            {label: "Garage kits", value: 14}
        ]
    } as Record<string, Attribute<number>[]>,
    bookTypeSet: {
        zh: [
            {label: "默认", value: 0},
            {label: "小说", value: 15},
            {label: "漫画", value: 16},
            {label: "作品集", value: 17},
            {label: "原画集/设定集", value: 18}
        ],
        en: [
            {label: "Default", value: 0},
            {label: "Novel", value: 15},
            {label: "Manga", value: 16},
            {label: "Anthology", value: 17},
            {label: "Art Book", value: 18}
        ]
    } as Record<string, Attribute<number>[]>,
    languageSet: {
        zh: [
            {label: "日语", value: 'ja-JP'},
            {label: "简体中文", value: 'zh-CN'},
            {label: "繁体中文", value: 'zh-TW'},
            {label: "英语", value: 'en-US'}
        ],
        en: [
            {label: "Japanese", value: 'ja-JP'},
            {label: "Simplified Chinese", value: 'zh-CN'},
            {label: "Traditional Chinese", value: 'zh-TW'},
            {label: "English", value: 'en-US'}
        ]
    } as Record<string, Attribute<string>[]>,
    entrySubTypeSet: {
        zh: [
            {label: "默认", value: 0},
            {label: "动画", value: 1},
            {label: "印刷出版物", value: 2},
            {label: "动画电影", value: 3},
            {label: "游戏", value: 4},
            {label: "真人作品", value: 5},
            {label: "特摄", value: 6},
            {label: "广播剧/电台", value: 7},
            {label: "多媒体企划", value: 8},
            {label: "公司/组织", value: 9},
            {label: "组合/团体", value: 10},
            {label: "工作室", value: 11},
            {label: "系列", value: 100}
        ],
        en: [
            {label: "Default", value: 0},
            {label: "Animation", value: 1},
            {label: "Print Publication", value: 2},
            {label: "Anime Movie", value: 3},
            {label: "Game", value: 4},
            {label: "Live Action", value: 5},
            {label: "Tokusatsu", value: 6},
            {label: "Radio & Audio Drama", value: 7},
            {label: "Multimedia", value: 8},
            {label: "Company", value: 9},
            {label: "Unit", value: 10},
            {label: "Studio", value: 11},
            {label: "Franchise", value: 100}
        ]
    } as Record<string, Attribute<number>[]>,
    releaseTypeSet: {
        zh: [
            {label: "标准版", value: 0},
            {label: "限量版", value: 1},
            {label: "限定版", value: 2},
            {label: "限量限定", value: 3},
            {label: "特典", value: 4},
            {label: "初回限定", value: 5},
            {label: "未知", value: 99}
        ],
        en: [
            {label: "Standard", value: 0},
            {label: "Limited", value: 1},
            {label: "Exclusive", value: 2},
            {label: "Limited + Exclusive", value: 3},
            {label: "Prize", value: 4},
            {label: "Initial Press", value: 5},
            {label: "未知", "Unknown": 99}
        ]
    } as Record<string, Attribute<number>[]>
};