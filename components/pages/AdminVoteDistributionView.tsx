"use client";

import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { ArrowLeft, Loader2, User, Maximize, Minimize } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminVoteDistributionView() {
  const router = useRouter();
  const { stats, isLoading } = useAdmin();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#FFFDF9', color: '#6B4F43', gap: '16px' }}>
        <Loader2 style={{ width: 48, height: 48, color: '#4A0E17', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontWeight: 700, fontSize: '18px', margin: 0 }}>Loading vote distribution details...</p>
      </div>
    );
  }

  const distribution = stats?.voteDistribution || [];
  const sortedDistribution = [...distribution].sort((a, b) => b.votes - a.votes);
  const maxVotes = sortedDistribution.length > 0 ? sortedDistribution[0].votes : 1;
  const chartColors = ['#5D0F1D', '#D4AF37', '#4A0E17', '#F7B757', '#8B6508'];

  // Max bar height in vh — tuned so tallest bar fills most of the screen
  const MAX_BAR_VH = 52;
  const MIN_BAR_VH = 8;

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', width: '100%', background: '#FFFDF9', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        width: '100%',
        borderBottom: '1px solid rgba(212,175,55,0.3)',
        background: 'rgba(255,253,249,0.97)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', color: '#6B4F43', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft style={{ width: 18, height: 18, marginRight: 8 }} />
          Back
        </button>
        <div style={{ width: 1, height: 24, background: 'rgba(212,175,55,0.4)' }} />
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#4A0E17', margin: 0, lineHeight: 1 }}>Vote Distribution</h2>
          <p style={{ fontSize: '12px', color: '#6B4F43', margin: '4px 0 0', fontWeight: 500 }}>Real-time candidate performance</p>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={toggleFullscreen}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4A0E17', fontWeight: 700, fontSize: '13px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '8px', cursor: 'pointer', padding: '8px 16px', transition: 'all 0.2s' }}
        >
          {isFullscreen ? <Minimize style={{ width: 18, height: 18 }} /> : <Maximize style={{ width: 18, height: 18 }} />}
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>

      {/* Chart Area — items aligned to bottom */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '40px 64px 40px',
        gap: '32px',
        overflowX: 'auto',
      }}>
        {sortedDistribution.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B4F43', fontSize: '16px' }}>
            No candidates or votes recorded yet.
          </div>
        ) : (
          sortedDistribution.map((candidate: any, index: number) => {
            const ratio = maxVotes > 0 ? candidate.votes / maxVotes : 0;
            const barVh = Math.max(ratio * MAX_BAR_VH, MIN_BAR_VH);
            const color = chartColors[index % chartColors.length];

            return (
              <div
                key={candidate.id}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '120px', maxWidth: '220px' }}
              >
                {/* Square Photo */}
                <div style={{
                  width: 'clamp(100px, 12vw, 160px)',
                  height: 'clamp(100px, 12vw, 160px)',
                  flexShrink: 0,
                  background: 'white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  border: `4px solid ${color}`,
                  borderRadius: '12px',
                  position: 'relative',
                  marginBottom: '-22px',
                  zIndex: 20,
                }}>
                  {candidate.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(212,175,55,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User style={{ width: '40%', height: '40%', color: 'rgba(212,175,55,0.6)' }} />
                    </div>
                  )}
                  {/* Number Badge */}
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 28, height: 28, borderRadius: '50%',
                    background: color, color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '13px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    border: '2px solid white',
                  }}>
                    {candidate.number}
                  </div>
                </div>

                {/* Bar — height in vh so it always scales to screen */}
                <div style={{
                  width: '100%',
                  height: `${barVh}vh`,
                  backgroundColor: color,
                  borderRadius: '12px 12px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '30px',
                  boxSizing: 'border-box',
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
                }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 40px)', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    {candidate.percentage}%
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                    {candidate.votes} suara
                  </span>
                </div>

                {/* Candidate Name */}
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <div style={{ fontSize: '16px', color: '#6B4F43', fontWeight: 600, marginBottom: '2px' }}>
                    {candidate.votes} Votes
                  </div>
                  <h4 style={{ fontWeight: 1000, color: '#4A0E17', fontSize: 'clamp(13px, 1.5vw, 16px)', margin: 0, lineHeight: 1.3 }}>
                    {candidate.name}
                  </h4>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}