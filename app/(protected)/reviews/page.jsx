"use client";
import React, { useEffect, useState } from "react";
import { 
  Download, Sparkles, Share2, MessageSquare, Camera, MessageCircle,
  ThumbsUp, Meh, ArrowRight, User
} from "lucide-react";
import clsx from "clsx";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews?page=1&limit=10");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const getSentiment = (stars) => {
    if (stars >= 4) return { label: "Positive Sentiment", icon: ThumbsUp, color: "text-emerald-700 bg-emerald-100" };
    if (stars === 3) return { label: "Neutral Sentiment", icon: Meh, color: "text-slate-700 bg-slate-200" };
    return { label: "Needs Action", icon: MessageSquare, color: "text-red-700 bg-red-100" };
  };

  const getSource = (idx) => {
    const sources = ["GOOGLE", "FACEBOOK", "SURVEY"];
    return sources[idx % sources.length];
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Reputation Engine</h1>
          <p className="text-slate-500 text-sm">Real-time sentiment and market perception analysis.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="bg-[#0f4098] hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm">
            <Sparkles className="w-4 h-4" /> Run AI Audit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Scores & Stream) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Global Score Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 mb-2 w-full justify-center">
                <Sparkles className="w-4 h-4 text-[#0f4098]" />
                <span className="text-sm font-bold text-slate-900">Global Reputation Score</span>
              </div>
              <div className="w-32 h-32 rounded-full border-8 border-emerald-600 flex flex-col items-center justify-center p-2 relative">
                 <span className="text-4xl font-bold text-slate-900">4.8</span>
                 <span className="text-xs font-bold text-slate-400">/ 5.0</span>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-3 gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8 w-full">
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">GOOGLE</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">4.9</p>
                <p className="text-xs font-bold text-emerald-600 flex items-center">↑ 0.2</p>
              </div>
              <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-8">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">FACEBOOK</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">4.6</p>
                <p className="text-xs font-bold text-slate-400 flex items-center">— 0.0</p>
              </div>
              <div className="flex flex-col border-l border-slate-100 pl-4 md:pl-8">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">SURVEY</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">4.8</p>
                <p className="text-xs font-bold text-emerald-600 flex items-center">↑ 0.5</p>
              </div>
            </div>
          </div>

          {/* Feedback Stream */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Live Feedback Stream</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full cursor-pointer hover:bg-slate-300 transition-colors">ALL</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full cursor-pointer transition-colors">POSITIVE</span>
                <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full cursor-pointer hover:bg-red-100 transition-colors">NEEDS ACTION</span>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
                  Loading reviews...
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
                  No recent reviews available.
                </div>
              ) : (
                reviews.map((review, idx) => {
                  const sentiment = getSentiment(review.stars || 5);
                  const SIcon = sentiment.icon;
                  const source = getSource(idx);
                  const isPositive = (review.stars || 5) >= 4;
                  
                  return (
                    <div key={review._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                            {review.author ? review.author.substring(0,2).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{review.author || "Unknown"}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">{source}</span>
                              <span className="text-xs text-slate-400">2 hours ago</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-slate-700 mb-6 leading-relaxed">
                        {review.review || review.title}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold", sentiment.color)}>
                          <SIcon className="w-3.5 h-3.5" /> {sentiment.label}
                        </div>
                        
                        <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                        
                        {isPositive ? (
                          <div className="flex items-center gap-2 text-xs font-bold text-[#0f4098]">
                            <Sparkles className="w-3.5 h-3.5" /> AI Responded (Auto-Thanks)
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-2 text-xs font-bold text-red-600">
                              <Sparkles className="w-3.5 h-3.5" /> AI Draft Ready - Needs Approval
                            </span>
                            <button className="bg-[#0f4098] text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-blue-900 transition-colors">
                              Review Draft
                            </button>
                            <button className="text-[#0f4098] text-xs font-bold hover:underline">
                              Assign to Manager
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              
              <button className="w-full py-4 border border-slate-200 border-dashed rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="space-y-6">
          
          {/* AI Insight */}
          <div className="bg-[#f8faff] border border-blue-100 rounded-xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles className="w-4 h-4 text-[#0f4098]" />
              <span className="text-sm font-bold text-[#0f4098] tracking-wider uppercase">AI SENTIMENT INSIGHT</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed relative z-10 mb-4">
              Analysis of the last 30 days indicates a <strong>15% increase</strong> in positive mentions regarding "financing transparency." However, "wait times" during weekend handovers are emerging as a negative trend.
            </p>
            <button className="text-sm font-bold text-[#0f4098] flex items-center gap-1 hover:underline relative z-10">
              View Full Analysis <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Sparkles className="absolute -right-8 -bottom-8 w-40 h-40 text-blue-50 pointer-events-none" />
          </div>

          {/* Top Rated Staff */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-900">Top Rated Staff</h3>
               <Sparkles className="w-4 h-4 text-slate-400" />
             </div>
             <div className="space-y-5">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 relative">
                     <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                       <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">TM</div>
                     </div>
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">1</div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">Tariq M.</p>
                       <p className="text-[10px] font-bold text-slate-400">24 Mentions</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-1 font-bold text-sm text-slate-900">
                     4.9 <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 relative">
                     <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                       <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">LS</div>
                     </div>
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-slate-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">2</div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">Laila S.</p>
                       <p className="text-[10px] font-bold text-slate-400">18 Mentions</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-1 font-bold text-sm text-slate-900">
                     4.7 <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 relative">
                     <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                       <div className="w-full h-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold">OK</div>
                     </div>
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">3</div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">Omar K.</p>
                       <p className="text-[10px] font-bold text-slate-400">12 Mentions</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-1 font-bold text-sm text-slate-900">
                     4.5 <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                   </div>
                </div>
             </div>
          </div>

          {/* Amplify Good News */}
          <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 text-center flex flex-col items-center">
            <h3 className="font-bold text-slate-900 mb-2">Amplify Good News</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[200px]">Turn 5-star reviews into social proof graphics instantly.</p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <Camera className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
