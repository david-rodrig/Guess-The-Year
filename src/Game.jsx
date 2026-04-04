import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { DECADES } from './DecadeSelect';

const ALL_SONGS = [
  // ── 70s ──────────────────────────────────────────────────────────
  { title: "Bohemian Rhapsody", artist: "Queen", year: 1975, youtubeId: "fJ9rUzIMcZQ" },
  { title: "Dancing Queen", artist: "ABBA", year: 1976, youtubeId: "xFrGuyw1V8s" },
  { title: "Hotel California", artist: "Eagles", year: 1977, youtubeId: "BciS5krYL80" },
  { title: "Stayin' Alive", artist: "Bee Gees", year: 1977, youtubeId: "I_izvAbhExY" },
  { title: "September", artist: "Earth, Wind & Fire", year: 1978, youtubeId: "Gs069dndIYk" },
  { title: "Don't Stop Me Now", artist: "Queen", year: 1978, youtubeId: "HgzGwKwLmgM" },
  { title: "Ring My Bell", artist: "Anita Ward", year: 1979, youtubeId: "M-WJEEEAcjA" },
  { title: "Heart of Glass", artist: "Blondie", year: 1979, youtubeId: "WGU_4-5RaxU" },
  { title: "Piano Man", artist: "Billy Joel", year: 1973, youtubeId: "gxEPV4kolz0" },
  { title: "American Pie", artist: "Don McLean", year: 1971, youtubeId: "BGLGzRXY5Bw" },
  { title: "Rocket Man", artist: "Elton John", year: 1972, youtubeId: "DtVBCG6ThDk" },
  { title: "Tiny Dancer", artist: "Elton John", year: 1971, youtubeId: "oT3mCybbhf0" },
  { title: "Crocodile Rock", artist: "Elton John", year: 1972, youtubeId: "E8gmARGvPlI" },
  { title: "Dreams", artist: "Fleetwood Mac", year: 1977, youtubeId: "mrZRURcb1cM" },
  { title: "Go Your Own Way", artist: "Fleetwood Mac", year: 1977, youtubeId: "6ul-cZyuYq4" },
  { title: "Don't Stop", artist: "Fleetwood Mac", year: 1977, youtubeId: "W429Wjr9WkQ" },
  { title: "Heroes", artist: "David Bowie", year: 1977, youtubeId: "mV5bqMKfm04" },
  { title: "More Than a Feeling", artist: "Boston", year: 1976, youtubeId: "SSbBvKaM6sk" },
  { title: "Dream On", artist: "Aerosmith", year: 1973, youtubeId: "89dGHB4wMkQ" },
  { title: "Walk This Way", artist: "Aerosmith", year: 1975, youtubeId: "Hh-maDrFVAo" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", year: 1971, youtubeId: "iXQUu5Dti4g" },
  { title: "Kashmir", artist: "Led Zeppelin", year: 1975, youtubeId: "pjRn4lLpbJU" },
  { title: "Smoke on the Water", artist: "Deep Purple", year: 1972, youtubeId: "SnHHA6o-XNQ" },
  { title: "Superstition", artist: "Stevie Wonder", year: 1972, youtubeId: "0CFuCYNx-1g" },
  { title: "We Will Rock You", artist: "Queen", year: 1977, youtubeId: "Ilu3vixKBM0" },
  { title: "Killer Queen", artist: "Queen", year: 1974, youtubeId: "FqMAB7HYV04" },
  { title: "We Are the Champions", artist: "Queen", year: 1977, youtubeId: "-tJYN-eG1zk" },
  { title: "Baker Street", artist: "Gerry Rafferty", year: 1978, youtubeId: "Fo6aKnRnBxM" },
  { title: "Roxanne", artist: "The Police", year: 1978, youtubeId: "3T1c7GkzRQQ" },
  { title: "Night Fever", artist: "Bee Gees", year: 1977, youtubeId: "kNpQrAu4BOE" },
  { title: "I Will Survive", artist: "Gloria Gaynor", year: 1978, youtubeId: "ARt9HV9T0w8" },
  { title: "YMCA", artist: "Village People", year: 1978, youtubeId: "CS9OO0S5w2k" },
  { title: "Funkytown", artist: "Lipps Inc", year: 1979, youtubeId: "hGzA9aQtxdU" },
  { title: "Waterloo", artist: "ABBA", year: 1974, youtubeId: "Sj_9CiNkkn4" },
  { title: "Fernando", artist: "ABBA", year: 1976, youtubeId: "kRqJo8N4lJY" },
  { title: "Money", artist: "Pink Floyd", year: 1973, youtubeId: "cpbbuaLljkk" },
  { title: "Wish You Were Here", artist: "Pink Floyd", year: 1975, youtubeId: "IXdNnw99-Ic" },
  { title: "Paranoid", artist: "Black Sabbath", year: 1970, youtubeId: "0qanF-qdlTs" },
  { title: "Born to Run", artist: "Bruce Springsteen", year: 1975, youtubeId: "IlFtTQbRMkE" },
  { title: "Sultans of Swing", artist: "Dire Straits", year: 1978, youtubeId: "h0ffIJ7ZO4U" },
  { title: "Heart of Gold", artist: "Neil Young", year: 1972, youtubeId: "oJOZFCjMHk0" },
  { title: "Rapper's Delight", artist: "Sugarhill Gang", year: 1979, youtubeId: "rKTUAESacQM" },
  { title: "Disco Inferno", artist: "The Trammps", year: 1976, youtubeId: "RKREOzInBj0" },
  { title: "You're So Vain", artist: "Carly Simon", year: 1972, youtubeId: "mQZmCJUSC6g" },
  { title: "Le Freak", artist: "Chic", year: 1978, youtubeId: "gGWnv-Rgp_E" },
  { title: "Can't Get Enough of Your Love, Babe", artist: "Barry White", year: 1974, youtubeId: "l6VfKPpnBFc" },

  // ── 80s ──────────────────────────────────────────────────────────
  { title: "Another One Bites the Dust", artist: "Queen", year: 1980, youtubeId: "rY0WxgPXvzc" },
  { title: "Don't You Want Me", artist: "The Human League", year: 1981, youtubeId: "uPudE8nDog0" },
  { title: "Tainted Love", artist: "Soft Cell", year: 1981, youtubeId: "XZVnR3KpGvU" },
  { title: "Thriller", artist: "Michael Jackson", year: 1982, youtubeId: "sOnqjkJTMaA" },
  { title: "Every Breath You Take", artist: "The Police", year: 1983, youtubeId: "OMOGaugKpzs" },
  { title: "Billie Jean", artist: "Michael Jackson", year: 1983, youtubeId: "Zi_XLOBDo_Y" },
  { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics", year: 1983, youtubeId: "qeMFqKcPYcg" },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", year: 1983, youtubeId: "PIb6AZdTr-A" },
  { title: "When Doves Cry", artist: "Prince", year: 1984, youtubeId: "UG3VcCAlUgE" },
  { title: "Careless Whisper", artist: "George Michael", year: 1984, youtubeId: "izGwDsrQ1eQ" },
  { title: "Take On Me", artist: "a-ha", year: 1985, youtubeId: "djV11Xbc914" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", year: 1986, youtubeId: "lDK9QqIzhwk" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987, youtubeId: "1w7OgIMMRc4" },
  { title: "Like a Prayer", artist: "Madonna", year: 1989, youtubeId: "79fzeNUqQbO" },
  { title: "Eye of the Tiger", artist: "Survivor", year: 1982, youtubeId: "btPJPFnesV4" },
  { title: "Don't Stop Believin'", artist: "Journey", year: 1981, youtubeId: "1k8craCGpgs" },
  { title: "Africa", artist: "Toto", year: 1982, youtubeId: "FTQbiNvZqaY" },
  { title: "Jump", artist: "Van Halen", year: 1984, youtubeId: "SwYN7mTi6HM" },
  { title: "Purple Rain", artist: "Prince", year: 1984, youtubeId: "TvnYmWpD_T8" },
  { title: "Wake Me Up Before You Go-Go", artist: "Wham!", year: 1984, youtubeId: "pITbGadTjKY" },
  { title: "Material Girl", artist: "Madonna", year: 1984, youtubeId: "6p-lDYPR2P8" },
  { title: "Time After Time", artist: "Cyndi Lauper", year: 1983, youtubeId: "VdQY7BusJNU" },
  { title: "True Colors", artist: "Cyndi Lauper", year: 1986, youtubeId: "LPn0KFlbqX8" },
  { title: "Walk Like an Egyptian", artist: "The Bangles", year: 1986, youtubeId: "Cv6tuzHPlXU" },
  { title: "99 Luftballons", artist: "Nena", year: 1983, youtubeId: "La4Dcd1aUcI" },
  { title: "Let's Dance", artist: "David Bowie", year: 1983, youtubeId: "N4d7Wp9kKjA" },
  { title: "Blue Monday", artist: "New Order", year: 1983, youtubeId: "FYH8DsE3wek" },
  { title: "Come On Eileen", artist: "Dexys Midnight Runners", year: 1982, youtubeId: "sNFSxLFaRzs" },
  { title: "Should I Stay or Should I Go", artist: "The Clash", year: 1982, youtubeId: "BN1WwnEDWAM" },
  { title: "Don't You (Forget About Me)", artist: "Simple Minds", year: 1985, youtubeId: "CdqoNKCCt7A" },
  { title: "Under Pressure", artist: "Queen & David Bowie", year: 1981, youtubeId: "a01QQZyl-_I" },
  { title: "I Love Rock 'n' Roll", artist: "Joan Jett", year: 1981, youtubeId: "Ac-fNQnRdnQ" },
  { title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", year: 1983, youtubeId: "lcOxhH8N3Bo" },
  { title: "With or Without You", artist: "U2", year: 1987, youtubeId: "hjpF8ukSrvk" },
  { title: "Personal Jesus", artist: "Depeche Mode", year: 1989, youtubeId: "u1xrNaTO_4s" },
  { title: "Don't Dream It's Over", artist: "Crowded House", year: 1986, youtubeId: "J9gKyRmic20" },
  { title: "La Bamba", artist: "Los Lobos", year: 1987, youtubeId: "ORvHxTZOuqo" },
  { title: "Running Up That Hill", artist: "Kate Bush", year: 1985, youtubeId: "wp43OdtAAkM" },
  { title: "Footloose", artist: "Kenny Loggins", year: 1984, youtubeId: "rRgTMs_pCOY" },
  { title: "Faith", artist: "George Michael", year: 1987, youtubeId: "6WsFkEetAag" },
  { title: "West End Girls", artist: "Pet Shop Boys", year: 1985, youtubeId: "p3j2NYZ8FKs" },
  { title: "Push It", artist: "Salt-N-Pepa", year: 1987, youtubeId: "vCadcBR95oU" },
  { title: "Every Little Thing She Does Is Magic", artist: "The Police", year: 1981, youtubeId: "GjCULjvnwP4" },
  { title: "Born in the U.S.A.", artist: "Bruce Springsteen", year: 1984, youtubeId: "EPhWR4d3FJQ" },

  // ── 90s ──────────────────────────────────────────────────────────
  { title: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991, youtubeId: "hTWKbfoikeg" },
  { title: "Losing My Religion", artist: "R.E.M.", year: 1991, youtubeId: "xwtdhWltSIg" },
  { title: "Creep", artist: "Radiohead", year: 1992, youtubeId: "XFkzRNplNtw" },
  { title: "Waterfalls", artist: "TLC", year: 1995, youtubeId: "8WEtxJ4-sh4" },
  { title: "Wonderwall", artist: "Oasis", year: 1995, youtubeId: "bx1Bh8ZvH84" },
  { title: "MMMBop", artist: "Hanson", year: 1997, youtubeId: "NHozn0YXAeE" },
  { title: "...Baby One More Time", artist: "Britney Spears", year: 1998, youtubeId: "C-u5WLJ9Yk4" },
  { title: "Livin' la Vida Loca", artist: "Ricky Martin", year: 1999, youtubeId: "p47fEXGabaY" },
  { title: "Come as You Are", artist: "Nirvana", year: 1992, youtubeId: "vabnZ9-ex7o" },
  { title: "November Rain", artist: "Guns N' Roses", year: 1991, youtubeId: "8SbUC-UaAxE" },
  { title: "Enter Sandman", artist: "Metallica", year: 1991, youtubeId: "CD-E-LDc384" },
  { title: "Black Hole Sun", artist: "Soundgarden", year: 1994, youtubeId: "3mbBbFH9fAg" },
  { title: "Basket Case", artist: "Green Day", year: 1994, youtubeId: "NUTGr5t3MoY" },
  { title: "Gangsta's Paradise", artist: "Coolio", year: 1995, youtubeId: "fPO76Jlnz6c" },
  { title: "Killing Me Softly", artist: "Fugees", year: 1996, youtubeId: "eGCY4G1kUuA" },
  { title: "No Scrubs", artist: "TLC", year: 1999, youtubeId: "FrLequ6dUdM" },
  { title: "Say My Name", artist: "Destiny's Child", year: 1999, youtubeId: "sQgd6MccwZc" },
  { title: "Genie in a Bottle", artist: "Christina Aguilera", year: 1999, youtubeId: "kFMENQmbFzc" },
  { title: "Mambo No. 5", artist: "Lou Bega", year: 1999, youtubeId: "EK_LN3XEcnw" },
  { title: "Smooth", artist: "Santana ft. Rob Thomas", year: 1999, youtubeId: "6Whgn_iE5uc" },
  { title: "Iris", artist: "Goo Goo Dolls", year: 1998, youtubeId: "NdYWuo9OFAw" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith", year: 1998, youtubeId: "JkK8g6FMEXE" },
  { title: "Everybody (Backstreet's Back)", artist: "Backstreet Boys", year: 1997, youtubeId: "6M6samPEMpM" },
  { title: "Wannabe", artist: "Spice Girls", year: 1996, youtubeId: "gJLIiF15wGQ" },
  { title: "Don't Speak", artist: "No Doubt", year: 1996, youtubeId: "TR3Vdo5etCQ" },
  { title: "Ironic", artist: "Alanis Morissette", year: 1995, youtubeId: "Jne9t8sHpUc" },
  { title: "Zombie", artist: "The Cranberries", year: 1994, youtubeId: "6Ejga4kJUts" },
  { title: "Bitter Sweet Symphony", artist: "The Verve", year: 1997, youtubeId: "1lyu1KKwC74" },
  { title: "Blue (Da Ba Dee)", artist: "Eiffel 65", year: 1998, youtubeId: "zA52uNzx7Y4" },
  { title: "Believe", artist: "Cher", year: 1998, youtubeId: "nZXRV4MezEw" },
  { title: "Torn", artist: "Natalie Imbruglia", year: 1997, youtubeId: "JlSQoXqoVvg" },
  { title: "One", artist: "U2", year: 1992, youtubeId: "ftjEcrrf7r0" },
  { title: "Under the Bridge", artist: "Red Hot Chili Peppers", year: 1992, youtubeId: "glen55FMzJK0" },
  { title: "Return of the Mack", artist: "Mark Morrison", year: 1996, youtubeId: "BLhiSAMT7a0" },
  { title: "Semi-Charmed Life", artist: "Third Eye Blind", year: 1997, youtubeId: "M3kF1GfGDnY" },
  { title: "I'm Too Sexy", artist: "Right Said Fred", year: 1991, youtubeId: "34oE0RxDYVU" },

  // ── 2000s ─────────────────────────────────────────────────────────
  { title: "Crazy in Love", artist: "Beyoncé", year: 2003, youtubeId: "ViwtNLUqkMY" },
  { title: "Hey Ya!", artist: "OutKast", year: 2003, youtubeId: "PWgvGjAhvIw" },
  { title: "Yeah!", artist: "Usher", year: 2004, youtubeId: "GxBSyx85Kp8" },
  { title: "Since U Been Gone", artist: "Kelly Clarkson", year: 2004, youtubeId: "R7_UDen97cQ" },
  { title: "Crazy", artist: "Gnarls Barkley", year: 2006, youtubeId: "md4-SSEOFRQ" },
  { title: "Umbrella", artist: "Rihanna", year: 2007, youtubeId: "CvBfHwUxHIk" },
  { title: "Single Ladies", artist: "Beyoncé", year: 2008, youtubeId: "4m1EFMoRFvY" },
  { title: "Poker Face", artist: "Lady Gaga", year: 2008, youtubeId: "bESGLojNYSo" },
  { title: "In Da Club", artist: "50 Cent", year: 2003, youtubeId: "5qm8PH4xAss" },
  { title: "Numb", artist: "Linkin Park", year: 2003, youtubeId: "kXYiU_JCYtU" },
  { title: "Boulevard of Broken Dreams", artist: "Green Day", year: 2004, youtubeId: "Yk4HcFDNqWg" },
  { title: "Mr. Brightside", artist: "The Killers", year: 2003, youtubeId: "gGdGFtwCNBE" },
  { title: "Seven Nation Army", artist: "The White Stripes", year: 2003, youtubeId: "0J2QdDbelmY" },
  { title: "Lose Yourself", artist: "Eminem", year: 2002, youtubeId: "_Yhyp-_hX2s" },
  { title: "Beautiful Day", artist: "U2", year: 2000, youtubeId: "co6WMzDOh1o" },
  { title: "Complicated", artist: "Avril Lavigne", year: 2002, youtubeId: "5NPBIwQyPWE" },
  { title: "In the End", artist: "Linkin Park", year: 2000, youtubeId: "eVTXPUF4Oz4" },
  { title: "Clocks", artist: "Coldplay", year: 2002, youtubeId: "d020hcWA_Wg" },
  { title: "The Scientist", artist: "Coldplay", year: 2002, youtubeId: "RB-RcX5DS5A" },
  { title: "Fix You", artist: "Coldplay", year: 2005, youtubeId: "k4V3Mo61fJM" },
  { title: "Chasing Cars", artist: "Snow Patrol", year: 2006, youtubeId: "GemKqzILV4w" },
  { title: "SOS", artist: "Rihanna", year: 2006, youtubeId: "SFGvmTELr90" },
  { title: "Irreplaceable", artist: "Beyoncé", year: 2006, youtubeId: "2EwViQxSJJQ" },
  { title: "Hips Don't Lie", artist: "Shakira", year: 2005, youtubeId: "DUT5rEU6pqM" },
  { title: "Hollaback Girl", artist: "Gwen Stefani", year: 2004, youtubeId: "Kgjkth6BRRY" },
  { title: "I Gotta Feeling", artist: "Black Eyed Peas", year: 2009, youtubeId: "uSD4vsh1zDA" },
  { title: "Tik Tok", artist: "Ke$ha", year: 2009, youtubeId: "iP6XpLQM2Cs" },
  { title: "How to Save a Life", artist: "The Fray", year: 2005, youtubeId: "90WD_ats6eE" },
  { title: "Take Me Out", artist: "Franz Ferdinand", year: 2004, youtubeId: "0S43IwBvfkM" },
  { title: "Hot N Cold", artist: "Katy Perry", year: 2008, youtubeId: "kTHNpusq654" },
  { title: "I Kissed a Girl", artist: "Katy Perry", year: 2008, youtubeId: "tAp9BKosZXs" },
  { title: "Apologize", artist: "Timbaland ft. OneRepublic", year: 2007, youtubeId: "ZSM3w1v-A_Y" },
  { title: "Low", artist: "Flo Rida", year: 2007, youtubeId: "GGXzlMMisR0" },
  { title: "Party in the U.S.A.", artist: "Miley Cyrus", year: 2009, youtubeId: "hkHeoSf_KU0" },
  { title: "Beautiful Girls", artist: "Sean Kingston", year: 2007, youtubeId: "LgnFoQxPFV4" },

  // ── 2010s ─────────────────────────────────────────────────────────
  { title: "Rolling in the Deep", artist: "Adele", year: 2010, youtubeId: "rYEDA3JcQqw" },
  { title: "Call Me Maybe", artist: "Carly Rae Jepsen", year: 2011, youtubeId: "fWNaR-rxAic" },
  { title: "Royals", artist: "Lorde", year: 2013, youtubeId: "nlcIKh6sBtc" },
  { title: "Happy", artist: "Pharrell Williams", year: 2013, youtubeId: "ZbZSe6N_BXs" },
  { title: "Uptown Funk", artist: "Bruno Mars", year: 2014, youtubeId: "OPf0YbXqDm0" },
  { title: "Shape of You", artist: "Ed Sheeran", year: 2017, youtubeId: "JGwWNGJdvx8" },
  { title: "Bad Guy", artist: "Billie Eilish", year: 2019, youtubeId: "DyDfgMOUjCI" },
  { title: "Old Town Road", artist: "Lil Nas X", year: 2019, youtubeId: "w2Ov5jzm3j8" },
  { title: "Blurred Lines", artist: "Robin Thicke", year: 2013, youtubeId: "yyDUC1LUXSU" },
  { title: "Get Lucky", artist: "Daft Punk", year: 2013, youtubeId: "h5EofwRzit0" },
  { title: "Roar", artist: "Katy Perry", year: 2013, youtubeId: "CevxZvSJLk8" },
  { title: "Counting Stars", artist: "OneRepublic", year: 2013, youtubeId: "hT_nvWreIhg" },
  { title: "Shake It Off", artist: "Taylor Swift", year: 2014, youtubeId: "nfWlot6h_JM" },
  { title: "Blank Space", artist: "Taylor Swift", year: 2014, youtubeId: "e-ORhEE9VVg" },
  { title: "Hello", artist: "Adele", year: 2015, youtubeId: "YQHsXMglC9A" },
  { title: "Love Yourself", artist: "Justin Bieber", year: 2015, youtubeId: "oyEuk8j8imI" },
  { title: "Sorry", artist: "Justin Bieber", year: 2015, youtubeId: "fRh_vgS2dFE" },
  { title: "Work", artist: "Rihanna", year: 2016, youtubeId: "HL1UzIK-flA" },
  { title: "One Dance", artist: "Drake", year: 2016, youtubeId: "iHMEAZSDMC0" },
  { title: "7 Years", artist: "Lukas Graham", year: 2015, youtubeId: "LHCob76kigA" },
  { title: "Closer", artist: "The Chainsmokers ft. Halsey", year: 2016, youtubeId: "PT2_F-1esPk" },
  { title: "Stressed Out", artist: "Twenty One Pilots", year: 2015, youtubeId: "pXRviuL6vMY" },
  { title: "Cheap Thrills", artist: "Sia", year: 2016, youtubeId: "LpqhvlpRlcA" },
  { title: "Havana", artist: "Camila Cabello", year: 2017, youtubeId: "BQ0mxQXmLsk" },
  { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", year: 2017, youtubeId: "W3GrSWMnw28" },
  { title: "Perfect", artist: "Ed Sheeran", year: 2017, youtubeId: "2Vv-BfVoq4g" },
  { title: "God's Plan", artist: "Drake", year: 2018, youtubeId: "xpVfcZ0ZcFM" },
  { title: "Shallow", artist: "Lady Gaga & Bradley Cooper", year: 2018, youtubeId: "bo_efYhYU2A" },
  { title: "Sunflower", artist: "Post Malone & Swae Lee", year: 2018, youtubeId: "ApXoWvfEYVU" },
  { title: "Thank U, Next", artist: "Ariana Grande", year: 2018, youtubeId: "gl1aHhXnN1k" },
  { title: "7 Rings", artist: "Ariana Grande", year: 2019, youtubeId: "QYh6mYIJG2Y" },
  { title: "Someone You Loved", artist: "Lewis Capaldi", year: 2018, youtubeId: "zABZyAoxQeY" },
  { title: "Senorita", artist: "Shawn Mendes & Camila Cabello", year: 2019, youtubeId: "Pkh8UtuejGw" },
  { title: "Without Me", artist: "Halsey", year: 2018, youtubeId: "Ykqo8kzz9iI" },
  { title: "Blinding Lights", artist: "The Weeknd", year: 2019, youtubeId: "4NRXx6U8ABQ" },

  // ── 2020s ─────────────────────────────────────────────────────────
  { title: "drivers license", artist: "Olivia Rodrigo", year: 2021, youtubeId: "ZmDBbnmKpqQ" },
  { title: "Levitating", artist: "Dua Lipa", year: 2020, youtubeId: "TUVcZfQe-Kw" },
  { title: "Stay", artist: "The Kid LAROI & Justin Bieber", year: 2021, youtubeId: "kTJczUoc26U" },
  { title: "As It Was", artist: "Harry Styles", year: 2022, youtubeId: "H5v3kku4y6Q" },
  { title: "Flowers", artist: "Miley Cyrus", year: 2023, youtubeId: "G7KNmW9a75Y" },
  { title: "Heat Waves", artist: "Glass Animals", year: 2020, youtubeId: "mRD0-GxqHVo" },
  { title: "good 4 u", artist: "Olivia Rodrigo", year: 2021, youtubeId: "gNi_6U5Pm_o" },
  { title: "Easy On Me", artist: "Adele", year: 2021, youtubeId: "U3ASj1L6_sY" },
  { title: "Butter", artist: "BTS", year: 2021, youtubeId: "WMweEpGlu_U" },
  { title: "About Damn Time", artist: "Lizzo", year: 2022, youtubeId: "IXBdVMfPkGk" },
  { title: "Anti-Hero", artist: "Taylor Swift", year: 2022, youtubeId: "b1kbLwvqugk" },
  { title: "Unholy", artist: "Sam Smith & Kim Petras", year: 2022, youtubeId: "Uq9gPaIzbe8" },
  { title: "Kill Bill", artist: "SZA", year: 2022, youtubeId: "MpTBiCBVDDM" },
  { title: "Bad Habit", artist: "Steve Lacy", year: 2022, youtubeId: "LHgBmBFt_FI" },
  { title: "Montero (Call Me By Your Name)", artist: "Lil Nas X", year: 2021, youtubeId: "6swmTBVI83k" },
  { title: "Peaches", artist: "Justin Bieber", year: 2021, youtubeId: "tQ0yjYMFCDE" },
  { title: "Vampire", artist: "Olivia Rodrigo", year: 2023, youtubeId: "RlPNh_PBZb4" },
  { title: "Calm Down", artist: "Rema & Selena Gomez", year: 2022, youtubeId: "WcHmGmrxpXI" },
  { title: "Industry Baby", artist: "Lil Nas X", year: 2021, youtubeId: "UTHLKHL_whs" },
  { title: "Escapism.", artist: "RAYE ft. 070 Shake", year: 2022, youtubeId: "M3Cg4_6UOec" },
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function Game({ user, roomCode, isHost, selectedDecades, onLeave }) {
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(null);
  const [players, setPlayers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [submittedGuess, setSubmittedGuess] = useState(null); // stored after submit, shown only at reveal
  const [feedback, setFeedback] = useState(null);             // set at reveal time
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hostSongs, setHostSongs] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [guessedCount, setGuessedCount] = useState(0);        // how many players have submitted
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [roundNumber, setRoundNumber] = useState(0);

  // Refs for use inside callbacks / YT event handlers
  const ytPlayerRef = useRef(null);
  const revealedRef = useRef(false);
  const submittedGuessRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const channelRef = useRef(null);
  const playersRef = useRef({});
  const guessedIdsRef = useRef(new Set());
  const scoreRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { currentQuestionRef.current = currentQuestion; }, [currentQuestion]);
  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data));
  }, [user.id]);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!document.getElementById('yt-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }, []);

  // ── Reveal answer ──────────────────────────────────────────────
  const revealAnswer = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;

    const q = currentQuestionRef.current;
    if (!q) return;

    const guessed = submittedGuessRef.current;
    if (guessed === null) {
      setFeedback({ message: `Time's up! The correct year was ${q.year}.`, isCorrect: false, points: 0 });
    } else {
      const diff = Math.abs(guessed - q.year);
      const points = Math.max(0, 10 - diff * 2);
      const isCorrect = diff === 0;

      if (points > 0) {
        setScore(s => {
          const newer = s + points;
          channelRef.current?.send({ type: 'broadcast', event: 'score_update', payload: { userId: user.id, newScore: newer } });
          setPlayers(prev => ({ ...prev, [user.id]: { ...prev[user.id], score: newer } }));
          return newer;
        });
      }

      let message;
      if (diff === 0)      message = `Perfect! +10 pts — It was ${q.year}.`;
      else if (points > 0) message = `Close! +${points} pts — The correct year was ${q.year}.`;
      else                 message = `Miss! 0 pts — The correct year was ${q.year}.`;

      setFeedback({ message, isCorrect, points });
    }

    // Show full leaderboard 1s after reveal and stop music
    setTimeout(() => {
      setShowLeaderboard(true);
      ytPlayerRef.current?.stopVideo();
    }, 1000);
  }, [user.id]);

  // Check if all players have submitted → reveal
  const checkAllGuessed = useCallback((newCount) => {
    const total = Object.keys(playersRef.current).length;
    if (total > 0 && newCount >= total) {
      revealAnswer();
    }
  }, [revealAnswer]);

  // Create/recreate YT player when question changes
  useEffect(() => {
    if (!currentQuestion) return;

    const createPlayer = () => {
      if (ytPlayerRef.current) { ytPlayerRef.current.destroy(); ytPlayerRef.current = null; }
      ytPlayerRef.current = new window.YT.Player('yt-player', {
        videoId: currentQuestion.youtubeId,
        playerVars: { autoplay: 1, controls: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.ENDED) revealAnswer();
          }
        }
      });
    };

    if (window.YT && window.YT.Player) createPlayer();
    else window.onYouTubeIframeAPIReady = createPlayer;

    return () => { if (ytPlayerRef.current) { ytPlayerRef.current.destroy(); ytPlayerRef.current = null; } };
  }, [currentQuestion, revealAnswer]);

  // Realtime channel
  useEffect(() => {
    const ch = supabase.channel(`room:${roomCode}`, {
      config: { presence: { key: user.id } }
    });
    channelRef.current = ch;

    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState();
      const onlinePlayers = {};
      Object.keys(state).forEach(key => {
        onlinePlayers[key] = { info: state[key][0], score: 0 };
      });
      setPlayers(prev => {
        for (let k in onlinePlayers) {
          if (prev[k]) onlinePlayers[k].score = prev[k].score;
        }
        return onlinePlayers;
      });
    });

    ch.on('broadcast', { event: 'score_update' }, ({ payload }) => {
      setPlayers(prev => ({
        ...prev,
        [payload.userId]: { ...prev[payload.userId], score: payload.newScore }
      }));
    });

    ch.on('broadcast', { event: 'new_question' }, ({ payload }) => {
      if (payload.round) setRoundNumber(payload.round);
      resetQuestion(payload.song);
    });

    ch.on('broadcast', { event: 'player_guessed' }, ({ payload }) => {
      if (!guessedIdsRef.current.has(payload.userId)) {
        guessedIdsRef.current.add(payload.userId);
        setGuessedCount(prev => {
          const next = prev + 1;
          checkAllGuessed(next);
          return next;
        });
      }
    });

    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const userInfo = { name: profile?.full_name || 'Player', avatar: profile?.avatar_url };
        await ch.track(userInfo);
      }
    });

    setChannel(ch);
    return () => { ch.unsubscribe(); channelRef.current = null; };
  }, [roomCode, user.id, profile, checkAllGuessed]);

  // Timer — stops when feedback is shown (revealed)
  useEffect(() => {
    let timer;
    if (currentQuestion && feedback === null) {
      timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuestion, feedback]);

  // ── Helpers ────────────────────────────────────────────────────
  const resetQuestion = (song) => {
    revealedRef.current = false;
    submittedGuessRef.current = null;
    guessedIdsRef.current = new Set();
    setCurrentQuestion(song);
    setFeedback(null);
    setSubmittedGuess(null);
    setGuess('');
    setElapsedTime(0);
    setGuessedCount(0);
    setShowLeaderboard(false);
  };

  const handleHostNextQuestion = () => {
    let list = hostSongs;
    if (list.length === 0) {
      const allowed = DECADES
        .filter(d => selectedDecades.includes(d.label))
        .flatMap(d => ALL_SONGS.filter(s => s.year >= d.start && s.year <= d.end));
      list = shuffleArray([...allowed]).slice(0, 10);
      setHostSongs(list);
    }
    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);

    if (nextIdx < list.length) {
      const song = list[nextIdx];
      const round = nextIdx + 1;
      channel.send({ type: 'broadcast', event: 'new_question', payload: { song, round } });
      setRoundNumber(round);
      resetQuestion(song);
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess || submittedGuess !== null) return;

    const guessedYear = parseInt(guess);
    submittedGuessRef.current = guessedYear;
    setSubmittedGuess(guessedYear);

    // Broadcast that this player submitted (not the guess value)
    channel.send({ type: 'broadcast', event: 'player_guessed', payload: { userId: user.id } });

    // Count self (own broadcast not received)
    guessedIdsRef.current.add(user.id);
    const next = guessedIdsRef.current.size;
    setGuessedCount(next);
    checkAllGuessed(next);
  };

  if (!channel) return <div className="loading">Connecting to Room...</div>;

  const playerCount = Object.keys(players).length;

  return (
    <div className="glass-card game-card fade-in" style={{ margin: 'auto', marginTop: 'clamp(1rem, 4vh, 3rem)', marginBottom: '1rem', position: 'relative' }}>
      {/* Header */}
      <div className="game-header">
        <div>
          <h2 className="neon-text cyan" style={{ fontSize: 'clamp(0.75rem, 3vw, 1.2rem)', marginBottom: '4px' }}>
            ROOM: {roomCode}
          </h2>
          <p style={{ color: '#aaa', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)' }}>
            Players: {playerCount}/10
          </p>
        </div>
        <button className="logout-btn" onClick={onLeave}>Leave</button>
        {isHost && currentQuestion && (
          <button className="neon-btn" style={{ padding: '0.5rem 1rem', fontSize: 'clamp(0.65rem, 2vw, 0.9rem)' }} onClick={handleHostNextQuestion}>
            NEXT SONG
          </button>
        )}
      </div>

      {/* Body */}
      <div className="game-body">
        <div className="game-main">
          {currentQuestion ? (
            <div className="fade-in">
              <div style={{ marginBottom: '1.25rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', aspectRatio: '16/9', background: '#000' }}>
                <div id="yt-player" style={{ width: '100%', height: '100%' }} />
              </div>

              <div className="song-info">
                <h2 className="song-title">"{currentQuestion.title}"</h2>
                <h3 className="song-artist">by {currentQuestion.artist}</h3>
              </div>

              {!feedback ? (
                <>
                  {submittedGuess === null ? (
                    <form onSubmit={handleGuess} className="guess-form inline">
                      <input
                        type="number"
                        min="1970" max="2024"
                        placeholder="Year"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        className="neon-input year-input"
                      />
                      <span className="neon-text pink" style={{ fontSize: '1.1rem', margin: '0 6px' }}>{elapsedTime}s</span>
                      <button type="submit" className="neon-btn" disabled={!guess}>
                        GUESS
                      </button>
                    </form>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#0ff' }}>
                      <p style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', letterSpacing: '1px' }}>
                        ✓ You guessed <strong>{submittedGuess}</strong> — waiting for others...
                      </p>
                      <p style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', color: '#aaa', marginTop: '0.5rem' }}>
                        {guessedCount}/{playerCount} submitted
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className={`feedback-message ${feedback.isCorrect ? 'correct' : feedback.points > 0 ? 'close' : 'wrong'}`}>
                  {feedback.message}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#ccc' }}>
              {isHost ? (
                <>
                  <p style={{ marginBottom: '0.5rem', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', color: '#aaa', letterSpacing: '2px' }}>
                    SHARE THIS CODE WITH PLAYERS
                  </p>
                  <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontFamily: "'Press Start 2P', cursive", color: '#ffff00', textShadow: '0 0 20px #ffff00, 0 0 40px #ffff00', letterSpacing: '0.2em', margin: '0.5rem 0 1.5rem' }}>
                    {roomCode}
                  </div>
                  <button className="neon-btn" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)', padding: '1rem 2.5rem' }} onClick={handleHostNextQuestion}>
                    START GAME
                  </button>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '0.5rem', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)', color: '#aaa', letterSpacing: '2px' }}>ROOM CODE</p>
                  <div style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontFamily: "'Press Start 2P', cursive", color: '#0ff', textShadow: '0 0 20px #0ff, 0 0 40px #0ff', letterSpacing: '0.2em', margin: '0.5rem 0 1.5rem' }}>
                    {roomCode}
                  </div>
                  <h3 style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>Waiting for Host to start...</h3>
                </>
              )}
            </div>
          )}
        </div>

        {/* Full leaderboard overlay after reveal */}
        {showLeaderboard && (
          <div className="leaderboard-overlay fade-in">
            <button
              onClick={() => setShowLeaderboard(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
            >✕</button>
            {currentQuestion && (
              <div style={{ textAlign: 'center', marginBottom: '1.25rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,255,255,0.2)' }}>
                <p style={{ color: '#aaa', fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', letterSpacing: '2px', marginBottom: '0.3rem' }}>THE ANSWER WAS</p>
                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', color: '#ffff00', textShadow: '0 0 15px #ffff00' }}>{currentQuestion.year}</p>
                <p style={{ color: '#ccc', fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', marginTop: '0.3rem' }}>"{currentQuestion.title}" — {currentQuestion.artist}</p>
              </div>
            )}
            <h2 className="neon-text cyan" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.3rem)', marginBottom: '0.25rem' }}>
              LEADERBOARD
            </h2>
            <p style={{ color: '#aaa', fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', letterSpacing: '2px', marginBottom: '1.25rem' }}>
              ROUND {roundNumber}
            </p>
            {Object.entries(players)
              .sort(([, a], [, b]) => (b.score || 0) - (a.score || 0))
              .map(([playerId, p], i) => (
                <div key={playerId} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.75rem 1rem', marginBottom: '0.5rem',
                  borderRadius: '10px',
                  background: playerId === user.id ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${playerId === user.id ? '#0ff' : '#333'}`,
                }}>
                  <span style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', color: i === 0 ? '#ffff00' : i === 1 ? '#aaa' : i === 2 ? '#cd7f32' : '#555', minWidth: '1.5rem' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <img src={p.info?.avatar} alt="avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1px solid #444' }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)' }}>
                      {p.info?.name}{playerId === user.id ? ' (you)' : ''}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', color: '#0ff', textShadow: '0 0 8px #0ff' }}>
                    {p.score || 0} pts
                  </div>
                </div>
              ))}
            {isHost && (
              <button className="neon-btn full-width" style={{ marginTop: '1.25rem' }} onClick={handleHostNextQuestion}>
                NEXT SONG →
              </button>
            )}
          </div>
        )}

        {/* Sidebar leaderboard */}
        <div className="game-sidebar">
          <h3 className="neon-text magenta" style={{ fontSize: 'clamp(0.65rem, 2vw, 1rem)', marginBottom: '0.5rem' }}>LEADERBOARD</h3>
          {Object.entries(players)
            .sort(([, a], [, b]) => (b.score || 0) - (a.score || 0))
            .map(([playerId, p]) => (
              <div key={playerId} className="player-row">
                <img
                  src={p.info?.avatar}
                  alt="avatar"
                  className="player-avatar"
                  style={{ border: playerId === user.id ? '2px solid lime' : '1px solid gray', opacity: guessedIdsRef.current.has(playerId) && !feedback ? 0.5 : 1 }}
                />
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.65rem, 2vw, 0.85rem)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.info?.name} {isHost && playerId === user.id ? '👑' : ''}
                    {guessedIdsRef.current.has(playerId) && !feedback ? ' ✓' : ''}
                  </div>
                  <div className="neon-text cyan" style={{ fontSize: '0.75rem' }}>
                    Score: {p.score || 0}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
