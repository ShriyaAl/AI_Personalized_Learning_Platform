import React from 'react';

const Profile = () => {
  return (
    <div className="p-8 bg-[#fdfdfd] h-full overflow-y-auto font-mono scrollbar-hide">
       <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)`
        }}
      />
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase">Student File</h1>
        <div className="h-2 w-48 bg-black rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Left: Identity Card */}
        <div className="col-span-1">
          <div className="bg-[#FFF8D6] border-[6px] border-black rounded-[40px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center relative overflow-hidden">
            {/* "Tape" decorator */}
            <div className="absolute top-4 -right-8 bg-[#FFB7B7] px-10 py-1 rotate-45 border-y-4 border-black font-black text-xs">
              ACTIVE
            </div>
            
            <div className="w-40 h-40 bg-white border-[5px] border-black rounded-full overflow-hidden mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <img 
                src="" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-3xl font-black text-center">Alexa Scribble</h2>
            <p className="text-gray-500 font-bold italic uppercase tracking-widest text-sm mt-1">Grade 10 • Science Major</p>
            
            <button className="mt-8 w-full bg-black text-white py-3 rounded-2xl font-black border-4 border-black hover:bg-white hover:text-black transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(150,150,150,1)]">
              EDIT AVATAR
            </button>
          </div>
        </div>

        {/* Right: Settings & Preferences */}
        <div className="col-span-2 space-y-8">
          <div className="bg-[#98EECC] border-[6px] border-black rounded-[50px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black mb-6 italic">Personal Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <InputGroup label="Display Name" value="Alexa Scribble" />
              <InputGroup label="Email" value="alexa@doodle.edu" />
              <InputGroup label="Preferred Language" value="English (UK)" />
              <InputGroup label="Timezone" value="GMT +5:30" />
            </div>
          </div>

          <div className="bg-[#F3B8F8] border-[6px] border-black rounded-[50px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black mb-6 italic">Account Security</h3>
            <div className="flex gap-4">
              <button className="bg-white border-4 border-black px-6 py-2 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                CHANGE PASSWORD
              </button>
              <button className="bg-[#FF8B8B] border-4 border-black px-6 py-2 rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                DEACTIVATE FILE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black uppercase tracking-widest text-gray-600 ml-2">{label}</label>
    <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
      {value}
    </div>
  </div>
);

export default Profile