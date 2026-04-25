import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './lib/supabase';
import { DECADES } from './DecadeSelect';

const ALL_SONGS = [
  // ── 70s ──────────────────────────────────────────────────────────
  { title: "Bohemian Rhapsody", artist: "Queen", year: 1975, youtubeId: "fJ9rUzIMcZQ" },
  { title: "Dancing Queen", artist: "ABBA", year: 1976, youtubeId: "xFrGuyw1V8s" },
  { title: "Hotel California", artist: "Eagles", year: 1977, youtubeId: "09839DpTctU" },
  { title: "Stayin' Alive", artist: "Bee Gees", year: 1977, youtubeId: "I_izvAbhExY" },
  { title: "September", artist: "Earth, Wind & Fire", year: 1978, youtubeId: "Gs069dndIYk" },
  { title: "Don't Stop Me Now", artist: "Queen", year: 1978, youtubeId: "HgzGwKwLmgM" },
  { title: "Ring My Bell", artist: "Anita Ward", year: 1979, youtubeId: "AvEcIeWhjyU" },
  { title: "Heart of Glass", artist: "Blondie", year: 1979, youtubeId: "WGU_4-5RaxU" },
  { title: "Piano Man", artist: "Billy Joel", year: 1973, youtubeId: "gxEPV4kolz0" },
  { title: "American Pie", artist: "Don McLean", year: 1971, youtubeId: "PRpiBpDy7MQ" },
  { title: "Rocket Man", artist: "Elton John", year: 1972, youtubeId: "DtVBCG6ThDk" },
  { title: "Tiny Dancer", artist: "Elton John", year: 1971, youtubeId: "yYcyacLRPNs" },
  { title: "Crocodile Rock", artist: "Elton John", year: 1972, youtubeId: "JrpI7WbJcO8" },
  { title: "Dreams", artist: "Fleetwood Mac", year: 1977, youtubeId: "mrZRURcb1cM" },
  { title: "Go Your Own Way", artist: "Fleetwood Mac", year: 1977, youtubeId: "6ul-cZyuYq4" },
  { title: "Don't Stop", artist: "Fleetwood Mac", year: 1977, youtubeId: "QV9JJmSCiI8" },
  { title: "Heroes", artist: "David Bowie", year: 1977, youtubeId: "bsYp9q3QNaQ" },
  { title: "More Than a Feeling", artist: "Boston", year: 1976, youtubeId: "t4QK8RxCAwo" },
  { title: "Dream On", artist: "Aerosmith", year: 1973, youtubeId: "sZfZ8uWaOFI" },
  { title: "Walk This Way", artist: "Aerosmith", year: 1975, youtubeId: "bKttENbsoyk" },
  { title: "Stairway to Heaven", artist: "Led Zeppelin", year: 1971, youtubeId: "QkF3oxziUI4" },
  { title: "Kashmir", artist: "Led Zeppelin", year: 1975, youtubeId: "hW_WLxseq0o" },
  { title: "Smoke on the Water", artist: "Deep Purple", year: 1972, youtubeId: "Q2FzZSBD5LE" },
  { title: "Superstition", artist: "Stevie Wonder", year: 1972, youtubeId: "ftdZ363R9kQ" },
  { title: "We Will Rock You", artist: "Queen", year: 1977, youtubeId: "-tJYN-eG1zk" },
  { title: "Killer Queen", artist: "Queen", year: 1974, youtubeId: "2ZBtPf7FOoM" },
  { title: "We Are the Champions", artist: "Queen", year: 1977, youtubeId: "04854XqcfCY" },
  { title: "Baker Street", artist: "Gerry Rafferty", year: 1978, youtubeId: "Fo6aKnRnBxM" },
  { title: "Roxanne", artist: "The Police", year: 1978, youtubeId: "3T1c7GkzRQQ" },
  { title: "Night Fever", artist: "Bee Gees", year: 1977, youtubeId: "-ihs-vT9T3Q" },
  { title: "I Will Survive", artist: "Gloria Gaynor", year: 1978, youtubeId: "gYkACVDFmeg" },
  { title: "YMCA", artist: "Village People", year: 1978, youtubeId: "CS9OO0S5w2k" },
  { title: "Funkytown", artist: "Lipps Inc", year: 1979, youtubeId: "Z_0l3rCgW1c" },
  { title: "Waterloo", artist: "ABBA", year: 1974, youtubeId: "Sj_9CiNkkn4" },
  { title: "Fernando", artist: "ABBA", year: 1976, youtubeId: "dQsjAbZDx-4" },
  { title: "Money", artist: "Pink Floyd", year: 1973, youtubeId: "-0kcet4aPpQ" },
  { title: "Wish You Were Here", artist: "Pink Floyd", year: 1975, youtubeId: "IXdNnw99-Ic" },
  { title: "Paranoid", artist: "Black Sabbath", year: 1970, youtubeId: "hkXHsK4AQPs" },
  { title: "Born to Run", artist: "Bruce Springsteen", year: 1975, youtubeId: "IxuThNgl3YA" },
  { title: "Sultans of Swing", artist: "Dire Straits", year: 1978, youtubeId: "0fAQhSRLQnM" },
  { title: "Heart of Gold", artist: "Neil Young", year: 1972, youtubeId: "c7eB7Wns1-M" },
  { title: "Rapper's Delight", artist: "Sugarhill Gang", year: 1979, youtubeId: "mcCK99wHrk0" },
  { title: "Disco Inferno", artist: "The Trammps", year: 1976, youtubeId: "wbFgH0mHw3w" },
  { title: "You're So Vain", artist: "Carly Simon", year: 1972, youtubeId: "cleCtBP0o5Y" },
  { title: "Le Freak", artist: "Chic", year: 1978, youtubeId: "aXgSHL7efKg" },
  { title: "Can't Get Enough of Your Love, Babe", artist: "Barry White", year: 1974, youtubeId: "x0I6mhZ5wMw" },
  { title: "Imagine", artist: "John Lennon", year: 1971, youtubeId: "YkgkThdzX-8" },
  { title: "Let It Be", artist: "The Beatles", year: 1970, youtubeId: "QDYfEBY9NM4" },
  { title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel", year: 1970, youtubeId: "4G-YQA_bsOU" },
  { title: "Let's Get It On", artist: "Marvin Gaye", year: 1973, youtubeId: "x6QZn9xiuOE" },
  { title: "Jolene", artist: "Dolly Parton", year: 1973, youtubeId: "Ixrje2rXLMA" },
  { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", year: 1974, youtubeId: "ye5BuYf8q4o" },
  { title: "Rebel Rebel", artist: "David Bowie", year: 1974, youtubeId: "U16Xg_rQZkA" },
  { title: "ABC", artist: "The Jackson 5", year: 1970, youtubeId: "ho7796-au8U" },
  { title: "Lean on Me", artist: "Bill Withers", year: 1972, youtubeId: "fOZ-MySzAac" },
  { title: "Bennie and the Jets", artist: "Elton John", year: 1974, youtubeId: "p5rQHoaQpTw" },
  { title: "Mamma Mia", artist: "ABBA", year: 1975, youtubeId: "unfzfe8f9NI" },
  { title: "Play That Funky Music", artist: "Wild Cherry", year: 1976, youtubeId: "BHcYFxU4fMo" },
  { title: "How Deep Is Your Love", artist: "Bee Gees", year: 1977, youtubeId: "XpqqjU7u5Yc" },
  { title: "Just the Way You Are", artist: "Billy Joel", year: 1977, youtubeId: "HaA3YZ6QdJU" },
  { title: "Good Times", artist: "Chic", year: 1979, youtubeId: "51r5f5OdIY0" },
  { title: "Tragedy", artist: "Bee Gees", year: 1979, youtubeId: "I248-SyRDnU" },
  { title: "Hot Stuff", artist: "Donna Summer", year: 1979, youtubeId: "1IdEhvuNxV8" },
  { title: "Macho Man", artist: "Village People", year: 1978, youtubeId: "AO43p2Wqc08" },

  // ── 80s ──────────────────────────────────────────────────────────
  { title: "Another One Bites the Dust", artist: "Queen", year: 1980, youtubeId: "rY0WxgSXdEE" },
  { title: "Don't You Want Me", artist: "The Human League", year: 1981, youtubeId: "uPudE8nDog0" },
  { title: "Tainted Love", artist: "Soft Cell", year: 1981, youtubeId: "XZVpR3Pk-r8" },
  { title: "Thriller", artist: "Michael Jackson", year: 1982, youtubeId: "sOnqjkJTMaA" },
  { title: "Every Breath You Take", artist: "The Police", year: 1983, youtubeId: "OMOGaugKpzs" },
  { title: "Billie Jean", artist: "Michael Jackson", year: 1983, youtubeId: "Zi_XLOBDo_Y" },
  { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics", year: 1983, youtubeId: "qeMFqkcPYcg" },
  { title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", year: 1983, youtubeId: "PIb6AZdTr-A" },
  { title: "When Doves Cry", artist: "Prince", year: 1984, youtubeId: "UG3VcCAlUgE" },
  { title: "Careless Whisper", artist: "George Michael", year: 1984, youtubeId: "izGwDsrQ1eQ" },
  { title: "Take On Me", artist: "a-ha", year: 1985, youtubeId: "djV11Xbc914" },
  { title: "Livin' on a Prayer", artist: "Bon Jovi", year: 1986, youtubeId: "lDK9QqIzhwk" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987, youtubeId: "1w7OgIMMRc4" },
  { title: "Like a Prayer", artist: "Madonna", year: 1989, youtubeId: "79fzeNUqQbQ" },
  { title: "Eye of the Tiger", artist: "Survivor", year: 1982, youtubeId: "btPJPFnesV4" },
  { title: "Don't Stop Believin'", artist: "Journey", year: 1981, youtubeId: "1k8craCGpgs" },
  { title: "Africa", artist: "Toto", year: 1982, youtubeId: "FTQbiNvZqaY" },
  { title: "Jump", artist: "Van Halen", year: 1984, youtubeId: "SwYN7mTi6HM" },
  { title: "Purple Rain", artist: "Prince", year: 1984, youtubeId: "TvnYmWpD_T8" },
  { title: "Wake Me Up Before You Go-Go", artist: "Wham!", year: 1984, youtubeId: "pIgZ7gMze7A" },
  { title: "Material Girl", artist: "Madonna", year: 1984, youtubeId: "6p-lDYPR2P8" },
  { title: "Time After Time", artist: "Cyndi Lauper", year: 1983, youtubeId: "VdQY7BusJNU" },
  { title: "True Colors", artist: "Cyndi Lauper", year: 1986, youtubeId: "LPn0KFlbqX8" },
  { title: "Walk Like an Egyptian", artist: "The Bangles", year: 1986, youtubeId: "Cv6tuzHUuuk" },
  { title: "99 Luftballons", artist: "Nena", year: 1983, youtubeId: "AT_0zXw2rRo" },
  { title: "Let's Dance", artist: "David Bowie", year: 1983, youtubeId: "VbD_kBJc_gI" },
  { title: "Blue Monday", artist: "New Order", year: 1983, youtubeId: "9GMjH1nR0ds" },
  { title: "Come On Eileen", artist: "Dexys Midnight Runners", year: 1982, youtubeId: "oc-P8oDuS0Q" },
  { title: "Should I Stay or Should I Go", artist: "The Clash", year: 1982, youtubeId: "BN1WwnEDWAM" },
  { title: "Don't You (Forget About Me)", artist: "Simple Minds", year: 1985, youtubeId: "CdqoNKCCt7A" },
  { title: "Under Pressure", artist: "Queen & David Bowie", year: 1981, youtubeId: "a01QQZyl-_I" },
  { title: "I Love Rock 'n' Roll", artist: "Joan Jett", year: 1981, youtubeId: "wMsazR6Tnf8" },
  { title: "Total Eclipse of the Heart", artist: "Bonnie Tyler", year: 1983, youtubeId: "lcOxhH8N3Bo" },
  { title: "With or Without You", artist: "U2", year: 1987, youtubeId: "ujNeHIo7oTE" },
  { title: "Personal Jesus", artist: "Depeche Mode", year: 1989, youtubeId: "u1xrNaTO1bI" },
  { title: "Don't Dream It's Over", artist: "Crowded House", year: 1986, youtubeId: "J9gKyRmic20" },
  { title: "La Bamba", artist: "Los Lobos", year: 1987, youtubeId: "nLAWPrCUQQ0" },
  { title: "Running Up That Hill", artist: "Kate Bush", year: 1985, youtubeId: "wp43OdtAAkM" },
  { title: "Footloose", artist: "Kenny Loggins", year: 1984, youtubeId: "ltrMfT4Qz5Y" },
  { title: "Faith", artist: "George Michael", year: 1987, youtubeId: "6Cs3Pvmmv0E" },
  { title: "West End Girls", artist: "Pet Shop Boys", year: 1985, youtubeId: "p3j2NYZ8FKs" },
  { title: "Push It", artist: "Salt-N-Pepa", year: 1987, youtubeId: "vCadcBR95oU" },
  { title: "Every Little Thing She Does Is Magic", artist: "The Police", year: 1981, youtubeId: "aENX1Sf3fgQ" },
  { title: "Born in the U.S.A.", artist: "Bruce Springsteen", year: 1984, youtubeId: "EPhWR4d3FJQ" },
  { title: "Call Me", artist: "Blondie", year: 1980, youtubeId: "StKVS0eI85I" },
  { title: "Celebration", artist: "Kool & the Gang", year: 1980, youtubeId: "3GwjfUFyY6M" },
  { title: "Physical", artist: "Olivia Newton-John", year: 1981, youtubeId: "vWz9VN40nCA" },
  { title: "Jack & Diane", artist: "John Mellencamp", year: 1982, youtubeId: "h04CH9YZcpI" },
  { title: "Beat It", artist: "Michael Jackson", year: 1983, youtubeId: "oRdxUFDoQe0" },
  { title: "Flashdance... What a Feeling", artist: "Irene Cara", year: 1983, youtubeId: "miax0Jpe5mA" },
  { title: "Karma Chameleon", artist: "Culture Club", year: 1983, youtubeId: "JmcA9LIIXWw" },
  { title: "Like a Virgin", artist: "Madonna", year: 1984, youtubeId: "s__rX_WL100" },
  { title: "I Want to Know What Love Is", artist: "Foreigner", year: 1984, youtubeId: "r3Pr1_v7hsw" },
  { title: "Addicted to Love", artist: "Robert Palmer", year: 1986, youtubeId: "XcATvu5f9vE" },
  { title: "Sledgehammer", artist: "Peter Gabriel", year: 1986, youtubeId: "OJWJE0x7T4Q" },
  { title: "I Wanna Dance with Somebody", artist: "Whitney Houston", year: 1987, youtubeId: "eH3giaIzONA" },
  { title: "Never Gonna Give You Up", artist: "Rick Astley", year: 1987, youtubeId: "dQw4w9WgXcQ" },
  { title: "Every Rose Has Its Thorn", artist: "Poison", year: 1988, youtubeId: "jhat-xUQ6dw" },
  { title: "Straight Up", artist: "Paula Abdul", year: 1988, youtubeId: "El1kgCqD7Xk" },
  { title: "Love Shack", artist: "The B-52's", year: 1989, youtubeId: "9SOryJvTAGs" },
  { title: "Pump Up the Jam", artist: "Technotronic", year: 1989, youtubeId: "9EcjWd-O4jI" },
  { title: "Free Fallin'", artist: "Tom Petty", year: 1989, youtubeId: "1lWJXDG2i0A" },
  { title: "Into the Groove", artist: "Madonna", year: 1985, youtubeId: "52iW3lcpK5M" },
  { title: "Danger Zone", artist: "Kenny Loggins", year: 1986, youtubeId: "siwpn14IE7E" },

  // ── 90s ──────────────────────────────────────────────────────────
  { title: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991, youtubeId: "hTWKbfoikeg" },
  { title: "Losing My Religion", artist: "R.E.M.", year: 1991, youtubeId: "xwtdhWltSIg" },
  { title: "Creep", artist: "Radiohead", year: 1992, youtubeId: "zFYEYRcjK2g" },
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
  { title: "Killing Me Softly", artist: "Fugees", year: 1996, youtubeId: "oKOtzIo-uYw" },
  { title: "No Scrubs", artist: "TLC", year: 1999, youtubeId: "FrLequ6dUdM" },
  { title: "Say My Name", artist: "Destiny's Child", year: 1999, youtubeId: "sQgd6MccwZc" },
  { title: "Genie in a Bottle", artist: "Christina Aguilera", year: 1999, youtubeId: "kIDWgqDBNXA" },
  { title: "Mambo No. 5", artist: "Lou Bega", year: 1999, youtubeId: "EK_LN3XEcnw" },
  { title: "Smooth", artist: "Santana ft. Rob Thomas", year: 1999, youtubeId: "6Whgn_iE5uc" },
  { title: "Iris", artist: "Goo Goo Dolls", year: 1998, youtubeId: "NdYWuo9OFAw" },
  { title: "I Don't Want to Miss a Thing", artist: "Aerosmith", year: 1998, youtubeId: "JkK8g6FMEXE" },
  { title: "Everybody (Backstreet's Back)", artist: "Backstreet Boys", year: 1997, youtubeId: "6M6samPEMpM" },
  { title: "Wannabe", artist: "Spice Girls", year: 1996, youtubeId: "gJLIiF15wjQ" },
  { title: "Don't Speak", artist: "No Doubt", year: 1996, youtubeId: "TR3Vdo5etCQ" },
  { title: "Ironic", artist: "Alanis Morissette", year: 1995, youtubeId: "Jne9t8sHpUc" },
  { title: "Zombie", artist: "The Cranberries", year: 1994, youtubeId: "6Ejga4kJUts" },
  { title: "Bitter Sweet Symphony", artist: "The Verve", year: 1997, youtubeId: "1lyu1KKwC74" },
  { title: "Blue (Da Ba Dee)", artist: "Eiffel 65", year: 1998, youtubeId: "zA52uNzx7Y4" },
  { title: "Believe", artist: "Cher", year: 1998, youtubeId: "nZXRV4MezEw" },
  { title: "Torn", artist: "Natalie Imbruglia", year: 1997, youtubeId: "VV1XWJN3nJo" },
  { title: "One", artist: "U2", year: 1992, youtubeId: "ftjEcrrf7r0" },
  { title: "Under the Bridge", artist: "Red Hot Chili Peppers", year: 1992, youtubeId: "GLvohMXgcBo" },
  { title: "Return of the Mack", artist: "Mark Morrison", year: 1996, youtubeId: "uB1D9wWxd2w" },
  { title: "Semi-Charmed Life", artist: "Third Eye Blind", year: 1997, youtubeId: "MyjTrwOMSO4" },
  { title: "I'm Too Sexy", artist: "Right Said Fred", year: 1991, youtubeId: "P5mtclwloEQ" },
  { title: "Nothing Compares 2 U", artist: "Sinead O'Connor", year: 1990, youtubeId: "0-EF60neguk" },
  { title: "Vogue", artist: "Madonna", year: 1990, youtubeId: "GuJQSAiODqI" },
  { title: "(Everything I Do) I Do It for You", artist: "Bryan Adams", year: 1991, youtubeId: "Y0pdQU87dc8" },
  { title: "Baby Got Back", artist: "Sir Mix-a-Lot", year: 1992, youtubeId: "X53ZSxkQ3Ho" },
  { title: "I Will Always Love You", artist: "Whitney Houston", year: 1992, youtubeId: "3JWTaaS7LdU" },
  { title: "Dreamlover", artist: "Mariah Carey", year: 1993, youtubeId: "CqBtS6BIP1E" },
  { title: "The Sign", artist: "Ace of Base", year: 1993, youtubeId: "iqu132vTl5Y" },
  { title: "Fantasy", artist: "Mariah Carey", year: 1995, youtubeId: "qq09UkPRdFY" },
  { title: "Macarena", artist: "Los Del Rio", year: 1996, youtubeId: "zWaymcVmJ-A" },
  { title: "Candle in the Wind 1997", artist: "Elton John", year: 1997, youtubeId: "NoOhnrjdYOc" },
  { title: "The Boy Is Mine", artist: "Brandy & Monica", year: 1998, youtubeId: "qSIOp_K5GMw" },
  { title: "My Heart Will Go On", artist: "Celine Dion", year: 1997, youtubeId: "9bFHsd3o1w0" },
  { title: "Truly Madly Deeply", artist: "Savage Garden", year: 1997, youtubeId: "WQnAxOQxQIU" },
  { title: "All Star", artist: "Smash Mouth", year: 1999, youtubeId: "L_jWHffIx5E" },
  { title: "I Want It That Way", artist: "Backstreet Boys", year: 1999, youtubeId: "4fndeDfaWCg" },
  { title: "U Can't Touch This", artist: "MC Hammer", year: 1990, youtubeId: "_NNYI8VbFyY" },
  { title: "Loser", artist: "Beck", year: 1993, youtubeId: "YgSPaXgAdzE" },
  { title: "Song 2", artist: "Blur", year: 1997, youtubeId: "SSbBvKaM6sk" },

  // ── 2000s ─────────────────────────────────────────────────────────
  { title: "Crazy in Love", artist: "Beyoncé", year: 2003, youtubeId: "ViwtNLUqkMY" },
  { title: "Hey Ya!", artist: "OutKast", year: 2003, youtubeId: "PWgvGjAhvIw" },
  { title: "Yeah!", artist: "Usher", year: 2004, youtubeId: "GxBSyx85Kp8" },
  { title: "Since U Been Gone", artist: "Kelly Clarkson", year: 2004, youtubeId: "R7UrFYvl5TE" },
  { title: "Crazy", artist: "Gnarls Barkley", year: 2006, youtubeId: "bd2B6SjMh_w" },
  { title: "Umbrella", artist: "Rihanna", year: 2007, youtubeId: "CvBfHwUxHIk" },
  { title: "Single Ladies", artist: "Beyoncé", year: 2008, youtubeId: "4m1EFMoRFvY" },
  { title: "Poker Face", artist: "Lady Gaga", year: 2008, youtubeId: "bESGLojNYSo" },
  { title: "In Da Club", artist: "50 Cent", year: 2003, youtubeId: "5qm8PH4xAss" },
  { title: "Numb", artist: "Linkin Park", year: 2003, youtubeId: "kXYiU_JCYtU" },
  { title: "Boulevard of Broken Dreams", artist: "Green Day", year: 2004, youtubeId: "Soa3gO7tL-c" },
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
  { title: "SOS", artist: "Rihanna", year: 2006, youtubeId: "IXmF4GbA86E" },
  { title: "Irreplaceable", artist: "Beyoncé", year: 2006, youtubeId: "2EwViQxSJJQ" },
  { title: "Hips Don't Lie", artist: "Shakira", year: 2005, youtubeId: "DUT5rEU6pqM" },
  { title: "Hollaback Girl", artist: "Gwen Stefani", year: 2004, youtubeId: "Kgjkth6BRRY" },
  { title: "I Gotta Feeling", artist: "Black Eyed Peas", year: 2009, youtubeId: "uSD4vsh1zDA" },
  { title: "Tik Tok", artist: "Ke$ha", year: 2009, youtubeId: "iP6XpLQM2Cs" },
  { title: "How to Save a Life", artist: "The Fray", year: 2005, youtubeId: "cjVQ36NhbMk" },
  { title: "Take Me Out", artist: "Franz Ferdinand", year: 2004, youtubeId: "Ijk4j-r7qPA" },
  { title: "Hot N Cold", artist: "Katy Perry", year: 2008, youtubeId: "kTHNpusq654" },
  { title: "I Kissed a Girl", artist: "Katy Perry", year: 2008, youtubeId: "tAp9BKosZXs" },
  { title: "Apologize", artist: "Timbaland ft. OneRepublic", year: 2007, youtubeId: "ZSM3w1v-A_Y" },
  { title: "Low", artist: "Flo Rida", year: 2007, youtubeId: "3VVuMIB2hC0" },
  { title: "Party in the U.S.A.", artist: "Miley Cyrus", year: 2009, youtubeId: "M11SvDtPBhA" },
  { title: "Beautiful Girls", artist: "Sean Kingston", year: 2007, youtubeId: "MrTz5xjmso4" },
  { title: "Oops!... I Did It Again", artist: "Britney Spears", year: 2000, youtubeId: "CduA0TULnow" },
  { title: "Bye Bye Bye", artist: "*NSYNC", year: 2000, youtubeId: "Eo-KmOd3i7s" },
  { title: "It's My Life", artist: "Bon Jovi", year: 2000, youtubeId: "vx2u5uUu3DE" },
  { title: "Yellow", artist: "Coldplay", year: 2000, youtubeId: "yKNxeF4KMsY" },
  { title: "Fallin'", artist: "Alicia Keys", year: 2001, youtubeId: "Urdlvw0SSEc" },
  { title: "How You Remind Me", artist: "Nickelback", year: 2001, youtubeId: "1cQh1ccqu8M" },
  { title: "Hot in Herre", artist: "Nelly", year: 2002, youtubeId: "GeZZr_p6vB8" },
  { title: "Dilemma", artist: "Nelly ft. Kelly Rowland", year: 2002, youtubeId: "8WYHDfJDPDc" },
  { title: "Toxic", artist: "Britney Spears", year: 2003, youtubeId: "LOZuxwVk7TU" },
  { title: "Drop It Like It's Hot", artist: "Snoop Dogg", year: 2004, youtubeId: "GtUVQei3nX4" },
  { title: "Gold Digger", artist: "Kanye West", year: 2005, youtubeId: "6vwNcNOTVzY" },
  { title: "We Belong Together", artist: "Mariah Carey", year: 2005, youtubeId: "0habxsuXW4g" },
  { title: "Bad Day", artist: "Daniel Powter", year: 2005, youtubeId: "gH476CxJxfg" },
  { title: "Promiscuous", artist: "Nelly Furtado", year: 2006, youtubeId: "0J3vgcE5i2o" },
  { title: "Buy U a Drank", artist: "T-Pain", year: 2007, youtubeId: "dBrRBZy8OTs" },
  { title: "Crank That (Soulja Boy)", artist: "Soulja Boy", year: 2007, youtubeId: "8UFIYGkROII" },
  { title: "Viva La Vida", artist: "Coldplay", year: 2008, youtubeId: "dvgZkm1xWPE" },
  { title: "I'm Yours", artist: "Jason Mraz", year: 2008, youtubeId: "EkHTsc9PU2A" },
  { title: "Just Dance", artist: "Lady Gaga", year: 2008, youtubeId: "2Abk1jAONjw" },
  { title: "Boom Boom Pow", artist: "Black Eyed Peas", year: 2009, youtubeId: "4m48GqaOz90" },

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
  { title: "Get Lucky", artist: "Daft Punk", year: 2013, youtubeId: "5NV6Rdv1a3I" },
  { title: "Roar", artist: "Katy Perry", year: 2013, youtubeId: "CevxZvSJLk8" },
  { title: "Counting Stars", artist: "OneRepublic", year: 2013, youtubeId: "hT_nvWreIhg" },
  { title: "Shake It Off", artist: "Taylor Swift", year: 2014, youtubeId: "nfWlot6h_JM" },
  { title: "Blank Space", artist: "Taylor Swift", year: 2014, youtubeId: "e-ORhEE9VVg" },
  { title: "Hello", artist: "Adele", year: 2015, youtubeId: "YQHsXMglC9A" },
  { title: "Love Yourself", artist: "Justin Bieber", year: 2015, youtubeId: "oyEuk8j8imI" },
  { title: "Sorry", artist: "Justin Bieber", year: 2015, youtubeId: "fRh_vgS2dFE" },
  { title: "Work", artist: "Rihanna", year: 2016, youtubeId: "HL1UzIK-flA" },
  { title: "One Dance", artist: "Drake", year: 2016, youtubeId: "vcer12OFU2g" },
  { title: "7 Years", artist: "Lukas Graham", year: 2015, youtubeId: "LHCob76kigA" },
  { title: "Closer", artist: "The Chainsmokers ft. Halsey", year: 2016, youtubeId: "PT2_F-1esPk" },
  { title: "Stressed Out", artist: "Twenty One Pilots", year: 2015, youtubeId: "pXRviuL6vMY" },
  { title: "Cheap Thrills", artist: "Sia", year: 2016, youtubeId: "nYh-n7EOtMA" },
  { title: "Havana", artist: "Camila Cabello", year: 2017, youtubeId: "HCjNJDNzw8Y" },
  { title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", year: 2017, youtubeId: "kJQP7kiw5Fk" },
  { title: "Perfect", artist: "Ed Sheeran", year: 2017, youtubeId: "2Vv-BfVoq4g" },
  { title: "God's Plan", artist: "Drake", year: 2018, youtubeId: "xpVfcZ0ZcFM" },
  { title: "Shallow", artist: "Lady Gaga & Bradley Cooper", year: 2018, youtubeId: "bo_efYhYU2A" },
  { title: "Sunflower", artist: "Post Malone & Swae Lee", year: 2018, youtubeId: "ApXoWvfEYVU" },
  { title: "Thank U, Next", artist: "Ariana Grande", year: 2018, youtubeId: "gl1aHhXnN1k" },
  { title: "7 Rings", artist: "Ariana Grande", year: 2019, youtubeId: "QYh6mYIJG2Y" },
  { title: "Someone You Loved", artist: "Lewis Capaldi", year: 2018, youtubeId: "zABLecsR5UE" },
  { title: "Senorita", artist: "Shawn Mendes & Camila Cabello", year: 2019, youtubeId: "Pkh8UtuejGw" },
  { title: "Without Me", artist: "Halsey", year: 2018, youtubeId: "ZAfAud_M_mg" },
  { title: "Blinding Lights", artist: "The Weeknd", year: 2019, youtubeId: "4NRXx6U8ABQ" },
  { title: "Just the Way You Are", artist: "Bruno Mars", year: 2010, youtubeId: "LjhCEhWiKXk" },
  { title: "Firework", artist: "Katy Perry", year: 2010, youtubeId: "QGJuMBdaqIw" },
  { title: "Somebody That I Used to Know", artist: "Gotye", year: 2011, youtubeId: "8UVNT4wvIGY" },
  { title: "Party Rock Anthem", artist: "LMFAO", year: 2011, youtubeId: "KQ6zr6kCPj8" },
  { title: "We Found Love", artist: "Rihanna", year: 2011, youtubeId: "tg00YEETFzg" },
  { title: "Thrift Shop", artist: "Macklemore & Ryan Lewis", year: 2012, youtubeId: "QK8mJJJvaes" },
  { title: "Radioactive", artist: "Imagine Dragons", year: 2012, youtubeId: "ktvTqknDobU" },
  { title: "Diamonds", artist: "Rihanna", year: 2012, youtubeId: "lWA2pjMjpBs" },
  { title: "Wrecking Ball", artist: "Miley Cyrus", year: 2013, youtubeId: "My2FRPA3Gf8" },
  { title: "Dark Horse", artist: "Katy Perry", year: 2013, youtubeId: "0KSOMA3QBU0" },
  { title: "All of Me", artist: "John Legend", year: 2013, youtubeId: "450p7goxZqg" },
  { title: "Let It Go", artist: "Idina Menzel", year: 2013, youtubeId: "L0MK7qz13bU" },
  { title: "Take Me to Church", artist: "Hozier", year: 2013, youtubeId: "PVjiKRfKpPI" },
  { title: "Stay with Me", artist: "Sam Smith", year: 2014, youtubeId: "pB-5XG-DbAA" },
  { title: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", year: 2015, youtubeId: "RgKAFK5djSk" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", year: 2014, youtubeId: "lp-EO5I60KA" },
  { title: "Can't Feel My Face", artist: "The Weeknd", year: 2015, youtubeId: "KEI4qSrkPAs" },
  { title: "The Hills", artist: "The Weeknd", year: 2015, youtubeId: "yzTuBuRdAyA" },
  { title: "Starboy", artist: "The Weeknd", year: 2016, youtubeId: "34Na4j8AVgA" },
  { title: "That's What I Like", artist: "Bruno Mars", year: 2017, youtubeId: "PMivT7MJ41M" },

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
  { title: "About Damn Time", artist: "Lizzo", year: 2022, youtubeId: "IXXxciRUMzE" },
  { title: "Anti-Hero", artist: "Taylor Swift", year: 2022, youtubeId: "b1kbLwvqugk" },
  { title: "Unholy", artist: "Sam Smith & Kim Petras", year: 2022, youtubeId: "Uq9gPaIzbe8" },
  { title: "Kill Bill", artist: "SZA", year: 2022, youtubeId: "MSRcC626prw" },
  { title: "Bad Habit", artist: "Steve Lacy", year: 2022, youtubeId: "VF-FGf_ZZiI" },
  { title: "Montero (Call Me By Your Name)", artist: "Lil Nas X", year: 2021, youtubeId: "6swmTBVI83k" },
  { title: "Peaches", artist: "Justin Bieber", year: 2021, youtubeId: "tQ0yjYUFKAE" },
  { title: "Vampire", artist: "Olivia Rodrigo", year: 2023, youtubeId: "RlPNh_PBZb4" },
  { title: "Calm Down", artist: "Rema & Selena Gomez", year: 2022, youtubeId: "WcIcVapfqXw" },
  { title: "Industry Baby", artist: "Lil Nas X", year: 2021, youtubeId: "UTHLKHL_whs" },
  { title: "Escapism.", artist: "RAYE ft. 070 Shake", year: 2022, youtubeId: "XGLCOAgeENk" },
  { title: "Say So", artist: "Doja Cat", year: 2020, youtubeId: "pok8H_KF1FA" },
  { title: "Watermelon Sugar", artist: "Harry Styles", year: 2020, youtubeId: "E07s5ZYygMg" },
  { title: "Rockstar", artist: "DaBaby ft. Roddy Ricch", year: 2020, youtubeId: "Qmzv7BEfFfo" },
  { title: "Mood", artist: "24kGoldn", year: 2020, youtubeId: "GrAchTdepsU" },
  { title: "WAP", artist: "Cardi B ft. Megan Thee Stallion", year: 2020, youtubeId: "hsm4poTWjMs" },
  { title: "Positions", artist: "Ariana Grande", year: 2020, youtubeId: "tcYodQoapMg" },
  { title: "Kiss Me More", artist: "Doja Cat ft. SZA", year: 2021, youtubeId: "0EVVKs6DQLo" },
  { title: "Leave the Door Open", artist: "Silk Sonic", year: 2021, youtubeId: "adLGHcj_fmA" },
  { title: "Save Your Tears", artist: "The Weeknd", year: 2020, youtubeId: "XXYlFuWEuKI" },
  { title: "Super Freaky Girl", artist: "Nicki Minaj", year: 2022, youtubeId: "j5uAR9w7LBg" },
  { title: "First Class", artist: "Jack Harlow", year: 2022, youtubeId: "yQBImEeXNZ4" },
  { title: "Wait for U", artist: "Future ft. Drake", year: 2022, youtubeId: "rP09GUQFDFk" },
  { title: "Rich Flex", artist: "Drake & 21 Savage", year: 2022, youtubeId: "PrSBuEFdRFU" },
  { title: "Last Night", artist: "Morgan Wallen", year: 2023, youtubeId: "bUjPPBxbQrQ" },
  { title: "Paint the Town Red", artist: "Doja Cat", year: 2023, youtubeId: "m4_9TFeMfJE" },
  { title: "Cruel Summer", artist: "Taylor Swift", year: 2023, youtubeId: "ic8j13piAhQ" },
  { title: "I Remember Everything", artist: "Zach Bryan ft. Kacey Musgraves", year: 2023, youtubeId: "LKhuGoipoag" },
  { title: "Fast Car", artist: "Luke Combs", year: 2023, youtubeId: "Fr7oYjnt3bM" },
  { title: "Lovin On Me", artist: "Jack Harlow", year: 2023, youtubeId: "Iq8h3GEe22o" },
  { title: "Texas Hold 'Em", artist: "Beyoncé", year: 2024, youtubeId: "jCOX8dT9q8M" },
  { title: "Lose Control", artist: "Teddy Swims", year: 2023, youtubeId: "GZ3zL7kT6_c" },
  { title: "Beautiful Things", artist: "Benson Boone", year: 2024, youtubeId: "Oa_RSwwpPaA" },
  { title: "Espresso", artist: "Sabrina Carpenter", year: 2024, youtubeId: "eVli-tstM5E" },
  { title: "A Bar Song (Tipsy)", artist: "Shaboozey", year: 2024, youtubeId: "t7bQwwqW-Hc" },
  { title: "Not Like Us", artist: "Kendrick Lamar", year: 2024, youtubeId: "T6eK-2OQtew" }
];

// 556 songs
const HEBREW_SONGS = [
  // ── 1970s ────────────────────────────────────────
  { title: "אהבתה של תרזה דימון", artist: "אילנית", year: 1970, youtubeId: "mBUALscN4Z4" },
  { title: "אני זוכר", artist: "יהורם גאון", year: 1970, youtubeId: "GaWYPJ4f3-A" },
  { title: "הבית ליד המסילה", artist: "רבקה זהר", year: 1970, youtubeId: "G14pN1vtjjA" },
  { title: "חוזה לך ברח", artist: "אושיק לוי", year: 1970, youtubeId: "O3G8hg2RD2Q" },
  { title: "למה לי לקחת ללב", artist: "אריק איינשטיין ושלום חנוך", year: 1970, youtubeId: "czmnbI6360U" },
  { title: "לצפון באהבה", artist: "להקת פיקוד צפון, סולן יגאל בשן", year: 1970, youtubeId: "t6MUlzoD0OQ" },
  { title: "משירי ארץ אהבתי", artist: "חוה אלברשטיין", year: 1970, youtubeId: "Y20fX5gVw_w" },
  { title: "עפרה", artist: "מוטי פליישר", year: 1970, youtubeId: "_ha9khRLQTI" },
  { title: "פתאום עכשיו, פתאום היום", artist: "שלמה ארצי", year: 1970, youtubeId: "P74eXZBoT3I" },
  { title: "שיר לשלום", artist: "להקת הנח\"ל, סולנית מירי אלוני", year: 1970, youtubeId: "F-1fKUeDlzE" },
  { title: "אני ואתה", artist: "אריק איינשטיין", year: 1971, youtubeId: "gSXw49d4Z2s" },
  { title: "אני חולם על נעמי", artist: "חדוה ודוד", year: 1971, youtubeId: "3lumwVFvEYs" },
  { title: "הנני כאן", artist: "יהורם גאון", year: 1971, youtubeId: "ijPL6Yi8VRM" },
  { title: "ומתוק האור בעיניים", artist: "ששי קשת", year: 1971, youtubeId: "JqPal2x7Zao" },
  { title: "חופשי ומאושר", artist: "אילן ואילנית", year: 1971, youtubeId: "zYE3PEJVszo" },
  { title: "לישון לישון", artist: "אושיק לוי", year: 1971, youtubeId: "D8aTJpQrClE" },
  { title: "לך איתה", artist: "אילנה רובינא", year: 1971, youtubeId: "DrZd0YfS7oc" },
  { title: "מתוק מתוק", artist: "להקת פיקוד צפון, סולן יגאל בשן", year: 1971, youtubeId: "14_gpsByJhk" },
  { title: "פרחים בקנה", artist: "צוות הווי תותחנים", year: 1971, youtubeId: "PKtNG9HYHI4" },
  { title: "שבחי מעוז", artist: "להקת פיקוד דרום", year: 1971, youtubeId: "sFB_B3wTXLE" },
  { title: "איזבל", artist: "עקיבא נוף", year: 1972, youtubeId: "doRToauI01U" },
  { title: "אל תשאל ילד", artist: "שלמה ארצי", year: 1972, youtubeId: "iFGcKQOK4tU" },
  { title: "היום היום", artist: "שלישיית פיקוד מרכז, סולנית דורית ראובני", year: 1972, youtubeId: "MoHKsbpInSs" },
  { title: "חייך וחיי", artist: "בעז שרעבי", year: 1972, youtubeId: "dTW4oeG4Ni0" },
  { title: "יום יבוא", artist: "אל תקרא לי שחור", year: 1972, youtubeId: "QzC5iF1QPzA" },
  { title: "מה נשתנה", artist: "יגאל בשן", year: 1972, youtubeId: "gF1GBq-XUMk" },
  { title: "מסביב למדורה", artist: "צוות הווי חטיבת הצנחנים ושלישיית פיקוד מרכז", year: 1972, youtubeId: "qoLIgmbD2fA" },
  { title: "עד סוף הקיץ", artist: "אלי מגן", year: 1972, youtubeId: "ZINmGlisESo" },
  { title: "על אם הדרך", artist: "להקת חיל הים", year: 1972, youtubeId: "ga-Z1u9aUaA" },
  { title: "פתחי לי את הדלת", artist: "אחרית הימים", year: 1972, youtubeId: "6o4T_Uucnvc" },
  { title: "אי שם", artist: "אילנית", year: 1973, youtubeId: "7HBr-X2F-cE" },
  { title: "אלעד ירד אל הירדן", artist: "להקת פיקוד דרום", year: 1973, youtubeId: "rlx2bJHJ9QU" },
  { title: "ברית עולם", artist: "מתי כספי", year: 1973, youtubeId: "1mieEeD0Kfk" },
  { title: "המגפיים של ברוך", artist: "כוורת", year: 1973, youtubeId: "PsbL9e55fQw" },
  { title: "לו יהי", artist: "חוה אלברשטיין", year: 1973, youtubeId: "YWeeRjy2sOA" },
  { title: "מי ידע שכך יהיה", artist: "בעז שרעבי", year: 1973, youtubeId: "ohlR6ecrIwU" },
  { title: "פה קבור הכלב", artist: "כוורת", year: 1973, youtubeId: "1EmgMHxdI1M" },
  { title: "שיר בבוקר בבוקר", artist: "שלמה ארצי", year: 1973, youtubeId: "tU5M9lk9bZo" },
  { title: "שיר המכולת", artist: "כוורת", year: 1973, youtubeId: "DJWfdfk3MiY" },
  { title: "אומרים ישנה ארץ", artist: "שלמה ארצי", year: 1973, youtubeId: "SKMdUcDV0CA" },
  { title: "את ואני נולדנו בתש\"ח", artist: "עדנה לב", year: 1973, youtubeId: "thpQ4R1cjEw" },
  { title: "נתתי לה חיי", artist: "כוורת", year: 1974, youtubeId: "KmiduiRMq2c" },
  { title: "הבלדה על יואל משה סלומון", artist: "אריק איינשטיין", year: 1974, youtubeId: "ku-pRz-JmLU" },
  { title: "היא כל כך יפה", artist: "כוורת", year: 1974, youtubeId: "CmWbJRhSpxQ" },
  { title: "המלח גבריאל", artist: "הגשש החיוור", year: 1974, youtubeId: "ohwdqUuY5uU" },
  { title: "ילדים של החיים", artist: "אריק איינשטיין", year: 1974, youtubeId: "XnJUiL2uIJ4" },
  { title: "יש לי אהוב בסיירת חרוב", artist: "להקת פיקוד מרכז", year: 1974, youtubeId: "M7l7gipDQiM" },
  { title: "כשאלוהים אמר בפעם הראשונה", artist: "מתי כספי", year: 1974, youtubeId: "2jfh3Gfiu24" },
  { title: "נחמד", artist: "כוורת", year: 1974, youtubeId: "uDcsnHh2T_g" },
  { title: "רוצי שמוליק", artist: "אריאל זילבר", year: 1974, youtubeId: "Rv0ZtsTJmk0" },
  { title: "שיר אהבה פוליטי", artist: "מתי כספי", year: 1974, youtubeId: "DshwC_LrKPA" },
  { title: "שיר היונה", artist: "נתנאלה", year: 1974, youtubeId: "ZYu7M_wq39s" },
  { title: "בלילות הקיץ החמים", artist: "מתי כספי", year: 1975, youtubeId: "8rO9x9g064s" },
  { title: "הנסיך הקטן", artist: "קצת אחרת", year: 1975, youtubeId: "iwiUHg-UmBY" },
  { title: "טוב לי לשיר", artist: "אריק איינשטיין", year: 1975, youtubeId: "O_br93MYpXM" },
  { title: "כמו צמח בר", artist: "חוה אלברשטיין", year: 1975, youtubeId: "iB1GV6eboxg" },
  { title: "למה לא אמרת לי", artist: "אריק איינשטיין", year: 1975, youtubeId: "QNjwz0EM4-c" },
  { title: "שיר אהבה בדואי", artist: "דויד ברוזה", year: 1975, youtubeId: "0TFos2UX_Qo" },
  { title: "אדם בתוך עצמו", artist: "שלום חנוך", year: 1976, youtubeId: "vjEbQr56ty4" },
  { title: "אהבה בסוף הקיץ", artist: "צביקה פיק", year: 1976, youtubeId: "947Y08PTob0" },
  { title: "אני לא יודע איך לומר לך", artist: "שלום חנוך", year: 1976, youtubeId: "MP91NDaAqzk" },
  { title: "דרך הכורכר", artist: "אריק איינשטיין", year: 1976, youtubeId: "KlB8Wecz_aM" },
  { title: "יונתן סע הביתה", artist: "אושיק לוי", year: 1976, youtubeId: "trttFNoiw0w" },
  { title: "סוס עץ", artist: "אריק איינשטיין", year: 1976, youtubeId: "2w130bce9h4" },
  { title: "סוף עונת התפוזים", artist: "תמוז", year: 1976, youtubeId: "_X_MAbcGMrk" },
  { title: "סע לאט", artist: "אריק איינשטיין", year: 1976, youtubeId: "TpL3wlZgFfE" },
  { title: "עטור מצחך", artist: "אריק איינשטיין", year: 1976, youtubeId: "PMRrdTS4uYM" },
  { title: "רוח סתיו", artist: "צביקה פיק", year: 1976, youtubeId: "zCW8ZqGdFog" },
  { title: "איך שיר נולד", artist: "הכבש השישה עשר", year: 1977, youtubeId: "uAtpJBD1vuQ" },
  { title: "אין מדינה לאהבה", artist: "צביקה פיק", year: 1977, youtubeId: "ixvBx9L3WEk" },
  { title: "גן סגור", artist: "הכבש השישה עשר", year: 1977, youtubeId: "4ok4io20xvc" },
  { title: "דון קישוט", artist: "אריק איינשטיין", year: 1977, youtubeId: "A2wccbY4s7o" },
  { title: "הילדה הכי יפה בגן", artist: "יהודית רביץ", year: 1977, youtubeId: "MghkDU3RAuM" },
  { title: "לא דיברנו עוד על אהבה", artist: "מתי כספי", year: 1977, youtubeId: "SFZHViKGdrI" },
  { title: "מה עושות האיילות", artist: "יהודית רביץ", year: 1977, youtubeId: "ea-yArVDly4" },
  { title: "סליחות", artist: "יהודית רביץ", year: 1977, youtubeId: "k8GZxZOYQK8" },
  { title: "רקפת", artist: "רוחמה רז", year: 1977, youtubeId: "jyWZ7oa1Oz8" },
  { title: "אבניבי", artist: "יזהר כהן", year: 1978, youtubeId: "AFyMsMLgkEY" },
  { title: "אגדת דשא", artist: "אריק איינשטיין", year: 1978, youtubeId: "gSel4yg-VWc" },
  { title: "אלף נשיקות", artist: "יהורם גאון", year: 1978, youtubeId: "jdXK92Cnmvw" },
  { title: "גוליית", artist: "כוורת", year: 1978, youtubeId: "RJrnR6IeJpA" },
  { title: "דמעות של מלאכים", artist: "יוני רכטר", year: 1978, youtubeId: "3rN_D8ATbfk" },
  { title: "הללויה", artist: "חלב ודבש", year: 1978, youtubeId: "QHHk3926ils" },
  { title: "ילדיסקו", artist: "שרי", year: 1978, youtubeId: "iPEkuVhAD3k" },
  { title: "מילה טובה", artist: "יהודית רביץ", year: 1978, youtubeId: "32Zn4Rzga1o" },
  { title: "מרי לו", artist: "צביקה פיק", year: 1978, youtubeId: "jBz36AnNd6U" },
  { title: "שיר הפרחה", artist: "עפרה חזה", year: 1978, youtubeId: "SueQ5XWKGLY" },
  { title: "אל תשטה באהבה", artist: "יהודית רביץ", year: 1979, youtubeId: "agNs8HDR6SQ" },
  { title: "אמא ודני", artist: "גזוז", year: 1979, youtubeId: "aeJCu2t0n5M" },
  { title: "אצל הדודה והדוד", artist: "דני סנדרסון", year: 1979, youtubeId: "JZ9oiq3Gzfs" },
  { title: "סניוריטה", artist: "דויד ברוזה", year: 1979, youtubeId: "bxMB9Hiw-_c" },
  { title: "עוד חוזר הניגון", artist: "נורית גלרון", year: 1979, youtubeId: "gsf0t-VihvE" },
  { title: "רוני", artist: "גזוז", year: 1979, youtubeId: "7m74eKO22qw" },
  { title: "שיר כלולות", artist: "יזהר כהן", year: 1979, youtubeId: "Cnxu1PPz5RQ" },
  { title: "תה עושה סחרחורת", artist: "גזוז", year: 1979, youtubeId: "Ml3ghi_5Gu4" },
  { title: "תני לי יד", artist: "בעז שרעבי", year: 1979, youtubeId: "iUCdL3-V7yw" },
  // ── 1980s ────────────────────────────────────────
  { title: "הכניסיני תחת כנפך", artist: "אריק איינשטיין", year: 1980, youtubeId: "WkA7f_QJN1U" },
  { title: "בלילה על הדשא", artist: "צליל מכוון", year: 1980, youtubeId: "LXAchCLb1hQ" },
  { title: "גלגל ענק", artist: "חלב ודבש", year: 1980, youtubeId: "8DSk7pOBiaA" },
  { title: "דמעות של מלאכים", artist: "יוני רכטר", year: 1980, youtubeId: "3rN_D8ATbfk" },
  { title: "היו לילות", artist: "אסתר עופרים", year: 1980, youtubeId: "51hWOqpCJ18" },
  { title: "לא ידעתי שתלכי ממני", artist: "מתי כספי", year: 1980, youtubeId: "8ki7kdxxjuY" },
  { title: "עוד יהיה טוב", artist: "דודו זכאי", year: 1980, youtubeId: "FgonLgw2UJo" },
  { title: "עם אחד שיר אחד", artist: "אמני ישראל", year: 1980, youtubeId: "wZeCg086Iig" },
  { title: "שיר אהבה סטנדרטי", artist: "אריק איינשטיין", year: 1980, youtubeId: "uBgAG1HDLSE" },
  { title: "אני שוכב לי על הגב", artist: "אריאל זילבר", year: 1981, youtubeId: "zLC16BOEiiA" },
  { title: "חצבים פורחים", artist: "תיסלם", year: 1981, youtubeId: "STAHSLLBRIk" },
  { title: "יש לך", artist: "צביקה פיק", year: 1981, youtubeId: "OEVCkldBweU" },
  { title: "כלים שלובים", artist: "גידי גוב", year: 1981, youtubeId: "1HMYNkm6tQs" },
  { title: "לילה בכרך", artist: "הכל עובר חביבי", year: 1981, youtubeId: "UEDkd76zSWA" },
  { title: "סינדרלה", artist: "סקסטה", year: 1981, youtubeId: "-zcmo1igMi0" },
  { title: "רדיו חזק", artist: "תיסלם", year: 1981, youtubeId: "HfYKPAy9QIA" },
  { title: "שירו שיר אמן", artist: "ירדנה ארזי", year: 1981, youtubeId: "RjH90sKFBPQ" },
  { title: "תנו לי רוקנרול", artist: "תיסלם", year: 1981, youtubeId: "Bu7bMJ-5-kM" },
  { title: "נכון להיום", artist: "זוהר ארגוב", year: 1982, youtubeId: "3TgmcJLJwlU" },
  { title: "אל תדליקו לי נר", artist: "הקליק", year: 1982, youtubeId: "4k__2wxpVU4" },
  { title: "בית משותף", artist: "בנזין", year: 1982, youtubeId: "OX_TCv-9bCg" },
  { title: "הביתה", artist: "ירדנה ארזי", year: 1982, youtubeId: "-1FggHOrkX0" },
  { title: "הפרח בגני", artist: "זוהר ארגוב", year: 1982, youtubeId: "F7jROV_XRa8" },
  { title: "כבר עברו השנים", artist: "זוהר ארגוב", year: 1982, youtubeId: "jNFmzp96EU0" },
  { title: "מעלה מעלה", artist: "צביקה פיק", year: 1982, youtubeId: "EarnsMJz2QU" },
  { title: "עוד נגיע", artist: "ירדנה ארזי", year: 1982, youtubeId: "S9MTOX03XwI" },
  { title: "רואים רחוק רואים שקוף", artist: "שמוליק קראוס ואילן וירצברג", year: 1982, youtubeId: "OzKNuueAaTE" },
  { title: "רק אתמול", artist: "גלי עטרי", year: 1982, youtubeId: "B8GNkA63MGw" },
  { title: "שנה שנייה", artist: "תיסלם", year: 1982, youtubeId: "lubRmxjVlOA" },
  { title: "אבא אבא", artist: "אבי טולדנו", year: 1983, youtubeId: "bR9eXmapv1w" },
  { title: "בוקר של כיף", artist: "תיסלם", year: 1983, youtubeId: "dKHG72uTE9A" },
  { title: "בחברה להגנת הטבע", artist: "אריאל זילבר", year: 1983, youtubeId: "Y0E_0kqgMUE" },
  { title: "הולך למערב", artist: "מני בגר", year: 1983, youtubeId: "zhBhAlCFG-g" },
  { title: "הרומבה", artist: "דויד ברוזה", year: 1983, youtubeId: "OSIU7Iz_8Po" },
  { title: "חי", artist: "עפרה חזה", year: 1983, youtubeId: "PdqBd5GsIVg" },
  { title: "טוב שבאת", artist: "גידי גוב", year: 1983, youtubeId: "wT5TmvDnC04" },
  { title: "יושב על הגדר", artist: "אריק איינשטיין", year: 1983, youtubeId: "B5ImL9PWN7w" },
  { title: "סוף קיץ", artist: "עפרה חזה", year: 1983, youtubeId: "m2E4p8oe9Yk" },
  { title: "רוקד לקול הבנות", artist: "אפרים שמיר", year: 1983, youtubeId: "FhqsyQZyh7o" },
  { title: "אלה", artist: "דפנה ארמוני", year: 1984, youtubeId: "Z9mgGc7Njbw" },
  { title: "אם ננעלו", artist: "עפרה חזה", year: 1984, youtubeId: "XSMl8SpT6p0" },
  { title: "אנשי הגשם", artist: "משה דץ וצוות חופים", year: 1984, youtubeId: "Jton2Sg5ZY8" },
  { title: "אתה לי ארץ", artist: "ירדנה ארזי", year: 1984, youtubeId: "ni5zFEj7FFg" },
  { title: "בללייקה", artist: "אילנית", year: 1984, youtubeId: "w3FIb_X6Eu4" },
  { title: "כמו בסרט", artist: "אושיק לוי", year: 1984, youtubeId: "YzOuYcbOZ38" },
  { title: "לא תנצחו אותי", artist: "יהורם גאון", year: 1984, youtubeId: "16v1N5eA4xo" },
  { title: "ממריאה ברוח", artist: "גלי עטרי", year: 1984, youtubeId: "g2s5eoIDs2Q" },
  { title: "שיר השחרור", artist: "מני בגר", year: 1984, youtubeId: "z0ExcqsbAqc" },
  { title: "אדמה", artist: "עפרה חזה", year: 1985, youtubeId: "blvxcZKNX7A" },
  { title: "אופטיקאי מדופלם", artist: "משינה", year: 1985, youtubeId: "nJXRGfYm1xI" },
  { title: "גורל אחד", artist: "עפרה חזה", year: 1985, youtubeId: "r3E4cMeASH0" },
  { title: "מחכים למשיח", artist: "שלום חנוך", year: 1985, youtubeId: "Q49gVfjIi3U" },
  { title: "מישהו הולך תמיד איתי", artist: "עפרה חזה", year: 1985, youtubeId: "h5uYfKbw9O8" },
  { title: "נגד הרוח", artist: "שלום חנוך", year: 1985, youtubeId: "5ghD6Xj7Fdw" },
  { title: "סיבה להמשיך", artist: "שלמה ארצי", year: 1985, youtubeId: "jBrpIbN9xTE" },
  { title: "פרי גנך", artist: "אביבה אבידן ואלי לוזון", year: 1985, youtubeId: "Faa2wRJ_Rh4" },
  { title: "קום והתהלך בארץ", artist: "להקת פיקוד צפון", year: 1985, youtubeId: "a4bEqoM0qt4" },
  { title: "רכבת לילה לקהיר", artist: "משינה", year: 1985, youtubeId: "pJFu7zmXB-Y" },
  { title: "שירו של שפשף", artist: "מאיר בנאי", year: 1985, youtubeId: "1Tiq0CMaR7I" },
  { title: "שלח לי מלאך", artist: "משינה", year: 1985, youtubeId: "Qowx-Sj_m1I" },
  { title: "אהבה בת עשרים", artist: "יוסי בנאי", year: 1986, youtubeId: "7PxG0jfZX6k" },
  { title: "אוהב להיות בבית", artist: "אריק איינשטיין", year: 1986, youtubeId: "3V5ra1td87k" },
  { title: "אין לי ארץ אחרת", artist: "קורין אלאל", year: 1986, youtubeId: "yNlf6szK2XI" },
  { title: "בגלל הרוח", artist: "שלומי שבת", year: 1986, youtubeId: "nli5tcVRjG4" },
  { title: "דרך ארוכה", artist: "גלי עטרי", year: 1986, youtubeId: "Ax59Vq-oq3U" },
  { title: "היא חזרה בתשובה", artist: "מתי כספי", year: 1986, youtubeId: "_5CyAi5WhfM" },
  { title: "עטוף ברחמים", artist: "ריטה", year: 1986, youtubeId: "jukYS4rCfEk" },
  { title: "שביל הבריחה", artist: "ריטה", year: 1986, youtubeId: "r81U6hPqu-k" },
  { title: "שיר אהובת הספן", artist: "ריטה", year: 1986, youtubeId: "4MfDSGUUK4E" },
  { title: "אין עוד יום", artist: "גידי גוב", year: 1987, youtubeId: "rVNE2-DcgTk" },
  { title: "ארץ חדשה", artist: "שלמה ארצי", year: 1987, youtubeId: "LvN1QmRmxjs" },
  { title: "באה מאהבה", artist: "יהודית רביץ", year: 1987, youtubeId: "IxUEjA4CGrc" },
  { title: "לא יכולתי לעשות כלום", artist: "נורית גלרון", year: 1987, youtubeId: "ipmwtQX8G5A" },
  { title: "קפה אצל ברטה", artist: "אריק איינשטיין", year: 1987, youtubeId: "Swk4HTb7LGI" },
  { title: "שיעור מולדת", artist: "להקת כוורת", year: 1987, youtubeId: "l3rOT_FqrHk" },
  { title: "שכשנבוא", artist: "אריק איינשטיין ושם טוב לוי", year: 1987, youtubeId: "12FBnCV43r4" },
  { title: "אפר ואבק", artist: "יהודה פוליקר", year: 1988, youtubeId: "1FwSKM_GlkE" },
  { title: "התחנה הקטנה טרבלינקה", artist: "יהודה פוליקר", year: 1988, youtubeId: "vSk_rX0KvLo" },
  { title: "חלון לים התיכון", artist: "יהודה פוליקר", year: 1988, youtubeId: "UL0WxzhtzP4" },
  { title: "מהרי נא", artist: "אהוד בנאי", year: 1988, youtubeId: "NN-dqS4fGzY" },
  { title: "עבודה שחורה", artist: "אהוד בנאי", year: 1988, youtubeId: "Qi3dglaJupk" },
  { title: "עיר מקלט", artist: "אהוד בנאי", year: 1988, youtubeId: "ZOSr6eLEFho" },
  { title: "ערבב את הטיח", artist: "אהוד בנאי", year: 1988, youtubeId: "0XaDzW7RPcA" },
  { title: "פרח", artist: "גידי גוב", year: 1988, youtubeId: "qt_pgAvXfPI" },
  { title: "שיר נבואי קוסמי עליז", artist: "יוני רכטר", year: 1988, youtubeId: "CV2U4bDaJqI" },
  { title: "אחרי עשרים שנה", artist: "שמוליק קראוס", year: 1989, youtubeId: "nq8EMwQ9S2w" },
  { title: "אמא", artist: "ריקי גל", year: 1989, youtubeId: "qQraYp8c3vI" },
  { title: "אני רוצה גם", artist: "יהודה פוליקר", year: 1989, youtubeId: "hD-Gacu1ZRY" },
  { title: "את לי לילה", artist: "בועז שרעבי", year: 1989, youtubeId: "Z_AH1CdRIQ4" },
  { title: "זה רק אור הירח", artist: "ריטה", year: 1989, youtubeId: "GeiMDJDcA3E" },
  { title: "ילד אסור ילד מותר", artist: "ריקי גל", year: 1989, youtubeId: "mSBqE34X2Og" },
  { title: "נפרדנו כך", artist: "נורית גלרון", year: 1989, youtubeId: "vbsX2IklB54" },
  { title: "על קו הזינוק", artist: "החברים של נטאשה", year: 1989, youtubeId: "Zfld19xewtU" },
  { title: "פרצופה של המדינה", artist: "תיסלם", year: 1989, youtubeId: "KDPZfJKsaVI" },
  { title: "שירו של יום חולין", artist: "אילנית", year: 1989, youtubeId: "_Sx3he4ABw0" },
  // ── 1990s ────────────────────────────────────────
  { title: "אהבת נעורי", artist: "שלום חנוך", year: 1990, youtubeId: "5zd_U6X0oEI" },
  { title: "אור", artist: "שושנה דמארי", year: 1990, youtubeId: "oHH9j9CzhK8" },
  { title: "אחרי הכל את שיר", artist: "שלמה ארצי", year: 1990, youtubeId: "IqwAjXC88-0" },
  { title: "חוזה לך ברח", artist: "שלום חנוך", year: 1990, youtubeId: "yy9NdPRXmdE" },
  { title: "ילדים של החיים", artist: "שלום חנוך", year: 1990, youtubeId: "waqmJYAKua8" },
  { title: "כמו צמח בר", artist: "יהודית רביץ", year: 1990, youtubeId: "iB1GV6eboxg" },
  { title: "נגיעה אחת רכה", artist: "נורית גלרון", year: 1990, youtubeId: "Hpba9wZAsMY" },
  { title: "שיר אהבה בדואי", artist: "דויד ברוזה ויעל לוי", year: 1990, youtubeId: "f4FED8PnF1s" },
  { title: "תחת שמי ים התיכון", artist: "שלמה ארצי", year: 1990, youtubeId: "lAa0e7apG20" },
  { title: "אבא תרנגול", artist: "התרנגולים/ביצוע מחודש", year: 1991, youtubeId: "BJKm-qWjmT8" },
  { title: "אור הירח", artist: "אביב גפן", year: 1991, youtubeId: "N_pzDhQiB3Y" },
  { title: "זה כל הקסם", artist: "נמרוד לב ואורלי פרל", year: 1991, youtubeId: "TdvDJ-jS0vM" },
  { title: "זמן סוכר", artist: "איפה הילד", year: 1991, youtubeId: "3El9sI7XXkA" },
  { title: "זן נדיר", artist: "קורין אלאל", year: 1991, youtubeId: "D4OmCeIv0wM" },
  { title: "מה חשוב היום", artist: "מוניקה סקס", year: 1991, youtubeId: "vTf3VyvyBAM" },
  { title: "מסיבת התה של בובות", artist: "איפה הילד", year: 1991, youtubeId: "zldB1T9uOwo" },
  { title: "עכשיו מעונן", artist: "אביב גפן והתעויוט", year: 1991, youtubeId: "cidXCVrPbPE" },
  { title: "שקט", artist: "בלגן", year: 1991, youtubeId: "gBfUiq-Mahw" },
  { title: "בואי כלה", artist: "אחינועם ניני וגיל דור", year: 1992, youtubeId: "SGgYhCVEVyc" },
  { title: "גן נעול", artist: "מתי כספי", year: 1992, youtubeId: "8mbykdTsfzo" },
  { title: "האם להיות בך מאוהב", artist: "אביב גפן", year: 1992, youtubeId: "DvkJjynH7Dk" },
  { title: "היא לא דומה", artist: "ארקדי דוכין", year: 1992, youtubeId: "9-yd9ou_p9w" },
  { title: "כתם הפרי", artist: "אתניקס", year: 1992, youtubeId: "hnS60ImFeds" },
  { title: "ציפור מדבר", artist: "אתניקס", year: 1992, youtubeId: "KXw58dIBL6E" },
  { title: "קיץ", artist: "אביב גפן", year: 1992, youtubeId: "lyG_9ktEqZ4" },
  { title: "שיר ישן", artist: "אתניקס", year: 1992, youtubeId: "PTOOksYu_e8" },
  { title: "תותים", artist: "אתניקס", year: 1992, youtubeId: "E64QIkGvlxA" },
  { title: "אהובתי", artist: "משינה", year: 1993, youtubeId: "GgNFq1sSz5s" },
  { title: "אני רואה אותה בדרך לגימנסיה", artist: "אריק איינשטיין", year: 1993, youtubeId: "yYW-8iacVZQ" },
  { title: "הכוכבים דולקים על אש קטנה", artist: "משינה", year: 1993, youtubeId: "-ozbcdJ9he0" },
  { title: "לבכות לך", artist: "אביב גפן", year: 1993, youtubeId: "9aXT_U4uO6U" },
  { title: "נגעה בשמיים", artist: "משינה", year: 1993, youtubeId: "c1kQgVUQCVo" },
  { title: "נפלת חזק", artist: "איפה הילד", year: 1993, youtubeId: "O2un2T4q2yM" },
  { title: "רק בשביל לקבל חיבוק", artist: "איפה הילד", year: 1993, youtubeId: "Dz9y0yVjbks" },
  { title: "דמעות", artist: "אייל גולן", year: 1994, youtubeId: "_YKdywbOfbE" },
  { title: "הכל עד לכאן", artist: "עמיר לב", year: 1994, youtubeId: "hSgflhyU9jk" },
  { title: "הנסיכה והרוח", artist: "ריטה", year: 1994, youtubeId: "4sU3wWHSSU4" },
  { title: "כל החבר'ה", artist: "מוניקה סקס", year: 1994, youtubeId: "RyAjFrDF8oE" },
  { title: "כסף", artist: "אתניקס", year: 1994, youtubeId: "-n-DsEkgSuc" },
  { title: "לחישה בלילה", artist: "אייל גולן", year: 1994, youtubeId: "19DLgSWXe4M" },
  { title: "מי אוהב אותך יותר ממני", artist: "ארקדי דוכין", year: 1994, youtubeId: "l0WYMRSs9C4" },
  { title: "מכה אפורה", artist: "מוניקה סקס", year: 1994, youtubeId: "DV55unut3oI" },
  { title: "עינייך החומות", artist: "אייל גולן", year: 1994, youtubeId: "3N65c0-srsU" },
  { title: "ציפור קטנה בלב", artist: "יאיר ניצני", year: 1994, youtubeId: "aaJbbzIR2xY" },
  { title: "אהבה קצרה", artist: "מאיר בנאי", year: 1995, youtubeId: "5uG2OJX0KZk" },
  { title: "בואי", artist: "עברי לידר", year: 1995, youtubeId: "oI7jLz1YGeg" },
  { title: "החיים שלך בלאפה", artist: "טיפקס", year: 1995, youtubeId: "-Y8Xkzb6DhQ" },
  { title: "התחלה חדשה", artist: "בנזין/יהודה פוליקר", year: 1995, youtubeId: "9CYCSiXGKJM" },
  { title: "יש אי שם", artist: "גידי גוב", year: 1995, youtubeId: "8Nvouj0SDr8" },
  { title: "לב שלם", artist: "אייל גולן", year: 1995, youtubeId: "Noaku-JbWp0" },
  { title: "מישהו", artist: "יהודית רביץ", year: 1995, youtubeId: "6CeaV0wU_54" },
  { title: "עניין של זמן", artist: "גידי גוב", year: 1995, youtubeId: "ydHbu5UCakI" },
  { title: "תפוחים ותמרים", artist: "רמי קלינשטיין", year: 1995, youtubeId: "zfQ3LQH085w" },
  { title: "אחלום לנצח", artist: "מופע הארנבות של ד\"ר קספר", year: 1996, youtubeId: "0gs9r8HnCB8" },
  { title: "הייתי בגן עדן", artist: "שרית חדד", year: 1996, youtubeId: "j2ZJufHIgp8" },
  { title: "יש בי אהבה", artist: "ארקדי דוכין", year: 1996, youtubeId: "XIgkTSmWQO0" },
  { title: "לולה", artist: "דנה אינטרנשיונל", year: 1996, youtubeId: "8_pRZYNHgns" },
  { title: "לילות לבנים", artist: "שלום חנוך", year: 1996, youtubeId: "LNWtqBH4MMs" },
  { title: "מרוב אהבתי", artist: "ארקדי דוכין", year: 1996, youtubeId: "EuYPBIoiNn4" },
  { title: "נערה טובה", artist: "שרית חדד", year: 1996, youtubeId: "O_JhJ24NxDY" },
  { title: "רדיו חזק", artist: "תיסלם", year: 1996, youtubeId: "-PY5m1qxYcw" },
  { title: "שקט", artist: "מופע הארנבות של ד\"ר קספר", year: 1996, youtubeId: "fBgZZN6EaFc" },
  { title: "אהבה אסורה", artist: "זהבה בן", year: 1997, youtubeId: "T3sDQE-g7yU" },
  { title: "דרכנו", artist: "דני בסן ומזי כהן", year: 1997, youtubeId: "WF7oOvoqzGo" },
  { title: "הנסיכה והרוח", artist: "גידי גוב וריטה", year: 1997, youtubeId: "MXhZZ_KR_ds" },
  { title: "זמר שלוש התשובות", artist: "זהבה בן", year: 1997, youtubeId: "tOcdhNPDfsA" },
  { title: "טמבל", artist: "איפה הילד", year: 1997, youtubeId: "V10HjyMVBZs" },
  { title: "כמה יוסי", artist: "ברי סחרוף", year: 1997, youtubeId: "jqfmk2RLwA4" },
  { title: "למה הלכת ממנו", artist: "שרית חדד", year: 1997, youtubeId: "gfICkKlq7zo" },
  { title: "מיכאל", artist: "אתי אנקרי", year: 1997, youtubeId: "N5JHPfD-VT0" },
  { title: "ניצוצות", artist: "ברי סחרוף ורמי פורטיס", year: 1997, youtubeId: "egBr-iO8jek" },
  { title: "עבדים", artist: "ברי סחרוף", year: 1997, youtubeId: "2LH8kvivV-A" },
  { title: "בדמעות שאת בוכה", artist: "פבלו רוזנברג", year: 1998, youtubeId: "U1U2kYQV9OQ" },
  { title: "דיווה", artist: "דנה אינטרנשיונל", year: 1998, youtubeId: "NsPksS8QWWY" },
  { title: "האהבה הישנה", artist: "שלמה ארצי", year: 1998, youtubeId: "K4b1a3aGBSo" },
  { title: "היידה", artist: "שרית חדד", year: 1998, youtubeId: "_4OvzTwVO8o" },
  { title: "כמו שזה בא זה הולך", artist: "פבלו רוזנברג", year: 1998, youtubeId: "aaHz0LzVNnY" },
  { title: "לך אלי תשוקתי", artist: "מאיר בנאי", year: 1998, youtubeId: "FbNj0DleE_I" },
  { title: "מלאך", artist: "אביב גפן", year: 1998, youtubeId: "tIYkOQC28j4" },
  { title: "גאולה", artist: "חמי רודנר ושליחי הבלוז", year: 1999, youtubeId: "h9qFb2l0jmA" },
  { title: "גיטרה וכינור", artist: "אריק איינשטיין ושלום חנוך", year: 1999, youtubeId: "6UltSHD_BbM" },
  { title: "געגוע", artist: "יהודית רביץ", year: 1999, youtubeId: "XsYpkeUm-og" },
  { title: "ימים של שקט", artist: "לולה", year: 1999, youtubeId: "Mk4NgJDLxDA" },
  { title: "לכל אחד יש", artist: "ליאור נרקיס ושלומי שבת", year: 1999, youtubeId: "hpjGcYkmW-4" },
  { title: "נופל וקם", artist: "שב\"ק ס'", year: 1999, youtubeId: "wFMip4quzA8" },
  { title: "עד הקצה", artist: "דנה ברגר", year: 1999, youtubeId: "19-GmbnveEw" },
  { title: "פרפרים", artist: "אורי בנאי", year: 1999, youtubeId: "hSfvAKQUOzM" },
  { title: "שלוש בלילה", artist: "טיפקס", year: 1999, youtubeId: "u2LV7FuVruM" },
  { title: "שמחות קטנות", artist: "עמיר בניון ומיכה שטרית", year: 1999, youtubeId: "7YIUyrtRBOo" },
  // ── 2000s ────────────────────────────────────────
  { title: "גאולה", artist: "חמי רודנר ושליחי הבלוז", year: 2000, youtubeId: "h9qFb2l0jmA" },
  { title: "גיטרה וכינור", artist: "אריק איינשטיין ושלום חנוך", year: 2000, youtubeId: "6UltSHD_BbM" },
  { title: "געגוע", artist: "יהודית רביץ", year: 2000, youtubeId: "XsYpkeUm-og" },
  { title: "ימים של שקט", artist: "לולה", year: 2000, youtubeId: "Mk4NgJDLxDA" },
  { title: "לכל אחד יש", artist: "ליאור נרקיס ושלומי שבת", year: 2000, youtubeId: "hpjGcYkmW-4" },
  { title: "נופל וקם", artist: "שב\"ק ס'", year: 2000, youtubeId: "wFMip4quzA8" },
  { title: "עד הקצה", artist: "דנה ברגר", year: 2000, youtubeId: "19-GmbnveEw" },
  { title: "פרפרים", artist: "אורי בנאי", year: 2000, youtubeId: "hSfvAKQUOzM" },
  { title: "שלוש בלילה", artist: "טיפקס", year: 2000, youtubeId: "TQRsPayhkxE" },
  { title: "שמחות קטנות", artist: "עמיר בניון ומיכה שטרית", year: 2000, youtubeId: "b_CQaQrh0wg" },
  { title: "היא לא דומה", artist: "ארקדי דוכין", year: 2001, youtubeId: "9-yd9ou_p9w" },
  { title: "הניצוץ", artist: "שרית חדד", year: 2001, youtubeId: "MMWfIrc8iTU" },
  { title: "כשהלב בוכה", artist: "שרית חדד", year: 2001, youtubeId: "6VHVcHD1jqM" },
  { title: "מלך העולם", artist: "שלמה ארצי", year: 2001, youtubeId: "xTTCD0U_HJg" },
  { title: "עכשיו התור לאהבה", artist: "עוזי חיטמן", year: 2001, youtubeId: "EqsSEPoWwxU" },
  { title: "תן לזמן ללכת", artist: "חיים משה", year: 2001, youtubeId: "A9GcP4_jVuQ" },
  { title: "תשאירי לי מקום לחבק אותך", artist: "החברים של נטאשה", year: 2001, youtubeId: "UwNM-nbaI_o" },
  { title: "מדברים בשקט", artist: "עידן רייכל", year: 2002, youtubeId: "EojQo4E2tj4" },
  { title: "אם תלך", artist: "הפרויקט של עידן רייכל", year: 2002, youtubeId: "6Qi78CMu_zg" },
  { title: "בואי", artist: "הפרויקט של עידן רייכל", year: 2002, youtubeId: "_uJLsc05ZE4" },
  { title: "הכעס", artist: "רוקפור", year: 2002, youtubeId: "sP2RKbW2kyY" },
  { title: "התקווה", artist: "סאבלימינל והצל", year: 2002, youtubeId: "w1yRR4Vi8j4" },
  { title: "ילד רחוב", artist: "סאבלימינל והצל", year: 2002, youtubeId: "66e7JqjjSJg" },
  { title: "מילים יפות מאלה", artist: "הפרויקט של עידן רייכל", year: 2002, youtubeId: "sydDwkaLeis" },
  { title: "מספרים", artist: "הדג נחש", year: 2002, youtubeId: "14eM29uSbdw" },
  { title: "קח אותי", artist: "שרון חזיז", year: 2002, youtubeId: "4KiXzNAg-4o" },
  { title: "אהבת נעוריי", artist: "שלום חנוך", year: 2003, youtubeId: "m88pN5itvRQ" },
  { title: "היום", artist: "אהוד בנאי", year: 2003, youtubeId: "u86arxPI8ks" },
  { title: "הנך יפה", artist: "הפרויקט של עידן רייכל", year: 2003, youtubeId: "b8lNNVrRUxU" },
  { title: "כל יום", artist: "עמיר בניון", year: 2003, youtubeId: "GCrvZcR09S0" },
  { title: "ממעמקים", artist: "הפרויקט של עידן רייכל", year: 2003, youtubeId: "1MncIH60DoE" },
  { title: "ניצחת איתי הכל", artist: "עמיר בניון", year: 2003, youtubeId: "AHTpwxeAtt8" },
  { title: "סיגפו", artist: "בית הבובות", year: 2003, youtubeId: "y_sHzgKo0i4" },
  { title: "שובי אל ביתי", artist: "הפרויקט של עידן רייכל", year: 2003, youtubeId: "VnGD9yTJC6o" },
  { title: "שווים", artist: "עילי בוטנר ורן דנקר", year: 2003, youtubeId: "lf72w9CMB-I" },
  { title: "שיר בעיפרון", artist: "בית הבובות", year: 2003, youtubeId: "om8hT4uQFxo" },
  { title: "שירת הסטיקר", artist: "הדג נחש", year: 2004, youtubeId: "GIbjpev6U5s" },
  { title: "אהבה", artist: "דניאל סלומון", year: 2004, youtubeId: "AnSJr6_Xwas" },
  { title: "אם כבר", artist: "היהודים", year: 2004, youtubeId: "D7ZpROXPgq8" },
  { title: "באה אליכם", artist: "מירי מסיקה", year: 2004, youtubeId: "r9yd1kcPr5Q" },
  { title: "בלוז כנעני", artist: "אהוד בנאי", year: 2004, youtubeId: "FLMTbjKSyx0" },
  { title: "השקט שנשאר", artist: "שירי מימון", year: 2004, youtubeId: "f3AmksX3Rro" },
  { title: "זכיתי לאהוב", artist: "עברי לידר", year: 2004, youtubeId: "TtVkkXGICL8" },
  { title: "לשם", artist: "מירי מסיקה", year: 2004, youtubeId: "iQoxiA4K72w" },
  { title: "סוף העולם", artist: "אביב גפן", year: 2004, youtubeId: "e0s1fZ1vens" },
  { title: "רבות הדרכים", artist: "דניאל סלומון ודנה עדיני", year: 2004, youtubeId: "Dpu0Cc1ZQ1g" },
  { title: "תתנו לו צ'אנס", artist: "מה קשור", year: 2004, youtubeId: "ANVAQCUM66w" },
  { title: "איתי", artist: "קרן פלס", year: 2005, youtubeId: "z8mXoFMShg8" },
  { title: "אם אלה החיים", artist: "קרן פלס", year: 2005, youtubeId: "RlxmsqMRmR8" },
  { title: "ואת", artist: "הראל סקעת", year: 2005, youtubeId: "ARKJfrMM29E" },
  { title: "כמה עוד אפשר", artist: "הראל סקעת", year: 2005, youtubeId: "40bADqtIr-M" },
  { title: "כמה פעמים", artist: "שירי מימון", year: 2005, youtubeId: "x3A4Ft6Pgfs" },
  { title: "כשאת איתו", artist: "אייל גולן", year: 2005, youtubeId: "oKLLyDOczbY" },
  { title: "מישהו לרוץ איתו", artist: "דודו טסה", year: 2005, youtubeId: "EAp8hbjDIiU" },
  { title: "מעליות", artist: "דודו טסה", year: 2005, youtubeId: "yjE8RgR4m-c" },
  { title: "הכול זה לטובה", artist: "דנה אינטרנשיונל", year: 2006, youtubeId: "WVs33Q88HJQ" },
  { title: "הנה אני בא", artist: "הדג נחש", year: 2006, youtubeId: "MHoRfjxnGyo" },
  { title: "זה ששומר עליי", artist: "שרית חדד", year: 2006, youtubeId: "a3b1PuEc5fA" },
  { title: "זוז מצד לצד", artist: "הדג נחש", year: 2006, youtubeId: "3pWn2-OikTU" },
  { title: "יונתן שפירא", artist: "איה כורם", year: 2006, youtubeId: "MjttW6tjHx8" },
  { title: "כל הציפורים", artist: "הראל סקעת", year: 2006, youtubeId: "I5EjK78-Osc" },
  { title: "מהמרחקים", artist: "גלי עטרי וסגיב כהן", year: 2006, youtubeId: "-xBZjKIrU1Q" },
  { title: "שיר אהבה פשוט", artist: "איה כורם", year: 2006, youtubeId: "mMBiw9Tu5ek" },
  { title: "תראו אותי", artist: "מוקי", year: 2006, youtubeId: "2tuG026ESjY" },
  { title: "קשה לי לא להתרגש", artist: "ג'קו אייזנברג ומאיה רוטמן", year: 2007, youtubeId: "6FCp1o3oQ1w" },
  { title: "So Far", artist: "הבנות נחמה", year: 2007, youtubeId: "Zqg6xUsxUzs" },
  { title: "אגו טריפ", artist: "עלמה זהר", year: 2007, youtubeId: "nc4ig-F3HwY" },
  { title: "אדם צובר זיכרונות", artist: "אברהם טל", year: 2007, youtubeId: "MriiVbZhXyM" },
  { title: "אני אש", artist: "רן דנקר ועילי בוטנר", year: 2007, youtubeId: "TytCYMTknN4" },
  { title: "בואי נעזוב", artist: "רן דנקר ועילי בוטנר", year: 2007, youtubeId: "AM9xJpMZWDw" },
  { title: "דבש", artist: "ארי גורלי ורעות יהודאי", year: 2007, youtubeId: "QrRLXNHI-ao" },
  { title: "היא כל כך יפה", artist: "מוש בן ארי", year: 2007, youtubeId: "CmWbJRhSpxQ" },
  { title: "שום דבר לא יפגע בי", artist: "כנסיית השכל", year: 2007, youtubeId: "IKDWRWqPS3s" },
  { title: "שיר אהבה אינדיאני", artist: "עלמה זהר", year: 2007, youtubeId: "Pe2FhxTYKt4" },
  { title: "אבא", artist: "אביתר בנאי", year: 2008, youtubeId: "Ibm-DP36Umo" },
  { title: "אהבה קטנה", artist: "שירי מימון", year: 2008, youtubeId: "NQRT7O8b_H4" },
  { title: "הזמן עושה את שלו", artist: "אברהם טל", year: 2008, youtubeId: "ZK5i4eruufs" },
  { title: "חלומות של אחרים", artist: "הפרויקט של עידן רייכל", year: 2008, youtubeId: "ZxHkMIRf7Kw" },
  { title: "יסמין", artist: "הפיל הכחול", year: 2008, youtubeId: "wTISM821-a8" },
  { title: "מקום לצידך", artist: "דור דניאל", year: 2008, youtubeId: "aM2DqRzzQfM" },
  { title: "עד מחר", artist: "אביתר בנאי", year: 2008, youtubeId: "g30YIH8br_8" },
  { title: "רציתי שתדעי", artist: "עידן יניב", year: 2008, youtubeId: "E-6CDfxNf8o" },
  { title: "שאריות של החיים", artist: "הפרויקט של עידן רייכל", year: 2008, youtubeId: "c3Mdf5ymOxo" },
  { title: "אה אה אה", artist: "אפרת גוש", year: 2009, youtubeId: "WmcQ62AW7Jc" },
  { title: "אורות", artist: "אברהם טל", year: 2009, youtubeId: "-zzdy7rITrs" },
  { title: "אישה מהשמיים", artist: "גלעד שגב", year: 2009, youtubeId: "5HM1gk6dkKU" },
  { title: "כסף ואלכוהול", artist: "דודו אהרון", year: 2009, youtubeId: "yiIAY2EJl0M" },
  { title: "לילה כיום יאיר", artist: "אביתר בנאי", year: 2009, youtubeId: "cXIbcvaWIKg" },
  { title: "מחוזקים לעולם", artist: "אברהם טל", year: 2009, youtubeId: "x5mHVqtYnuo" },
  { title: "נמס ממך", artist: "עומר אדם", year: 2009, youtubeId: "KIQ1xnnL0PI" },
  { title: "על חבל דק", artist: "אייל גולן", year: 2009, youtubeId: "t0U2vQ2Gqk8" },
  { title: "שיר נחמה", artist: "הדג נחש ויהודה קיסר", year: 2009, youtubeId: "d1uvv83Z_FY" },
  { title: "תגידו לה", artist: "דודו אהרון", year: 2009, youtubeId: "tzaqaQCBo7I" },
  // ── 2010s ────────────────────────────────────────
  { title: "אורות", artist: "אברהם טל", year: 2010, youtubeId: "-zzdy7rITrs" },
  { title: "אישה מהשמיים", artist: "גלעד שגב", year: 2010, youtubeId: "5HM1gk6dkKU" },
  { title: "אני אוהב אותך חזק", artist: "גידי גוב", year: 2010, youtubeId: "643zhOM68wo" },
  { title: "אצלך בעולם", artist: "היהודים", year: 2010, youtubeId: "Q2Oy_WOVPMY" },
  { title: "חכי לי", artist: "עידן יניב", year: 2010, youtubeId: "F3cm2HEyvKk" },
  { title: "לילה כיום יאיר", artist: "אביתר בנאי", year: 2010, youtubeId: "cXIbcvaWIKg" },
  { title: "מחוזקים לעולם", artist: "אברהם טל", year: 2010, youtubeId: "x5mHVqtYnuo" },
  { title: "שיר נחמה", artist: "הדג נחש ויהודה קיסר", year: 2010, youtubeId: "d1uvv83Z_FY" },
  { title: "תגידו לה", artist: "דודו אהרון", year: 2010, youtubeId: "tzaqaQCBo7I" },
  { title: "אם תלך", artist: "הפרויקט של עידן רייכל", year: 2011, youtubeId: "CtpCGfRRToo" },
  { title: "גבולות הגיון", artist: "נתן גושן", year: 2011, youtubeId: "FPKnq8vWHkc" },
  { title: "הגשמה עצמית", artist: "אריק ברמן", year: 2011, youtubeId: "G8hBZpePiLo" },
  { title: "כאב של לוחמים", artist: "עידן עמדי", year: 2011, youtubeId: "G9zwbpt5C20" },
  { title: "כל מה שיש לי", artist: "נתן גושן", year: 2011, youtubeId: "43CWs52nzpw" },
  { title: "מהשמיים", artist: "משה פרץ", year: 2011, youtubeId: "xgw9DhwRT-8" },
  { title: "מחכה", artist: "ריטה", year: 2011, youtubeId: "hAX2ku9ifEs" },
  { title: "מישהו פעם", artist: "עברי לידר", year: 2011, youtubeId: "3kJiCtRlVTo" },
  { title: "תשליך", artist: "עידן עמדי", year: 2011, youtubeId: "J57wg6Jnpn8" },
  { title: "One Day / Reckoning Song", artist: "אסף אבידן", year: 2012, youtubeId: "w0HHzYPu0_o" },
  { title: "אולי הלילה", artist: "משה פרץ", year: 2012, youtubeId: "NHDuKGNNTc8" },
  { title: "בזמן האחרון", artist: "עידן עמדי", year: 2012, youtubeId: "rEOUX_t5Ijw" },
  { title: "בלילה", artist: "הפרויקט של עידן רייכל", year: 2012, youtubeId: "r6OJaznoZEI" },
  { title: "זמן להתעורר", artist: "הדג נחש", year: 2012, youtubeId: "MPRPzhvdSqU" },
  { title: "נגמר", artist: "עידן עמדי", year: 2012, youtubeId: "T6tYNA7N0tg" },
  { title: "עכשיו קרוב", artist: "הפרויקט של עידן רייכל", year: 2012, youtubeId: "Q5lBb8Ortoo" },
  { title: "קולות הלב", artist: "גלעד שגב ומירי מסיקה", year: 2012, youtubeId: "4TUj3iJBa8s" },
  { title: "תם ולא נשלם", artist: "עילי בוטנר וילדי החוץ", year: 2012, youtubeId: "XocnNMuZ_c0" },
  { title: "תרמיל", artist: "עברי לידר", year: 2012, youtubeId: "KGpc33wg9qM" },
  { title: "בקרוב", artist: "הפרויקט של עידן רייכל", year: 2013, youtubeId: "oBt2gx4JuTY" },
  { title: "ילד של אבא", artist: "מוקי", year: 2013, youtubeId: "QgsLpE4ULfA" },
  { title: "ימים יגידו", artist: "אייל גולן", year: 2013, youtubeId: "kmRaBbJdcDM" },
  { title: "יפה כלבנה", artist: "אביתר בנאי", year: 2013, youtubeId: "NpSosoi5biU" },
  { title: "כמו בחיים", artist: "מוש בן ארי", year: 2013, youtubeId: "mKZoV8CTbJU" },
  { title: "לב חופשי", artist: "מוקי", year: 2013, youtubeId: "BQUwvwgNpNs" },
  { title: "מתנות קטנות", artist: "רמי קלינשטיין", year: 2013, youtubeId: "zKV1rNvUL7E" },
  { title: "קדימה הלאה", artist: "עילי בוטנר וילדי החוץ", year: 2013, youtubeId: "QMxogyUknk4" },
  { title: "שקט", artist: "עומר אדם", year: 2013, youtubeId: "Ujt222uNSfg" },
  { title: "תל אביב", artist: "עומר אדם", year: 2013, youtubeId: "nMQw29nfzpg" },
  { title: "Golden Boy", artist: "נדב גדג'", year: 2014, youtubeId: "NdxOCTezeTg" },
  { title: "איך אפשר שלא", artist: "ג'יין בורדו", year: 2014, youtubeId: "-BR3ziVDazM" },
  { title: "דברי איתי יותר", artist: "נתן גושן", year: 2014, youtubeId: "7uiTquRCQV8" },
  { title: "דרך השלום", artist: "פאר טסי", year: 2014, youtubeId: "VD9F_7N_MbI" },
  { title: "הכי ישראלי", artist: "התקווה 6", year: 2014, youtubeId: "Dlr1ioQIxa4" },
  { title: "טרמינל 3", artist: "דודו אהרון", year: 2014, youtubeId: "rANiul86eSU" },
  { title: "יהיה בסדר", artist: "קפה שחור חזק ונצ'י נצ'", year: 2014, youtubeId: "PQp2a_yunmM" },
  { title: "מודה אני", artist: "עומר אדם", year: 2014, youtubeId: "YQ5f1OMFFL0" },
  { title: "מתוק כשמרלי", artist: "אליעד", year: 2014, youtubeId: "9NrBS0cSb4I" },
  { title: "שישי בצהריים", artist: "אייל גולן", year: 2014, youtubeId: "05HUmYOjIPA" },
  { title: "אולי", artist: "משה פרץ", year: 2015, youtubeId: "NHDuKGNNTc8" },
  { title: "חיים שלי", artist: "ליאור נרקיס", year: 2015, youtubeId: "qEEzKfGa1oY" },
  { title: "מהפכה של שמחה", artist: "ליאור נרקיס ועומר אדם", year: 2015, youtubeId: "Q5Jz_Z44CNE" },
  { title: "מלכת השושנים", artist: "עדן בן זקן", year: 2015, youtubeId: "PkzhHPFB76c" },
  { title: "מסיבה בחיפה", artist: "התקווה 6", year: 2015, youtubeId: "zLOAD6bqT5I" },
  { title: "סלסולים", artist: "סטטיק ובן אל תבורי", year: 2015, youtubeId: "NZ-EY49i4GA" },
  { title: "רק רוצה לרקוד", artist: "משה פרץ ועומר אדם", year: 2015, youtubeId: "MZFy1LCBDH8" },
  { title: "שוב לאהוב", artist: "עילי בוטנר וילדי החוץ", year: 2015, youtubeId: "WIT4lW7D5s0" },
  { title: "אף אחד", artist: "עדן בן זקן", year: 2016, youtubeId: "H66AeNUST0s" },
  { title: "בסוף הכל חולף", artist: "עומר אדם", year: 2016, youtubeId: "Sy7VtUGJWGM" },
  { title: "ויקיפדיה", artist: "חנן בן ארי", year: 2016, youtubeId: "USxc5ws5mGc" },
  { title: "זהב", artist: "סטטיק ובן אל תבורי", year: 2016, youtubeId: "S29rQ-Fo5wc" },
  { title: "טודו בום", artist: "סטטיק ובן אל תבורי", year: 2016, youtubeId: "Y_OLslE3bX8" },
  { title: "כל הזמן הזה", artist: "נצ'י נצ'", year: 2016, youtubeId: "202bsnoeepM" },
  { title: "פעם בחיים", artist: "עומר אדם", year: 2016, youtubeId: "Iwv-aggzNbk" },
  { title: "רציתי", artist: "עדן בן זקן", year: 2016, youtubeId: "jUwQ94VMpmw" },
  { title: "תבואי היום", artist: "אייל גולן", year: 2016, youtubeId: "3VT3VIRQPKA" },
  { title: "תמיד חלמתי", artist: "אליעד", year: 2016, youtubeId: "W0z0CVN5MPQ" },
  { title: "אולי נדבר", artist: "נדב גדג'", year: 2017, youtubeId: "BbHcS69tCV0" },
  { title: "הכי קרוב אלייך", artist: "עילי בוטנר ואביב אלוש", year: 2017, youtubeId: "Sqi1cdBvXm4" },
  { title: "ואם תבואי אליי", artist: "עידן רייכל", year: 2017, youtubeId: "nI8n20UpaBY" },
  { title: "חברות שלך", artist: "עומר אדם", year: 2017, youtubeId: "D-DeH1KTwN4" },
  { title: "חיים שלי", artist: "עדן בן זקן", year: 2017, youtubeId: "qEEzKfGa1oY" },
  { title: "לשוב הביתה", artist: "ישי ריבו", year: 2017, youtubeId: "Y30pfWIQfoo" },
  { title: "קאוואי", artist: "סטטיק ובן אל תבורי", year: 2017, youtubeId: "boOCP7GZeds" },
  { title: "שמישהו יעצור אותי", artist: "עדן חסון", year: 2017, youtubeId: "pse5JzwHVtM" },
  { title: "שני משוגעים", artist: "עומר אדם", year: 2017, youtubeId: "WLMmX17D2uw" },
  { title: "שתישרף האהבה", artist: "איתי לוי", year: 2017, youtubeId: "RqVG3gRMeIE" },
  { title: "Toy", artist: "נטע ברזילי", year: 2018, youtubeId: "CziHrYYSyPc" },
  { title: "אין יותר מועדונים", artist: "עדן חסון", year: 2018, youtubeId: "hySvIlHhCgA" },
  { title: "אלוף העולם", artist: "חנן בן ארי", year: 2018, youtubeId: "jlCNqyY-fAk" },
  { title: "הזוג הזה", artist: "מרגי", year: 2018, youtubeId: "TnjMVlbRKX8" },
  { title: "הלב שלי", artist: "ישי ריבו", year: 2018, youtubeId: "6U_5KhaH6IM" },
  { title: "כפיות", artist: "עדן חסון", year: 2018, youtubeId: "cw1RfSKjXDU" },
  { title: "ממה את מפחדת", artist: "אייל גולן ובניה ברבי", year: 2018, youtubeId: "105ozLuO1Kg" },
  { title: "מסע", artist: "אליעד", year: 2018, youtubeId: "zRIn7W-kXhs" },
  { title: "שבט אחים ואחיות", artist: "אמני ישראל", year: 2018, youtubeId: "a6H3RBIRy58" },
  { title: "תפסת לי מקום", artist: "בניה ברבי", year: 2018, youtubeId: "3K-KnCX69Kk" },
  { title: "אם תרצי", artist: "חנן בן ארי", year: 2019, youtubeId: "Y-_XAt1OFNI" },
  { title: "הולכת איתך", artist: "נרקיס", year: 2019, youtubeId: "9Byigq62IHY" },
  { title: "חסד", artist: "ישי ריבו", year: 2019, youtubeId: "K1qMN8qiCbQ" },
  { title: "טרילילי טרללה", artist: "נועה קירל ואילן פלד", year: 2019, youtubeId: "QB8NuvDML2I" },
  { title: "יאסו", artist: "סטטיק ובן אל תבורי, עדן בן זקן וסטפן לגר", year: 2019, youtubeId: "VTRMdOMeKCk" },
  { title: "יוצא לאור", artist: "אייל גולן", year: 2019, youtubeId: "ro6WVedLIDE" },
  { title: "מספיק טוב", artist: "עידן רייכל", year: 2019, youtubeId: "Z0lWh1oWaU8" },
  { title: "פאוץ׳", artist: "נועה קירל", year: 2019, youtubeId: "_9a6fn4FgI8" },
  { title: "קומסי קומסה", artist: "סטטיק ובן אל תבורי", year: 2019, youtubeId: "PuDfh4F0aKc" },
  { title: "שלמים", artist: "עידן חביב", year: 2019, youtubeId: "5ejT8FqglLM" },
  // ── 2020s ────────────────────────────────────────
  { title: "אין אותי יותר", artist: "איתי לוי", year: 2020, youtubeId: "hCV8wlLSFZQ" },
  { title: "אם תרצי", artist: "חנן בן ארי", year: 2020, youtubeId: "Y-_XAt1OFNI" },
  { title: "אמבולנס", artist: "נועה קירל", year: 2020, youtubeId: "_yHBHDkls-A" },
  { title: "אפס מאמץ", artist: "סטטיק ובן אל תבורי ונטע ברזילי", year: 2020, youtubeId: "NpDAFKqeUDw" },
  { title: "בית משוגעים", artist: "רן דנקר", year: 2020, youtubeId: "PqxUV9xk7T4" },
  { title: "הגעגוע", artist: "עידן רייכל", year: 2020, youtubeId: "6AU-cjJ_-4A" },
  { title: "חצי משוגע", artist: "עומר אדם", year: 2020, youtubeId: "Bj6zZL3QJWg" },
  { title: "מיליון דולר", artist: "נועה קירל ושחר סאול", year: 2020, youtubeId: "oQbh5Kvet04" },
  { title: "קוקוריקו", artist: "עומר אדם", year: 2020, youtubeId: "yMlNmdyim8w" },
  { title: "קטן עלינו", artist: "אמני ישראל", year: 2020, youtubeId: "kB0_vTznm_8" },
  { title: "רסיסים", artist: "רביב כנר", year: 2020, youtubeId: "fwY4EJRM7ak" },
  { title: "שלמים", artist: "עידן חביב", year: 2020, youtubeId: "5ejT8FqglLM" },
  { title: "שמש", artist: "חנן בן ארי", year: 2020, youtubeId: "AmKkovDO1_w" },
  { title: "הולכת איתך", artist: "נרקיס", year: 2021, youtubeId: "9Byigq62IHY" },
  { title: "החיים שלנו תותים", artist: "חנן בן ארי", year: 2021, youtubeId: "UgymU4YRGlw" },
  { title: "היי בייב", artist: "אנה זק", year: 2021, youtubeId: "d4mg3lYyj8g" },
  { title: "חולם כמו יוסף", artist: "נס וסטילה", year: 2021, youtubeId: "8-eM3jecbDU" },
  { title: "טרילילי טרללה", artist: "נועה קירל ואילן פלד", year: 2021, youtubeId: "QB8NuvDML2I" },
  { title: "כל הכוכבים בוכים בלילה", artist: "אייל גולן", year: 2021, youtubeId: "IBnO5yYG9eQ" },
  { title: "לך לישון", artist: "אנה זק", year: 2021, youtubeId: "LtY23Aq1mTI" },
  { title: "מועבט", artist: "עדן בן זקן", year: 2021, youtubeId: "InL5HRufTdc" },
  { title: "מי לא יבוא", artist: "אנה זק", year: 2021, youtubeId: "3gG4ZqlafPg" },
  { title: "מסיבה", artist: "יסמין מועלם ושקל", year: 2021, youtubeId: "RsErNvzEQ5I" },
  { title: "סוף העולם", artist: "עומר אדם", year: 2021, youtubeId: "blbGw_VzrZA" },
  { title: "עד שתבואי עד אליי", artist: "אושר כהן", year: 2021, youtubeId: "5gJkRXxFkcM" },
  { title: "קרן שמש", artist: "בניה ברבי", year: 2021, youtubeId: "hCzgxPFtsa0" },
  { title: "אוהבת אותי אמיתי", artist: "עדן חסון", year: 2022, youtubeId: "31DIsGbFVgY" },
  { title: "אינטלקטוערס", artist: "אודיה", year: 2022, youtubeId: "LN0fW3WpfH0" },
  { title: "דובשנייה", artist: "שחר סאול, אגם בוחבוט ונורוז", year: 2022, youtubeId: "0aoNAe3BhAg" },
  { title: "הולכת איתך", artist: "נועה קירל", year: 2022, youtubeId: "wSQCw8IEjOA" },
  { title: "ליבינג דה דרים", artist: "עומר אדם", year: 2022, youtubeId: "aQwsrMALueY" },
  { title: "מי זאת", artist: "אנה זק", year: 2022, youtubeId: "bcuRKDY0Rz0" },
  { title: "מנגן ושר", artist: "אושר כהן", year: 2022, youtubeId: "AZMuSrWcsEg" },
  { title: "פנתרה", artist: "נועה קירל", year: 2022, youtubeId: "ZOf7aMbzQAM" },
  { title: "פעמון", artist: "נועה קירל ואיתי גלו", year: 2022, youtubeId: "InIRjIqPKt4" },
  { title: "קאקדילה", artist: "עומר אדם", year: 2022, youtubeId: "Tw2NJNzDi1I" },
  { title: "קופידון", artist: "נועה קירל", year: 2022, youtubeId: "C1ToP8UZr-s" },
  { title: "תיק קטן", artist: "נס וסטילה", year: 2022, youtubeId: "pVaeEK1WC2M" },
  { title: "תמיד נשאר אני", artist: "רביב כנר", year: 2022, youtubeId: "rkMf3maCz3o" },
  { title: "Unicorn", artist: "נועה קירל", year: 2023, youtubeId: "r4wbdKmM3bQ" },
  { title: "אהבה", artist: "אודיה", year: 2023, youtubeId: "-34CwfsgFWs" },
  { title: "אהבה חולה", artist: "פאר טסי", year: 2023, youtubeId: "SNRBruxYezA" },
  { title: "אוהבת אותך", artist: "אושר כהן", year: 2023, youtubeId: "Wp0RlSkrWjU" },
  { title: "אין לך מה לדאוג", artist: "עידן עמדי", year: 2023, youtubeId: "Lr5U5MjrQ1o" },
  { title: "אמת", artist: "אודיה", year: 2023, youtubeId: "ljD_vcNYBMI" },
  { title: "חרבו דרבו", artist: "נס וסטילה", year: 2023, youtubeId: "mhYkotHyBjY" },
  { title: "לצאת מדיכאון", artist: "יגל אושרי", year: 2023, youtubeId: "-Kx2IQ6maiI" },
  { title: "עם ישראל חי", artist: "אייל גולן", year: 2023, youtubeId: "1HgKB4-kQdA" },
  { title: "שקיעות אדומות", artist: "עדן חסון", year: 2023, youtubeId: "1SnITI99Y5E" },
  { title: "תרקדי", artist: "אושר כהן", year: 2023, youtubeId: "MnQz0P4F30I" },
  { title: "Hurricane", artist: "עדן גולן", year: 2024, youtubeId: "u60Ge6klIts" },
  { title: "אוקטובר ריין", artist: "עדן גולן", year: 2024, youtubeId: "DMdRpdDIm84" },
  { title: "בין האצבעות", artist: "אודיה", year: 2024, youtubeId: "nxX0KeEJcss" },
  { title: "חלק ממני", artist: "אושר כהן", year: 2024, youtubeId: "gV70CqscjPQ" },
  { title: "ילד מטריה", artist: "אביתר בנאי", year: 2024, youtubeId: "lrwNEHhcJC4" },
  { title: "ילדה של אמונה", artist: "עדן בן זקן", year: 2024, youtubeId: "Hlzqr3YN_fo" },
  { title: "מגדלים", artist: "מרגי", year: 2024, youtubeId: "bWz97rgzxLE" },
  { title: "ניצחון", artist: "פאר טסי", year: 2024, youtubeId: "cyEK8wlMnQI" },
  { title: "סיבה לנשום", artist: "חנן בן ארי", year: 2024, youtubeId: "GrKJ1KDnxtU" },
  { title: "צמוד צמוד", artist: "אודיה", year: 2024, youtubeId: "dFqAtitDNvs" },
  { title: "רחוק מכולם", artist: "אושר כהן", year: 2024, youtubeId: "ks6cDQ0yQoY" },
  { title: "תמיד אוהב אותי", artist: "ששון איפרם שאולוב", year: 2024, youtubeId: "T_oxRL862dQ" },
  { title: "Amber Skies", artist: "יובל רפאל", year: 2025, youtubeId: "BMlSOheEcrM" },
  { title: "Michelle", artist: "נועם בתן", year: 2025, youtubeId: "j2uPlJndByI" },
  { title: "New Day Will Rise", artist: "יובל רפאל", year: 2025, youtubeId: "2FY8N0_w7b4" },
  { title: "אביר על סוס לבן באמצע פלורנטין", artist: "שירה זלוף", year: 2025, youtubeId: "iEzYLIRkOnY" },
  { title: "אדם שבור", artist: "עדן חסון", year: 2025, youtubeId: "8O2E_cTr2l0" },
  { title: "אהבה ראשונה", artist: "נדב חנציס", year: 2025, youtubeId: "j1FH6JQDMKM" },
  { title: "אחת ממיליון", artist: "רון חיון", year: 2025, youtubeId: "c_Uq3XnjzOc" },
  { title: "אמן", artist: "עדן גולן", year: 2025, youtubeId: "9SOWYtpLLWg" },
  { title: "בחיבק", artist: "תמר ריילי", year: 2025, youtubeId: "OBcsuJOslcU" },
  { title: "המבט בעיניך", artist: "אגם בוחבוט", year: 2025, youtubeId: "a7fvIbKoO24" },
  { title: "ואן דאם", artist: "אודיה", year: 2025, youtubeId: "9rfjuQDKj-Y" },
  { title: "מדאם", artist: "נועם בתן", year: 2025, youtubeId: "rqs8NZusLj8" },
  { title: "מטורפת", artist: "רואי אדם וציון ברוך", year: 2025, youtubeId: "KyupxGgDlys" },
  { title: "נגנב ממך", artist: "פול טראנק ונינט טייב", year: 2025, youtubeId: "N2KYvJXee2Q" },
  { title: "נחלת בנימין", artist: "איתי לוי", year: 2025, youtubeId: "3v_vYnzWTpI" },
  { title: "פרפרים", artist: "אודיה", year: 2025, youtubeId: "GmagbJ_bGZI" },
  { title: "אהבת השם", artist: "בן צור", year: 2026, youtubeId: "5m-riTk7N2I" },
  { title: "או לה פופה", artist: "נועה קירל", year: 2026, youtubeId: "aQfI0WP-fcE" },
  { title: "אין מילים איתך", artist: "פול טראנק", year: 2026, youtubeId: "UblBeozm6Bw" },
  { title: "בן 32", artist: "עומר אדם", year: 2026, youtubeId: "7PE611GuMAk" },
  { title: "בסיבוב הבא", artist: "עדן בן זקן", year: 2026, youtubeId: "6w3VtWW7Owc" },
  { title: "כולם גנבים", artist: "אושר כהן", year: 2026, youtubeId: "INKpPFwOQLY" },
  { title: "לב לבן", artist: "שולי רנד", year: 2026, youtubeId: "c_rx1efu52w" },
  { title: "סחרחורות", artist: "מור", year: 2026, youtubeId: "1CoptyCZYLA" },
  { title: "רולקס וקסקט", artist: "עדן בן זקן", year: 2026, youtubeId: "7nVoHd4iFuw" },
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getSongPool(musicType) {
  if (musicType === 'hebrew') return HEBREW_SONGS;
  if (musicType === 'mix') return [...ALL_SONGS, ...HEBREW_SONGS];
  return ALL_SONGS;
}

export default function Game({ user, roomCode, isHost, selectedDecades, musicType, onLeave }) {
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(null);
  const [players, setPlayers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [submittedGuess, setSubmittedGuess] = useState(null); // stored after submit, shown only at reveal
  const [feedback, setFeedback] = useState(null);             // set at reveal time
  const [timeLeft, setTimeLeft] = useState(30);
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
        if (payload.year != null) {
          setPlayers(prev => ({ ...prev, [payload.userId]: { ...prev[payload.userId], lastGuess: payload.year } }));
        }
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

  // Countdown timer — 30s, triggers reveal at 0
  useEffect(() => {
    if (!currentQuestion || feedback !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          revealAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, feedback, revealAnswer]);

  // ── Helpers ────────────────────────────────────────────────────
  const resetQuestion = (song) => {
    revealedRef.current = false;
    submittedGuessRef.current = null;
    guessedIdsRef.current = new Set();
    setPlayers(prev => {
      const cleared = {};
      for (const k in prev) cleared[k] = { ...prev[k], lastGuess: null };
      return cleared;
    });
    setCurrentQuestion(song);
    setFeedback(null);
    setSubmittedGuess(null);
    setGuess('');
    setTimeLeft(30);
    setGuessedCount(0);
    setShowLeaderboard(false);
  };

  const handleHostNextQuestion = () => {
    let list = hostSongs;
    if (list.length === 0) {
      const allowed = DECADES
        .filter(d => selectedDecades.includes(d.label))
        .flatMap(d => getSongPool(musicType).filter(s => s.year >= d.start && s.year <= d.end));
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

  const handleNewRound = () => {
    const allowed = DECADES
      .filter(d => selectedDecades.includes(d.label))
      .flatMap(d => getSongPool(musicType).filter(s => s.year >= d.start && s.year <= d.end));
    const list = shuffleArray([...allowed]).slice(0, 10);
    setHostSongs(list);
    setQuestionIndex(0);
    const song = list[0];
    channel.send({ type: 'broadcast', event: 'new_question', payload: { song, round: 1 } });
    setRoundNumber(1);
    resetQuestion(song);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!guess || submittedGuess !== null) return;

    const guessedYear = parseInt(guess);
    submittedGuessRef.current = guessedYear;
    setSubmittedGuess(guessedYear);

    // Broadcast that this player submitted (not the guess value)
    channel.send({ type: 'broadcast', event: 'player_guessed', payload: { userId: user.id, year: guessedYear } });

    // Store own guess locally (own broadcast not received)
    setPlayers(prev => ({ ...prev, [user.id]: { ...prev[user.id], lastGuess: guessedYear } }));

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
                      <span className="neon-text" style={{ fontSize: '1.1rem', margin: '0 6px', color: timeLeft <= 10 ? '#ff4444' : '#ff00ff', textShadow: timeLeft <= 10 ? '0 0 10px #ff4444' : '0 0 10px #ff00ff' }}>{timeLeft}s</span>
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
                      <p style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', marginTop: '0.5rem', color: timeLeft <= 10 ? '#ff4444' : '#ff00ff', textShadow: timeLeft <= 10 ? '0 0 8px #ff4444' : '0 0 8px #ff00ff' }}>
                        {timeLeft}s remaining
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
                  {p.lastGuess != null ? (
                    <div style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                      color: p.lastGuess === currentQuestion?.year ? '#00ff88' : '#ff8844',
                      textShadow: p.lastGuess === currentQuestion?.year ? '0 0 8px #00ff88' : '0 0 8px #ff8844',
                      minWidth: '3.5rem', textAlign: 'center',
                    }}>
                      {p.lastGuess}
                    </div>
                  ) : (
                    <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', color: '#444', minWidth: '3.5rem', textAlign: 'center' }}>
                      —
                    </div>
                  )}
                  <div style={{ fontFamily: "'Press Start 2P', cursive", fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', color: '#0ff', textShadow: '0 0 8px #0ff' }}>
                    {p.score || 0} pts
                  </div>
                </div>
              ))}
            {isHost && (
              roundNumber >= 10 ? (
                <button className="neon-btn full-width" style={{ marginTop: '1.25rem', borderColor: '#ff00ff', color: '#ff00ff' }} onClick={handleNewRound}>
                  NEW ROUND →
                </button>
              ) : (
                <button className="neon-btn full-width" style={{ marginTop: '1.25rem' }} onClick={handleHostNextQuestion}>
                  NEXT SONG →
                </button>
              )
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
