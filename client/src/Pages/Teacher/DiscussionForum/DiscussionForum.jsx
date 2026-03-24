import React, { useState } from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';

const DiscussionForum = () => {
  const [activeTab, setActiveTab] = useState('all');

  const topics = [
    {
      id: 1,
      title: "Clarification on Newton's Second Law",
      author: "Sarah J.",
      role: "Student",
      date: "2 hours ago",
      replies: 12,
      tags: ["Physics", "Homework"],
      color: "bg-[#a855f7]"
    },
    {
      id: 2,
      title: "Project Submission Deadline Extension?",
      author: "Mike T.",
      role: "Student",
      date: "5 hours ago",
      replies: 45,
      tags: ["General", "Admin"],
      color: "bg-[#facc15]"
    },
    {
      id: 3,
      title: "Resources for Organic Chemistry",
      author: "Emily R.",
      role: "Student",
      date: "1 day ago",
      replies: 8,
      tags: ["Chemistry", "Resources"],
      color: "bg-[#22c55e]"
    }
  ];

  return (
    <div className="h-screen bg-[#121212] overflow-hidden flex flex-col font-sans">
      <TeacherNavbar activeTab="forum" />

      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
                Class <span className="text-[#facc15]">Forum</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg">Central hub for Q&A and class announcements</p>
            </div>
            
            <button className="bg-[#3b82f6] text-white px-8 py-4 text-xl font-black uppercase tracking-wide border-[4px] border-white rounded-[16px] shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_#fff] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#fff]">
              + New Topic
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Filters */}
            <div className="col-span-3 space-y-4">
              <FilterTab label="All Topics" active={activeTab === 'all'} onClick={() => setActiveTab('all')} count="142" />
              <FilterTab label="Announcements" active={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} count="8" color="text-[#facc15]" />
              <FilterTab label="Homework Help" active={activeTab === 'homework'} onClick={() => setActiveTab('homework')} count="64" color="text-[#a855f7]" />
              <FilterTab label="General" active={activeTab === 'general'} onClick={() => setActiveTab('general')} count="35" color="text-[#22c55e]" />
            </div>

            {/* Main Feed */}
            <div className="col-span-9 space-y-6">
              {topics.map((topic) => (
                <TopicCard key={topic.id} {...topic} />
              ))}
              
              {/* Load More */}
              <button className="w-full py-4 text-white font-bold uppercase tracking-widest border-2 border-dashed border-gray-700 rounded-xl hover:bg-gray-800 transition-colors">
                Load Older Topics
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const FilterTab = ({ label, active, onClick, count, color = "text-white" }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-6 py-4 rounded-xl font-bold flex justify-between items-center border-[3px] transition-all ${active ? 'bg-white text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]' : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'}`}
  >
    <span className={active ? 'text-black' : color}>{label}</span>
    <span className={`text-xs px-2 py-1 rounded ${active ? 'bg-black text-white' : 'bg-gray-800 text-gray-400'}`}>{count}</span>
  </button>
);

const TopicCard = ({ title, author, date, replies, tags, color }) => (
  <div className="bg-[#1e1e1e] border-[3px] border-black rounded-[20px] p-6 hover:bg-[#252525] transition-colors group cursor-pointer relative overflow-hidden">
    {/* Thread Color Indicator */}
    <div className={`absolute left-0 top-0 bottom-0 w-3 ${color}`}></div>
    
    <div className="pl-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 mb-2">
          {tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-1 rounded border border-gray-700">{tag}</span>
          ))}
        </div>
        <span className="text-gray-500 text-sm font-mono">{date}</span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#3b82f6] transition-colors">{title}</h3>
      
      <div className="flex justify-between items-center border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 border-2 border-white"></div>
          <span className="text-gray-300 font-medium text-sm">By <span className="text-white font-bold">{author}</span></span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          <span className="font-bold">{replies} replies</span>
        </div>
      </div>
    </div>
  </div>
);

export default DiscussionForum;
