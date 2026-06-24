import { useEffect } from 'react'
import { applyMeta } from '../lib/seo'
import './ForGiselle.css'

// Human-voice-only memorial content. Source of truth:
// Personas/About-Page-Memorials-and-Dedication-DRAFT.md (Stacey-approved).
// This page is the projection of that draft onto the footer-linked "For Giselle" page.
function ForGiselle() {
    useEffect(() => {
        applyMeta({
            title: 'For Giselle | Sunday Brunch With Giselle',
            description: 'A dedication to Giselle, and to the Shelties who came before — the love letter at the heart of Sunday Brunch With Giselle.'
        })
    }, [])

    return (
        <div className="for-giselle-page">
            {/* Hero — mirrors the home page's gradient photo-frame + pawprint washi
                tape, so Giselle's portrait introduces the page and her name reads
                like a plaque beneath it. */}
            <section className="for-giselle__hero" aria-labelledby="for-giselle-title">
                <span className="for-giselle__hero-washi" aria-hidden="true">
                    <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M0 5 L2 2 L5 0 L95 0 L98 2 L100 5 L100 25 L98 28 L95 30 L5 30 L2 28 L0 25 Z" fill="rgba(232, 223, 245, 0.8)" opacity="0.8" />
                        <path d="M0 0 L100 0" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="2,2" />
                        <path d="M0 30 L100 30" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                        <g opacity="0.4">
                            <ellipse cx="15" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="12" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="15" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="18" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="35" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="32" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="35" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="38" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="50" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="47" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="50" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="53" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="65" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="62" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="65" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="68" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="85" cy="15" rx="1.5" ry="2" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="82" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="85" cy="10" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                            <ellipse cx="88" cy="11" rx="1" ry="1.3" fill="rgba(93, 77, 122, 0.6)" />
                        </g>
                    </svg>
                </span>

                <div className="for-giselle__hero-frame">
                    <img
                        src="/assets/giselle-hero.jpg"
                        alt="Giselle, a sable-and-white Sheltie, resting atop a blue agility A-frame in the autumn woods"
                        width="728"
                        height="728"
                        loading="eager"
                        decoding="async"
                    />
                </div>

                <div className="for-giselle__hero-caption">
                    <h1 id="for-giselle-title">For Giselle</h1>
                    <p className="for-giselle__hero-dates">2015 &ndash; 2026</p>
                </div>
            </section>

            <details className="rainbow-bridge for-giselle__card">
                <summary className="rainbow-bridge__summary">
                    <span className="rainbow-bridge__title">The Rainbow Bridge</span>
                    <span className="rainbow-bridge__hint" aria-hidden="true">
                        unfold the story
                        <span className="rainbow-bridge__chevron"></span>
                    </span>
                </summary>
                <div className="rainbow-bridge__body">
                    <p className="rainbow-bridge__intro">There&rsquo;s a story a lot of us hold onto when a dog&rsquo;s light goes on ahead. I keep it here, for Giselle and for all of them.</p>

                    <blockquote className="rainbow-bridge__story">
                        <p>Just this side of heaven is a place called the Rainbow Bridge.</p>

                        <p>When an animal dies that has been especially close to someone here, that pet goes to the Rainbow Bridge. There are meadows and hills for all of our special friends so they can run and play together. There is plenty of food, water, and sunshine, and our friends are warm and comfortable.</p>

                        <p>All the animals who had been ill and old are restored to health and vigor. Those who were hurt or maimed are made whole and strong again, just as we remember them in our dreams of days and times gone by. The animals are happy and content, except for one small thing: they each miss someone very special, someone who had to be left behind.</p>

                        <p>They all run and play together, but the day comes when one suddenly stops and looks into the distance. Bright eyes intent, eager body quivering. Suddenly she begins to run from the group, flying over the green grass, her legs carrying her faster and faster.</p>

                        <p>You have been spotted, and when you and your special friend finally meet, you cling together in joyous reunion, never to be parted again. The happy kisses rain upon your face; your hands again caress the beloved head, and you look once more into the trusting eyes of your friend, so long gone from your life but never absent from your heart.</p>

                        <p>Then you cross the Rainbow Bridge together.</p>
                    </blockquote>

                    <p className="rainbow-bridge__attribution">&mdash; author unknown, passed hand to hand among those who&rsquo;ve loved and lost a dog</p>
                </div>
            </details>

            <section className="for-giselle__dedication for-giselle__card">
                <p>This whole table is named after a fourteen-pound dog who didn&rsquo;t much care for people and loved me like it was her entire job.</p>

                <p>Giselle was my shadow. She came everywhere, supervised everything, and had opinions about all of it. The afternoon the other dogs found a gap in the fence and went off adventuring, she stayed &mdash; I came outside and found her pressed right up against the door, waiting, because wherever I was happened to be the only place she ever wanted to be. She had this enormous personality that almost nobody else ever got to see, because she saved it for the few she&rsquo;d decided were hers. I was the lucky one she picked.</p>

                <p>If you know what it&rsquo;s like to be fully yourself with only a precious few &mdash; to be &ldquo;too much&rdquo; everywhere but home &mdash; then you already understand her. She was so much like me. That&rsquo;s why her name is on the door.</p>

                <p>She left us suddenly, in the late winter of 2026, after eleven good years, and I&rsquo;m not going to pretend that part is anything but hard. But loving a dog is a bargain you make with your eyes wide open: they come into your life like shooting stars, they make everything brighter, and one day their light goes on ahead to wait for us. I&rsquo;d pay that price a thousand times over for what she gave me.</p>

                <p>So this is me keeping her. This whole place &mdash; the recipes, the podcast, the four bossy dogs underfoot in the kitchen &mdash; isn&rsquo;t really just a cute little baking blog. It&rsquo;s a love letter: to her, and to all my Shelties, the ones still here and the ones who went before. As long as it&rsquo;s alive, a little piece of her is too. And the piece I get to share with you is the truest one there is &mdash; the Giselle she only ever showed me. In these pages she&rsquo;s exactly who she always was: the queen at the head of the table, handing down her verdicts, completely unbothered and entirely in charge.</p>

                <p>Pull up a chair. And save her the good seat &mdash; she&rsquo;ll want it.</p>

                <p className="for-giselle__signature">&mdash; Stacey</p>
            </section>

            <div className="for-giselle__divider" aria-hidden="true">🐾 🐾 🐾</div>

            <section className="for-giselle__memorials for-giselle__card" aria-labelledby="those-who-came-before">
                <h2 id="those-who-came-before">Those who came before</h2>

                <p>Every dog who&rsquo;s shared my life is still here &mdash; in the way the ones we love always are, tucked into the stories and carried on by the dogs who came after them. Every so often you&rsquo;ll meet one of them here as a guest, with a recipe of their very own. We start with the one who started it all.</p>

                <article className="for-giselle__memorial">
                    <img
                        className="for-giselle__memorial-photo"
                        src="/assets/athena-memorial.jpg"
                        alt="Athena, a tricolor Sheltie, flying mid-air over an agility jump at a 2009 competition in Louisville, Kentucky"
                        width="604"
                        height="483"
                        loading="lazy"
                        decoding="async"
                    />
                    <h3>Athena <span className="for-giselle__years">(2004&ndash;2021)</span></h3>

                    <p>Before there was a Giselle, before there was a table, there was Athena &mdash; my heart dog.</p>

                    <p>She was thirteen inches and twelve and a half pounds of pure, fearless joy, and she let me dream as big as I wanted to. For years the two of us ran agility together, traveling the country weekend after weekend, and she made me look like a real handler long before I actually was one. We tried a dozen different dog sports, and she threw herself into every one with the same delighted <em>what&rsquo;s next?</em> She was the smartest dog I&rsquo;ve ever known &mdash; and trust me, I&rsquo;ve known a lot of them &mdash; but it was never the brains I loved best. It was the heart. She gave me everything she had, every single time.</p>

                    <p>She also never met a job she didn&rsquo;t intend to run. Every move, every project, there she&rsquo;d be, planted nearby, certain the whole operation needed her. It&rsquo;s how she earned the only title that ever stuck: the supervisor. Though let&rsquo;s be honest about what she was mostly supervising: snacks. She was a shark, kept lean only because I had to be strict about her agility diet, convinced that if she stared hard enough, any project in that kitchen might end in a treat for her. (You&rsquo;ll catch her on her cushion in our very first recipe, presiding over a much younger, much more frantic me.)</p>

                    <p>She stayed for sixteen and a half years, and at the very end, I think she was only holding on for me. She let go the night I finally told her it was okay &mdash; that I&rsquo;d be alright, that she&rsquo;d done enough. She&rsquo;d done so much more than enough.</p>

                    <p>After she was gone, I spent more than forty hours drawing her in colored pencil, crying off and on the whole way through. Last summer I finally worked up the nerve to enter it at the state fair. Of the four pieces I submitted, hers was the one that placed. Of course it was.</p>

                    <p>You can see her in Tiana now &mdash; that same carefree, sunlit joy, come back around. It took me a lot of years and a lot of love to find my way back to it. Athena would be glad. She never did like the road to end.</p>
                </article>
            </section>
        </div>
    )
}

export default ForGiselle
