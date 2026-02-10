import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleCourseClick = (courseId) => {
    navigate(`/learn-student/${courseId}`);
  };

  return (
    <div className="p-8 bg-[#fdfdfd] overflow-y-auto h-full scrollbar-hide font-mono">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
        }}
      />
      {/* Header Row */}
      <div className="mb-10">
        <h1 className="text-6xl font-black text-black tracking-tight underline decoration-[#FFD93D] decoration-8 underline-offset-8">
          My Classroom
        </h1>
        <p className="text-gray-500 mt-6 font-bold uppercase tracking-widest text-sm italic">
          Keep scribbling! Your progress is looking great.
        </p>
      </div>

      {/* --- Search Bar Section --- */}
      <div className="mb-12 max-w-8xl relative">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none z-10">
          <span className="text-2xl">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-[5px] border-black rounded-[25px] py-4 pl-16 pr-6 text-xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-gray-400 placeholder:italic"
        />
      </div>

      <div className="space-y-16">
        {/* Subject Group: Science */}
        <SubjectGroup title="Science & Nature" color="bg-[#98EECC]">
          <CourseCard 
            title="Botany & Plants" 
            faculty="Dr. Greenleaf" 
            icon="🌿" 
            cardColor="bg-[#E1F8DC]" 
            progress={100}
            courseId="botany-plants"
            onClick={handleCourseClick}
          />
          <CourseCard 
            title="States of Matter" 
            faculty="Prof. Kelvin" 
            icon="🧪" 
            cardColor="bg-[#E1F8DC]" 
            progress={67}
            courseId="states-of-matter"
            onClick={handleCourseClick}
          />
          <CourseCard 
            title="Astrophysics" 
            faculty="Dr. Nova" 
            icon="🚀" 
            cardColor="bg-[#E1F8DC]" 
            progress={0}
            courseId="astrophysics"
            onClick={handleCourseClick}
          />
        </SubjectGroup>

        {/* Subject Group: Mathematics */}
        <SubjectGroup title="Mathematics" color="bg-[#79E0EE]">
          <CourseCard 
            title="Algebra Basics" 
            faculty="Mr. X" 
            icon="🔢" 
            cardColor="bg-[#D1F3F8]" 
            progress={75}
            courseId="algebra-basics"
            onClick={handleCourseClick}
          />
          <CourseCard 
            title="Geometry" 
            faculty="Ms. Angle" 
            icon="📐" 
            cardColor="bg-[#D1F3F8]" 
            progress={10}
            courseId="geometry"
            onClick={handleCourseClick}
          />
        </SubjectGroup>

        {/* Subject Group: History */}
        <SubjectGroup title="History" color="bg-[#FFB7B7]">
          <CourseCard 
            title="Ancient Empires" 
            faculty="Prof. Lore" 
            icon="🏛️" 
            cardColor="bg-[#FFE5E5]" 
            progress={100}
            courseId="ancient-empires"
            onClick={handleCourseClick}
          />
        </SubjectGroup>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const SubjectGroup = ({ title, children, color }) => (
  <div className={`${color} border-[5px] border-black rounded-[45px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative`}>
    <div className="absolute -top-6 left-10 bg-white border-[4px] border-black px-6 py-1 rounded-xl rotate-[-2deg] shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-3xl font-black italic">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
      {children}
    </div>
  </div>
);

const CourseCard = ({ title, faculty, icon, cardColor, progress, courseId, onClick }) => {
  const isCompleted = progress === 100;
  const isStarted = progress > 0 && progress < 100;
  const buttonText = isCompleted ? "REVIEW" : isStarted ? "CONTINUE" : "START";

  return (
    <div 
      onClick={() => onClick(courseId)}
      className={`${cardColor} border-[4px] border-black rounded-[35px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group cursor-pointer relative`}
    >
      {isCompleted && (
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#FFD93D] border-3 border-black rounded-full flex items-center justify-center text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-12 z-10 animate-pulse">
          ⭐
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="w-20 h-20 bg-white border-[4px] border-black rounded-[25px] flex items-center justify-center text-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform">
            {icon}
          </div>
          {isStarted && !isCompleted && (
            <div className="bg-black text-white px-2 py-1 rounded-lg text-[10px] font-black rotate-3">
              {progress}% DONE
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-black leading-tight mb-1">{title}</h3>
          <p className="text-sm font-bold text-gray-600 italic uppercase tracking-tighter">Faculty: {faculty}</p>
        </div>
        <div className="mt-2 w-full bg-white border-[3px] border-black h-6 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div 
            className={`${isCompleted ? 'bg-[#4ADE80]' : 'bg-[#8E24AA]'} h-full rounded-full border-r-2 border-black transition-all duration-1000`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 pt-4 border-t-2 border-black border-dashed flex justify-between items-center">
          <span className={`text-[10px] font-black uppercase tracking-widest italic ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
            {isCompleted ? 'Finished!' : 'In Progress'}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent double navigation if you add button-specific logic later
              onClick(courseId);
            }}
            className={`px-6 py-2 rounded-xl font-black text-sm border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 active:translate-x-1 ${
              isCompleted 
              ? 'bg-white text-black hover:bg-gray-100' 
              : 'bg-black text-white hover:bg-white hover:text-black'
            }`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Learn;