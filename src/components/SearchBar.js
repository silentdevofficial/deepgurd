"use client";
import { Loader2, Fingerprint } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      onSearch(query);
    }
  };

  return (
    <div className="flex w-full max-w-3xl items-center bg-[#0a0000] border border-red-900/50 px-2 py-2 shadow-[0_0_20px_rgba(153,27,27,0.2)] focus-within:border-red-500 focus-within:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all relative overflow-hidden group">
      
      {}
      <div className="absolute left-0 top-0 w-1 h-full bg-red-500 group-focus-within:animate-[ping_2s_ease-in-out_infinite] opacity-50"></div>

      <Fingerprint className="h-6 w-6 text-red-800 ml-3 animate-pulse" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="ENTER TARGET IDENTIFIER OR KEYWORD..."
        className="w-full bg-transparent px-4 py-3 text-red-500 outline-none placeholder:text-red-950 font-mono tracking-[0.1em] md:tracking-[0.2em] uppercase text-sm md:text-base font-bold"
        spellCheck="false"
      />
      
      <button 
        onClick={handleSearch}
        disabled={loading}
        className="ml-2 flex items-center justify-center bg-red-950 px-6 py-3 font-black text-red-500 hover:bg-red-600 hover:text-black transition-all disabled:bg-black disabled:text-red-900 min-w-[120px] md:min-w-[150px] tracking-[0.3em] border border-red-900/50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "SCAN"}
      </button>
    </div>
  );
}