import React from 'react';
import TeacherNavbar from '../../../Components/TeacherNavbar';

const Profile = () => {
  return (
    <div className="h-screen bg-[#121212] flex flex-col font-mono overflow-hidden">
      <TeacherNavbar activeTab="profile" />

      <main className="flex-1 overflow-y-auto p-8 relative">
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)`
          }}
        />

        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase text-white">Teacher File</h1>
            <div className="h-2 w-96 bg-white rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left: Identity Card */}
            <div className="col-span-1">
              <div className="bg-[#FFF8D6] border-[6px] border-black rounded-[40px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center relative overflow-hidden transition-transform hover:-translate-y-1">
                {/* "Tape" decorator */}
                <div className="absolute top-4 -right-12 bg-[#FFB7B7] px-14 py-1 rotate-45 border-y-4 border-black font-black text-xs shadow-sm">
                  CERTIFIED
                </div>
                
                <div className="w-40 h-40 bg-white border-[5px] border-black rounded-full overflow-hidden mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-6xl">
                    👨‍🏫
                  </div>
                </div>
                
                <h2 className="text-3xl font-black text-center text-black">John Doe</h2>
                <p className="text-gray-600 font-bold italic uppercase tracking-widest text-xs mt-2 text-center">
                  Senior Physics Teacher <br/> 12 Years Experience
                </p>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold border-b-2 border-dashed border-black pb-2">
                    <span>ID:</span>
                    <span className="font-mono">T-8842-X</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold border-b-2 border-dashed border-black pb-2">
                    <span>Department:</span>
                    <span>Science</span>
                  </div>
                </div>

                <button className="mt-8 w-full bg-black text-white py-3 rounded-2xl font-black border-4 border-black hover:bg-white hover:text-black transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(150,150,150,1)]">
                  EDIT PROFILE
                </button>
              </div>
            </div>

            {/* Right: Settings & Preferences */}
            <div className="col-span-2 space-y-8">
              <div className="bg-[#98EECC] border-[6px] border-black rounded-[50px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                <h3 className="text-3xl font-black mb-6 italic">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Full Name" value="Johnathon Doe" />
                  <InputGroup label="Email" value="john.doe@school.edu" />
                  <InputGroup label="Subjects" value="Physics, Math" />
                  <InputGroup label="Office Hours" value="Mon-Wed 2-4 PM" />
                  <InputGroup label="Qualification" value="M.Sc. Physics" />
                  <InputGroup label="Join Date" value="August 2012" />
                </div>
              </div>

              <div className="bg-[#F3B8F8] border-[6px] border-black rounded-[50px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                <h3 className="text-3xl font-black mb-6 italic">Account Settings</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase text-sm">
                    Change Password
                  </button>
                  <button className="bg-[#FF8B8B] border-4 border-black px-6 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase text-sm">
                    Notification Prefs
                  </button>
                  <button className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase text-sm">
                    View Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InputGroup = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black uppercase tracking-widest text-gray-700 ml-2">{label}</label>
    <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      {value}
    </div>
  </div>
);

export default Profile;
