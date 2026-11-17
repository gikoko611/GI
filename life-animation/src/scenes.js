export const CONFIG = {
  title: "ဘဝခရီးလမ်း",
  titleEn: "The Journey of Life",
  width: 480,
  height: 854,
  fps: 24,
  watermark: "Powered by အိုင်ကိုကို",
};

export const SCENES = [
  {
    id: 1,
    duration: 10,
    theme: "dawn",
    narration: "Life is a precious journey. Every day is a new beginning.",
    subtitle: "ဘဝသည် တန်ဖိုးရှိသော ခရီးတစ်ခု ဖြစ်သည်။ နေ့တိုင်းသည် အစအသစ်တစ်ခု ဖြစ်သည်။",
    visual: { type: "sunrise", colors: ["#0b1d3a", "#ff9966", "#ffcc66"], objects: ["sun", "hills"] }
  },
  {
    id: 2,
    duration: 10,
    theme: "seed",
    narration: "Like a seed, we all start small, but we carry great potential inside.",
    subtitle: "မျိုးစေ့တစ်စေ့ကဲ့သို့ ကျွန်ုပ်တို့အားလုံး သေးငယ်စွာ စတင်သော်လည်း အတွင်း၌ အလားအလာကြီးမားစွာ ပါရှိသည်။",
    visual: { type: "growth", colors: ["#2d1b00", "#4caf50", "#8bc34a"], objects: ["seed", "sprout", "ground"] }
  },
  {
    id: 3,
    duration: 10,
    theme: "learning",
    narration: "Learning opens our minds. Curiosity is the light that guides us forward.",
    subtitle: "သင်ယူခြင်းသည် စိတ်ကို ဖွင့်ပေးသည်။ သိလိုစိတ်သည် ရှေ့သို့ လမ်းပြသော အလင်းရောင် ဖြစ်သည်။",
    visual: { type: "knowledge", colors: ["#102a43", "#ffd54f", "#ffffff"], objects: ["book", "light", "stars"] }
  },
  {
    id: 4,
    duration: 10,
    theme: "family",
    narration: "Family gives us love and support. Their care helps us grow strong.",
    subtitle: "မိသားစုသည် ချစ်ခြင်းမေတ္တာနှင့် အားပေးမှုကို ပေးသည်။ သူတို့၏ ဂရုစိုက်မှုက ကျွန်ုပ်တို့ကို ခိုင်မာစွာ ကြီးပြင်းစေသည်။",
    visual: { type: "together", colors: ["#3e2723", "#ffab91", "#ffe0b2"], objects: ["hearts", "figures"] }
  },
  {
    id: 5,
    duration: 10,
    theme: "kindness",
    narration: "A small act of kindness can brighten someone's entire day.",
    subtitle: "သေးငယ်သော ကြင်နာမှုတစ်ခုသည် တစ်စုံတစ်ယောက်၏ တစ်နေ့တာလုံးကို တောက်ပစေနိုင်သည်။",
    visual: { type: "kindness", colors: ["#1a237e", "#f06292", "#fff59d"], objects: ["glow", "hands", "sparkles"] }
  },
  {
    id: 6,
    duration: 10,
    theme: "effort",
    narration: "Hard work builds the path to our dreams, one step at a time.",
    subtitle: "ကြိုးစားအားထုတ်မှုသည် အိပ်မက်ဆီသို့ လမ်းကို တစ်ဆင့်ချင်း တည်ဆောက်ပေးသည်။",
    visual: { type: "stairs", colors: ["#263238", "#4fc3f7", "#81d4fa"], objects: ["steps", "climber"] }
  },
  {
    id: 7,
    duration: 10,
    theme: "failure",
    narration: "Failure is not the end. It is a lesson that teaches us how to improve.",
    subtitle: "အရှုံးသည် အဆုံးမဟုတ်ပါ။ ပိုမိုကောင်းမွန်အောင် လုပ်ဆောင်ရန် သင်ပေးသော သင်ခန်းစာ ဖြစ်သည်။",
    visual: { type: "fall-rise", colors: ["#37474f", "#ef5350", "#66bb6a"], objects: ["blocks", "arrow-up"] }
  },
  {
    id: 8,
    duration: 10,
    theme: "resilience",
    narration: "Resilience means standing up again, even when life feels difficult.",
    subtitle: "ခံနိုင်ရည်ရှိခြင်းဆိုသည်မှာ ဘဝခက်ခဲနေချိန်에서도 ထပ်မံထရပ်နိုင်ခြင်း ဖြစ်သည်။",
    visual: { type: "resilience", colors: ["#1b5e20", "#a5d6a7", "#ffffff"], objects: ["tree", "wind", "roots"] }
  },
  {
    id: 9,
    duration: 10,
    theme: "patience",
    narration: "Patience helps us wait calmly. Good things take time to grow.",
    subtitle: "သည်းခံခြင်းသည် ငြိမ်သက်စွာ စောင့်ဆိုင်းနိုင်စေသည်။ ကောင်းသောအရာများ ကြီးပြင်းရန် အချိန်လိုသည်။",
    visual: { type: "time", colors: ["#311b92", "#b39ddb", "#ede7f6"], objects: ["hourglass", "particles"] }
  },
  {
    id: 10,
    duration: 10,
    theme: "gratitude",
    narration: "Gratitude turns what we have into enough. Appreciate the simple joys.",
    subtitle: "ကျေးဇူးတင်ခြင်းသည် ရှိပြီးသားအရာများကို လုံလောက်စေသည်။ ရိုးရှင်းသော ဝမ်းမြောက်မှုများကို တန်ဖိုးထားပါ။",
    visual: { type: "gratitude", colors: ["#4e342e", "#ffca28", "#fff8e1"], objects: ["lotus", "glow"] }
  },
  {
    id: 11,
    duration: 10,
    theme: "health",
    narration: "Taking care of our body and mind is the foundation of a good life.",
    subtitle: "ခန္ဓာကိုယ်နှင့် စိတ်ကို ဂရုစိုက်ခြင်းသည် ကောင်းမွန်သော ဘဝ၏ အခြေခံဖြစ်သည်။",
    visual: { type: "balance-body", colors: ["#004d40", "#4db6ac", "#e0f2f1"], objects: ["circle", "pulse", "leaf"] }
  },
  {
    id: 12,
    duration: 10,
    theme: "friendship",
    narration: "True friends walk beside us, sharing both laughter and challenges.",
    subtitle: "စစ်မှန်သော သူငယ်ချင်းများသည် ရယ်မောမှုနှင့် စိန်ခေါ်မှုများကို အတူမျှဝေကာ ဘေး၌ လျှောက်လှမ်းပေးသည်။",
    visual: { type: "friendship", colors: ["#01579b", "#4fc3f7", "#fff176"], objects: ["two-figures", "bridge"] }
  },
  {
    id: 13,
    duration: 10,
    theme: "honesty",
    narration: "Honesty builds trust. A truthful heart brings peace of mind.",
    subtitle: "ရိုးသားမှုသည် ယုံကြည်မှုကို တည်ဆောက်သည်။ မှန်ကန်သော နှလုံးသားသည် စိတ်၏ ငြိမ်းချမ်းမှုကို ယူဆောင်လာသည်။",
    visual: { type: "clarity", colors: ["#1a237e", "#80deea", "#ffffff"], objects: ["crystal", "rays"] }
  },
  {
    id: 14,
    duration: 10,
    theme: "courage",
    narration: "Courage is not the absence of fear, but the choice to move forward.",
    subtitle: "ရဲရင့်ခြင်းဆိုသည်မှာ ကြောက်ရွံ့မှု မရှိခြင်းမဟုတ်၊ ရှေ့ဆက်ရန် ရွေးချယ်ခြင်း ဖြစ်သည်။",
    visual: { type: "courage", colors: ["#bf360c", "#ff8a65", "#ffd54f"], objects: ["flame", "mountain"] }
  },
  {
    id: 15,
    duration: 10,
    theme: "time",
    narration: "Time is valuable. Use each moment wisely and with purpose.",
    subtitle: "အချိန်သည် တန်ဖိုးရှိသည်။ အခိုက်အတန့်တိုင်းကို ဉာဏ်ပညာနှင့် ရည်ရွယ်ချက်ရှိစွာ အသုံးပြုပါ။",
    visual: { type: "clock", colors: ["#212121", "#90caf9", "#e3f2fd"], objects: ["ring", "orbit"] }
  },
  {
    id: 16,
    duration: 10,
    theme: "balance",
    narration: "Balance in life brings harmony. Rest, work, and joy all matter.",
    subtitle: "ဘဝတွင် ဟန်ချက်ညီခြင်းသည် ညီညွတ်မှုကို ယူဆောင်လာသည်။ အနားယူမှု၊ အလုပ်နှင့် ပျော်ရွှင်မှု အားလုံး အရေးကြီးသည်။",
    visual: { type: "balance", colors: ["#263238", "#ce93d8", "#80cbc4"], objects: ["scales", "orbs"] }
  },
  {
    id: 17,
    duration: 10,
    theme: "dreams",
    narration: "Dreams give us direction. Believe in them and take small steps.",
    subtitle: "အိပ်မက်များသည် လမ်းညွှန်ချက်ပေးသည်။ ယုံကြည်ပြီး ခြေလှမ်းသေးသေးများ စတင်လုပ်ဆောင်ပါ။",
    visual: { type: "dream", colors: ["#0d47a1", "#7986cb", "#fff59d"], objects: ["star-path", "glow"] }
  },
  {
    id: 18,
    duration: 10,
    theme: "helping",
    narration: "Helping others creates a stronger community and a kinder world.",
    subtitle: "သူတစ်ပါးကို ကူညီခြင်းသည် ပိုမိုခိုင်မာသော လူမှုအသိုင်းအဝိုင်းနှင့် ကြင်နာသော ကမ္ဘာကို ဖန်တီးပေးသည်။",
    visual: { type: "community", colors: ["#33691e", "#aed581", "#fff9c4"], objects: ["network", "nodes"] }
  },
  {
    id: 19,
    duration: 10,
    theme: "nature",
    narration: "Nature teaches us harmony. Protecting it protects our future.",
    subtitle: "သဘာဝတရားသည် ညီညွတ်မှုကို သင်ပေးသည်။ သဘာဝကို ကာကွယ်ခြင်းသည် ကျွန်ုပ်တို့၏ အနာဂတ်ကို ကာကွယ်ခြင်း ဖြစ်သည်။",
    visual: { type: "nature", colors: ["#1b5e20", "#66bb6a", "#81d4fa"], objects: ["trees", "globe", "leaves"] }
  },
  {
    id: 20,
    duration: 10,
    theme: "forgiveness",
    narration: "Forgiveness frees the heart. Letting go brings inner peace.",
    subtitle: "ခွင့်လွှတ်ခြင်းသည် နှလုံးသားကို လွတ်လပ်စေသည်။ လွှတ်ချလိုက်ခြင်းသည် အတွင်းစိတ် ငြိမ်းချမ်းမှုကို ယူဆောင်လာသည်။",
    visual: { type: "release", colors: ["#4a148c", "#ba68c8", "#e1bee7"], objects: ["floating", "light"] }
  },
  {
    id: 21,
    duration: 10,
    theme: "mindfulness",
    narration: "Be present in this moment. Calm awareness helps us see clearly.",
    subtitle: "လက်ရှိအခိုက်အတန့်၌ ရှိနေပါ။ တည်ငြိမ်သော သတိရှိမှုသည် ရှင်းလင်းစွာ မြင်နိုင်စေသည်။",
    visual: { type: "calm", colors: ["#006064", "#4dd0e1", "#e0f7fa"], objects: ["ripples", "circle"] }
  },
  {
    id: 22,
    duration: 10,
    theme: "change",
    narration: "Change is a part of life. Adapting to change helps us grow.",
    subtitle: "ပြောင်းလဲမှုသည် ဘဝ၏ အစိတ်အပိုင်းတစ်ခု ဖြစ်သည်။ ပြောင်းလဲမှုနှင့် လိုက်လျောညီထွေဖြစ်ခြင်းက ကြီးပြင်းစေသည်။",
    visual: { type: "transform", colors: ["#283593", "#9575cd", "#ffcc80"], objects: ["morph", "cycle"] }
  },
  {
    id: 23,
    duration: 10,
    theme: "hope",
    narration: "Hope is the light in dark times. It reminds us that tomorrow can be better.",
    subtitle: "မျှော်လင့်ခြင်းသည် မှောင်မိုက်သော အချိန်များ中的 အလင်းရောင် ဖြစ်သည်။ မနက်ဖြန် ပိုကောင်းနိုင်ကြောင်း သတိပေးသည်။",
    visual: { type: "hope", colors: ["#0d1b2a", "#ffd54f", "#fff9c4"], objects: ["lantern", "dark-to-light"] }
  },
  {
    id: 24,
    duration: 10,
    theme: "self-belief",
    narration: "Believe in yourself. Confidence grows when we trust our abilities.",
    subtitle: "မိမိကိုယ်ကို ယုံကြည်ပါ။ မိမိစွမ်းရည်ကို ယုံကြည်သောအခါ ယုံကြည်မှု တိုးပွားလာသည်။",
    visual: { type: "confidence", colors: ["#1b1b2f", "#e94560", "#f9ed69"], objects: ["pillar", "shine"] }
  },
  {
    id: 25,
    duration: 10,
    theme: "discipline",
    narration: "Discipline shapes our habits. Small daily efforts lead to big results.",
    subtitle: "စည်းကမ်းသည် အလေ့အကျင့်ကို ပုံဖော်ပေးသည်။ နေ့စဉ် သေးငယ်သော ကြိုးစားမှုများက ကြီးမားသော ရလဒ်များကို ဖြစ်စေသည်။",
    visual: { type: "routine", colors: ["#263238", "#26a69a", "#b2dfdb"], objects: ["grid", "progress"] }
  },
  {
    id: 26,
    duration: 10,
    theme: "compassion",
    narration: "Compassion connects us. Understanding others makes life more meaningful.",
    subtitle: "သနားကြင်နာမှုသည် ကျွန်ုပ်တို့ကို ဆက်သွယ်ပေးသည်။ သူတစ်ပါးကို နားလည်ခြင်းက ဘဝကို ပိုမိုအဓိပ္ပာယ်ရှိစေသည်။",
    visual: { type: "connection", colors: ["#3e2723", "#ff8a80", "#ffd180"], objects: ["linked-rings", "warm-glow"] }
  },
  {
    id: 27,
    duration: 10,
    theme: "community",
    narration: "Together we are stronger. A caring community lifts everyone up.",
    subtitle: "အတူတကွရှိလျှင် ပိုမိုခိုင်မာပါသည်။ ဂရုစိုက်သော လူမှုအသိုင်းအဝိုင်းသည် လူတိုင်းကို မြှင့်တင်ပေးသည်။",
    visual: { type: "unity", colors: ["#004d40", "#80cbc4", "#ffe082"], objects: ["many-figures", "circle-unity"] }
  },
  {
    id: 28,
    duration: 10,
    theme: "simplicity",
    narration: "Simplicity brings clarity. Find joy in what truly matters.",
    subtitle: "ရိုးရှင်းမှုသည် ရှင်းလင်းမှုကို ယူဆောင်လာသည်။ အမှန်တကယ် အရေးကြီးသောအရာများတွင် ဝမ်းမြောက်မှုကို ရှာဖွေပါ။",
    visual: { type: "simple", colors: ["#fafafa", "#90a4ae", "#cfd8dc"], objects: ["minimal-shapes", "space"] }
  },
  {
    id: 29,
    duration: 10,
    theme: "reflection",
    narration: "Take time to reflect. Learning from our experiences guides future choices.",
    subtitle: "ပြန်လည်ဆင်ခြင်ရန် အချိန်ယူပါ။ အတွေ့အကြုံများမှ သင်ယူခြင်းသည် အနာဂတ် ရွေးချယ်မှုများကို လမ်းညွှန်ပေးသည်။",
    visual: { type: "mirror", colors: ["#1a237e", "#9fa8da", "#e8eaf6"], objects: ["mirror", "path"] }
  },
  {
    id: 30,
    duration: 10,
    theme: "legacy",
    narration: "Live with purpose and kindness. The good we do becomes our lasting legacy.",
    subtitle: "ရည်ရွယ်ချက်နှင့် ကြင်နာမှုဖြင့် နေထိုင်ပါ။ ကျွန်ုပ်တို့ပြုသော ကောင်းမှုများသည် ကြာရှည်တည်တံ့သော အမွေအနှစ် ဖြစ်လာသည်။",
    visual: { type: "finale", colors: ["#0b132b", "#f6c90e", "#fff3b0"], objects: ["pagoda-silhouette", "sunset", "sparkles"] }
  }
];
