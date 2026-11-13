// Editorial connections, not mutually exclusive categories. Every link has a reason.
export const themes = [
 {id:'freedom', short:'Freedom', q:'Who’s actually in control?',
  intro:'I keep coming back to freedom, but it means different things in different rooms. Sometimes it is being able to speak. Sometimes it is noticing a rule I have been obeying without knowing it. Sometimes I am the one setting the rules.',
  entries:[
   ['/writing/en/svoboda/','The starting point: freedom as an ongoing attempt to undo fear and conditioning.'],
   ['/experiments/sack-the-tyrant/','A staged protest becomes a place where people test what they feel allowed to say.'],
   ['/writing/en/a-sunny-day/','In the book, wealth and proximity to power offer much less protection than they appear to.'],
   ['/writing/en/is-freedom-a-lack-of-responsibility/','The absence of obligations turns out to be a poor substitute for choosing what matters.'],
   ['/writing/ru/sobriety/','Sobriety brings the question of agency into the habits and relationships of everyday life.'],
   ['/writing/en/safety-third/','A bodyguard and a go-bag make the limits of that apparent freedom very concrete.'],
   ['/writing/ru/language-i-recognise/','Recognising the habits of authority in everyday life in Tbilisi.'],
   ['/writing/en/note-74/','A morning’s reading about English history becomes a confrontation with the punishment of dissent.'],
   ['/writing/en/foundation/','Even a story about saving civilisation has to reckon with the people who decide its future.']
  ]},
 {id:'feeling', short:'Feeling', q:'Can you feel what I feel?',
  intro:'A colour, a room, a story, a person paying attention. I am interested in how little it can take for an internal experience to reach someone else, and how much gets lost or changed on the way.',
  entries:[
   ['/experiments/belka/','Brain activity becomes a changing colour. The people watching make something of that signal.'],
   ['/writing/en/soul-internet/','A personal account of emotional connection, acting and the difficulty of letting go of control.'],
   ['/experiments/waldorf-project/','The same work can feel extraordinary or unbearable depending on the room and the trust it creates.'],
   ['/experiments/greed-is-god/','An unexpected response: participants tell me that feeling the shocks changed how they thought about animals.'],
   ['/writing/en/melancholy-is-a-friend/','Trying to turn the feeling of a world in pain into attention and action.']
  ]},
 {id:'home', short:'Home', q:'What makes a place home?',
  intro:'I have left places, lost places and tried to make new ones. A home needs somewhere to sit and running water. It also needs people, a relationship with its surroundings, and some way of belonging that survives an interruption.',
  entries:[
   ['/personal/apartment/','Sobriety makes the absence of a home harder to ignore. Building one becomes a way of learning how I want to live.'],
   ['/personal/kurin/','A weekend place grows into a relationship with a village, its craftspeople and the people who come to stay.'],
   ['/writing/en/moscow-born/','What does a birthplace say about you after you have left, and after the country has gone to war?'],
   ['/writing/ru/note-71/','Looking back at a city I once thought belonged to me.'],
   ['/experiments/sack-the-tyrant/','A festival’s promise of a cosy home away from home runs into the reasons people had to leave.']
  ]},
 {id:'desire', short:'Desire', q:'What are we really chasing?',
  intro:'Money, a watch, a summit, approval. The prize is easy to name. The reason we want it is often much less obvious. I like putting those two things next to each other and watching the story change.',
  entries:[
   ['/experiments/greed-is-god/','I offered a fake Rolex. The people who kept going seemed to want fun, rivalry or a point proved.'],
   ['/experiments/shocker/','Take away the crowd and a high score starts to lose its appeal.'],
   ['/writing/en/every-wedding-is-a-battlefield/','Watching the distance between what people say they want and the performance they put on for each other.'],
   ['/writing/en/election-day/','A student election, a few bottles of vodka, and my own willingness to play the game.'],
   ['/writing/en/human-pyramid/','The hierarchy of the Moscow world, seen from inside it.'],
   ['/writing/en/dubai/','An essay about the hierarchy beneath the promises of wealth and comfort.'],
   ['/writing/ru/sterligov/','An essay about turning a public persona into a world with its own rules.'],
   ['/writing/ru/icarus/','Political satire takes ambition, rewards and obedience to an absurd conclusion.'],
   ['/writing/en/mera-climb-2/','Near the summit, wanting to finish and knowing when to turn around stop being the same thing.']
  ]},
 {id:'care', short:'Care', q:'What do we owe each other?',
  intro:'A lot of this work begins with other people. Making something together brings obligations that outlast the exciting idea: doing the work, giving credit, looking after someone, knowing when a relationship cannot carry on.',
  entries:[
   ['/writing/en/how-i-met-your-dog/','Helping an injured dog becomes an inconvenient, demanding and increasingly personal commitment.'],
   ['/personal/kurin/','Mykola’s craft and my concern for comfort meet in a place that now supports other people too.'],
   ['/experiments/fml48/','The event ends, but developing a winner’s project takes much longer. Its value is not only in a finished film.'],
   ['/experiments/waldorf-project/','An audience having a wonderful time does not settle whether the working relationship can continue.'],
   ['/writing/en/isa-my-chechen-friend/','A friendship complicates an inherited prejudice, then violence changes the person I knew.'],
   ['/writing/en/is-freedom-a-lack-of-responsibility/','Chosen responsibilities can give a life direction rather than take its freedom away.']
  ]},
 {id:'change', short:'Becoming', q:'What changes us?',
  intro:'I left finance without knowing what I would become. Getting sober, learning to act, making a home, making art: each changed what I could notice, what I wanted, or what I thought I was capable of. The work in this thread is also work that did something to me.',
  entries:[
   ['/writing/en/svoboda/','Meditation, therapy, acting and sobriety as ways of loosening the conditioning I grew up with.'],
   ['/writing/ru/sobriety/','Getting sober, and learning to build a life I want to stay present for.'],
   ['/writing/en/soul-internet/','Acting brings me into contact with desire and fear I thought I had already understood.'],
   ['/experiments/greed-is-god/','The first piece I could look at and feel that I had become an artist.'],
   ['/personal/apartment/','After getting sober, making a home becomes a way of finding out how I want to live.'],
   ['/experiments/ocean-within/','The film takes years. In the meantime, the person trying to finish it changes too.'],
   ['/writing/en/mera-climb-1/','A physical challenge begins to expose the motivations I brought to it.'],
   ['/writing/en/mera-climb-2/','Turning around changes what I can recognise as an achievement.'],
   ['/experiments/belka/','Looking back at a refusal I was proud of, I discover that I no longer see the boundary in the same way.']
  ]}
].map(t=>({...t,urls:t.entries.map(([url])=>url)}));
export const themeURL=t=>'/questions/'+t.id+'/';
export const entryID=url=>'work-'+url.split('/').filter(Boolean).join('-');
