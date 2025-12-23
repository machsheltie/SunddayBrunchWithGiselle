import React from 'react';
import AudioPlayer from '../components/AudioPlayer';
import RecipeCard from '../components/RecipeCard';

const EpisodePage = () => {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section */}
            <header className="bg-white border-b-4 border-terracotta pt-20 pb-16 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lavender via-copper to-terracotta"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="text-copper font-heading font-bold tracking-widest uppercase text-sm mb-4 block">Episode 01</span>
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-brown mb-6">The Pie That Started a Dynasty</h1>
                    <p className="text-xl md:text-2xl font-body text-brown-light max-w-2xl mx-auto leading-relaxed">
                        A story about survival, finding your voice, and the chocolate silk pie that changed everything. Featuring a very opinionated Sheltie.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                {/* Audio Section */}
                <section className="mb-16">
                    <AudioPlayer src="#" title="The Pie That Started a Dynasty" />
                    <div className="text-center text-sm text-brown-light mt-4">
                        <a href="#" className="hover:text-copper underline mx-2">Apple Podcasts</a> •
                        <a href="#" className="hover:text-copper underline mx-2">Spotify</a> •
                        <a href="#" className="hover:text-copper underline mx-2">Download MP3</a>
                    </div>
                </section>

                {/* Show Notes & Recipe Grid */}
                <div className="grid md:grid-cols-1 gap-12 max-w-5xl mx-auto">

                    {/* Show Notes */}
                    <article className="prose prose-brown max-w-none">
                        <h2 className="text-3xl font-heading font-bold text-brown mb-6 border-l-4 border-lavender pl-4">Show Notes</h2>
                        <p className="mb-4">
                            In our pilot episode, Stacey shares the personal story behind her signature French Silk Pie—a recipe that wasn't just about dessert, but about claiming space in a world that often tells us we're "too much."
                        </p>
                        <p className="mb-4">
                            **Giselle's Royal Decree:** "If it jiggles and came from a box labeled 'instant,' it is not welcome at my table."
                        </p>
                        <p className="mb-8">
                            **Featured In This Episode:**
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Why room temperature eggs matter (according to science dogter Phaedra).</li>
                                <li>Havok's "Operation Chocolate Paradise" mission report.</li>
                                <li>Tiana's joy-filled tasting notes.</li>
                            </ul>
                        </p>
                    </article>

                    {/* Recipe Component */}
                    <section id="recipe">
                        <RecipeCard />
                    </section>

                    {/* Comments Placeholder */}
                    <section className="bg-white p-8 rounded-2xl shadow-soft border border-terracotta/20 mt-8">
                        <h3 className="text-2xl font-heading font-bold text-brown mb-6">Join the Conversation</h3>
                        <div className="bg-cream/50 p-6 rounded-xl text-center border-2 border-dashed border-terracotta">
                            <p className="text-brown mb-4">Comments are brewing! Check back soon to share your baking stories.</p>
                            <button className="bg-copper text-white px-6 py-2 rounded-lg hover:bg-brown transition-colors">
                                Sign Guestbook
                            </button>
                        </div>
                    </section>

                </div>
            </main>

            <footer className="bg-brown text-cream py-12 mt-20 text-center">
                <p className="font-heading text-2xl mb-4">Sunday Brunch With Giselle</p>
                <p className="text-terracotta text-sm">Whimsy, Warmth & Wags</p>
            </footer>
        </div>
    );
};

export default EpisodePage;
