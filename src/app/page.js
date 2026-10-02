"use client";
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState("");
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [summary, setSummary] = useState("");

  const hackMessages = [
    "[ INITIALIZING SATELLITE UPLINK... ]",
    "[ BYPASSING GLOBAL FIREWALLS... ]",
    "[ ACCESSING CLASSIFIED DATABASES... ]",
    "[ DECRYPTING TARGET ENVELOPES... ]",
    "[ EXTRACTING RAW INTEL... ]"
  ];

  useEffect(() => {
    let interval;
    if (loading || loadingMore) {
      let i = 0;
      setLoadingText(hackMessages[0]);
      interval = setInterval(() => {
        i = (i + 1) % hackMessages.length;
        setLoadingText(hackMessages[i]);
      }, 1000); 
    } else {
      setLoadingText("");
    }
    return () => clearInterval(interval);
  }, [loading, loadingMore]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSummary("");
    setPage(1);
    setCurrentQuery(query);
    
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, page: 1 })
      });
      
      const data = await res.json();
      
      if (data.organic && data.organic.length > 0) {
        setResults(data.organic);
        const compiledIntel = data.organic.slice(0, 4).map(item => item.snippet).join(" | ");
        setSummary(compiledIntel);
      } else {
        setError("NO TRACES FOUND. TARGET IS A GHOST.");
      }
    } catch (err) {
      setError("CRITICAL ERROR: CONNECTION TO MAINFRAME LOST.");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!currentQuery) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery, page: nextPage })
      });
      
      const data = await res.json();
      
      if (data.organic && data.organic.length > 0) {
        setResults((prev) => [...prev, ...data.organic]);
      }
    } catch (err) {
      setError("CRITICAL ERROR: CONNECTION TO MAINFRAME LOST.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#050000] p-6 text-red-500 pt-20 relative overflow-hidden font-mono">
      
      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center">
        
        <div className="w-full flex justify-center mb-6">
          <span className="text-xs text-red-700 tracking-[0.5em] animate-pulse font-bold bg-red-950/30 px-4 py-1 border border-red-900/50 rounded">
            RESTRICTED ACCESS // LEVEL 5 CLEARANCE REQUIRED
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 tracking-tighter text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          DEEP<span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">GUARD</span>
        </h1>
        
        <p className="mb-12 text-red-800 text-center text-xs tracking-[0.4em] uppercase font-bold">
          Global Surveillance & Target Extraction Protocol
        </p>
        
        <SearchBar onSearch={handleSearch} loading={loading} />

        {(loading || loadingMore) && (
          <div className="mt-8 text-red-500 font-bold tracking-widest animate-pulse border-l-4 border-red-500 pl-4">
            {loadingText}
          </div>
        )}

        {error && <p className="mt-8 text-black bg-red-600 px-6 py-2 font-black tracking-[0.2em] animate-bounce">{error}</p>}

        {summary && !loading && (
          <div className="mt-12 w-full bg-red-950/20 border-l-4 border-red-500 p-6 shadow-[0_0_20px_rgba(220,38,38,0.15)] relative">
            <div className="absolute top-0 right-0 bg-red-500 text-black text-[10px] font-black px-2 py-1 tracking-widest">AUTO-INTEL SUMMARY</div>
            <h3 className="text-white font-bold mb-3 tracking-widest text-lg">TARGET DOSSIER:</h3>
            <p className="text-red-400 text-sm leading-relaxed text-justify opacity-90 font-mono">
              {summary}
            </p>
          </div>
        )}

        <div className="mt-10 w-full flex flex-col gap-6 mb-10">
          {results.map((item, index) => (
            <div key={index} className="bg-black/40 backdrop-blur-sm border border-red-900/40 p-6 hover:border-red-500 transition-all duration-300 shadow-[0_0_15px_rgba(153,27,27,0.1)] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] relative group">
              
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-2">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl text-red-500 hover:text-red-400 transition-colors font-black uppercase tracking-wider line-clamp-1">
                  &gt; {item.title}
                </a>
                <span className="text-[10px] text-red-900 tracking-widest border border-red-900/50 px-2 py-1 ml-4 hidden md:block whitespace-nowrap">
                  MATCH: {90 + Math.floor(Math.random() * 10)}%
                </span>
              </div>
              
              <p className="text-xs text-red-800 mb-4 font-bold tracking-wider opacity-80 break-all">SRC: {item.link}</p>
              <p className="text-gray-400 leading-relaxed text-sm border-l-2 border-red-900/50 pl-4">{item.snippet}</p>
            </div>
          ))}
        </div>

        {results.length > 0 && !loading && (
          <div className="mb-20">
            <button 
              onClick={loadMore} 
              disabled={loadingMore}
              className="px-8 py-3 bg-red-950/20 border border-red-900 text-red-500 font-bold tracking-[0.2em] hover:bg-red-900/40 hover:text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(153,27,27,0.2)]"
            >
              {loadingMore ? "EXTRACTING..." : "LOAD MORE DATA >>"}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}