import { useMemo, useState } from 'react';
import '../styles/dashboard.css';
import {
  getDaysRange,
  getOverallConsistency,
  getCurrentStreak,
  getBestStreak,
  getMonthlyImprovement,
  getDailyCompletionRate,
  calculatePoints,
  getRankInfo,
  getHabitConsistency,
  isBefore,
  isFuture,
  dateKey
} from '../utils/analyticsHelpers';

function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatMonthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short' });
}

// Helper to compute SVG coordinates for the line charts
function getChartPoints(data, width = 600, height = 120, paddingLeft = 45, paddingRight = 20, paddingTop = 20, paddingBottom = 20) {
  if (!data || data.length === 0) return [];
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  return data.map((d, i) => {
    const x = paddingLeft + (data.length > 1 ? (i / (data.length - 1)) * chartWidth : 0);
    const y = (paddingTop + chartHeight) - (d.rate / 100) * chartHeight;
    return { x, y, date: d.date, rate: d.rate };
  });
}

export default function AnalyticsPage({ habits, completionData }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoveredPointWeekly, setHoveredPointWeekly] = useState(null);
  const [hoveredPointMonthly, setHoveredPointMonthly] = useState(null);

  // Compute all analytics metrics dynamically from the database
  const stats = useMemo(() => {
    if (habits.length === 0) return null;

    const days7 = getDaysRange(7);
    const days30 = getDaysRange(30);
    const overallConsistency = getOverallConsistency(habits, completionData, days30);
    const currentStreak = getCurrentStreak(habits, completionData);
    const bestStreak = getBestStreak(habits, completionData, 365);
    const monthlyImprovement = getMonthlyImprovement(habits, completionData);
    const totalHabits = Object.values(completionData).filter(v => v).length;
    const rankInfo = getRankInfo(currentStreak, totalHabits);

    // Habit consistencies over lifespan
    const habitRankings = habits.map(habit => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const createdDate = new Date(habit.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const lifespanDays = [];
      for (let i = 0; i < diffDays; i++) {
        const d = new Date(createdDate);
        d.setDate(createdDate.getDate() + i);
        lifespanDays.push(d);
      }
      const consistency = getHabitConsistency(habit, completionData, lifespanDays);
      return { 
        habit, 
        consistency, 
        completions: lifespanDays.filter(day => completionData[`${habit.id}:${dateKey(day)}`]).length 
      };
    }).sort((a, b) => b.consistency - a.consistency);

    // 7 days daily completion rates for weekly chart
    const chartDataWeekly = days7.map((day) => {
      const rate = getDailyCompletionRate(habits, completionData, day);
      return { date: day, rate };
    });

    // 30 days daily completion rates for monthly chart
    const chartDataMonthly = days30.map((day) => {
      const rate = getDailyCompletionRate(habits, completionData, day);
      return { date: day, rate };
    });

    // Heatmap data (371 days ending with today, aligned to weeks starting on Sunday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
    const heatmapStartDate = new Date(today);
    heatmapStartDate.setDate(today.getDate() - (52 * 7) - dayOfWeek);
    
    const heatmapCells = [];
    for (let c = 0; c < 53; c++) {
      for (let r = 0; r < 7; r++) {
        const cellDate = new Date(heatmapStartDate);
        cellDate.setDate(heatmapStartDate.getDate() + (c * 7) + r);
        const isFutureCell = isFuture(cellDate);
        const rate = isFutureCell ? null : getDailyCompletionRate(habits, completionData, cellDate);
        
        heatmapCells.push({
          date: cellDate,
          rate,
          isFuture: isFutureCell,
          col: c,
          row: r
        });
      }
    }

    // Insights:
    // 1. Most Consistent Habit
    const mostConsistent = habitRankings.length > 0 ? habitRankings[0] : null;
    
    // 2. Needs Attention
    const needsAttention = habitRankings.length > 0 ? habitRankings[habitRankings.length - 1] : null;

    // 3. Biggest Improvement (past 7 days vs previous 7 days)
    const past7Days = getDaysRange(7);
    const prev7Days = [];
    const todayRef = new Date();
    todayRef.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(todayRef);
      d.setDate(todayRef.getDate() - 13 + i);
      prev7Days.push(d);
    }

    let biggestImprovementHabit = null;
    let maxImprovement = -Infinity;
    habits.forEach(habit => {
      const rateThisWeek = getHabitConsistency(habit, completionData, past7Days);
      const rateLastWeek = getHabitConsistency(habit, completionData, prev7Days);
      const diff = rateThisWeek - rateLastWeek;
      if (diff > maxImprovement) {
        maxImprovement = diff;
        biggestImprovementHabit = { habit, improvement: diff };
      }
    });

    // 4. Most Missed Recently (missed days in past 7 days)
    let mostMissedHabit = null;
    let maxMissedCount = -1;
    habits.forEach(habit => {
      let missedCount = 0;
      past7Days.forEach(day => {
        if (!isBefore(day, habit.createdAt) && !isFuture(day)) {
          const key = `${habit.id}:${dateKey(day)}`;
          if (!completionData[key]) {
            missedCount++;
          }
        }
      });
      if (missedCount > maxMissedCount) {
        maxMissedCount = missedCount;
        mostMissedHabit = { habit, missedCount };
      }
    });

    return {
      overallConsistency,
      currentStreak,
      bestStreak,
      monthlyImprovement,
      totalHabits,
      rankInfo,
      habitRankings,
      chartDataWeekly,
      chartDataMonthly,
      heatmapCells,
      mostConsistent,
      needsAttention,
      biggestImprovement: maxImprovement > 0 ? biggestImprovementHabit : null,
      mostMissed: maxMissedCount > 0 ? mostMissedHabit : null
    };
  }, [habits, completionData]);

  const chartPointsWeekly = useMemo(() => {
    if (!stats) return [];
    return getChartPoints(stats.chartDataWeekly);
  }, [stats]);

  const chartPointsMonthly = useMemo(() => {
    if (!stats) return [];
    return getChartPoints(stats.chartDataMonthly);
  }, [stats]);

  const linePathWeekly = useMemo(() => {
    if (chartPointsWeekly.length === 0) return '';
    return chartPointsWeekly.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  }, [chartPointsWeekly]);

  const fillPathWeekly = useMemo(() => {
    if (chartPointsWeekly.length === 0) return '';
    return `${linePathWeekly} L ${chartPointsWeekly[chartPointsWeekly.length - 1].x} 100 L ${chartPointsWeekly[0].x} 100 Z`;
  }, [chartPointsWeekly, linePathWeekly]);

  const linePathMonthly = useMemo(() => {
    if (chartPointsMonthly.length === 0) return '';
    return chartPointsMonthly.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
  }, [chartPointsMonthly]);

  const fillPathMonthly = useMemo(() => {
    if (chartPointsMonthly.length === 0) return '';
    return `${linePathMonthly} L ${chartPointsMonthly[chartPointsMonthly.length - 1].x} 100 L ${chartPointsMonthly[0].x} 100 Z`;
  }, [chartPointsMonthly, linePathMonthly]);

  // Generate monthly labels for heatmap columns
  const heatmapMonthLabels = useMemo(() => {
    if (!stats) return [];
    const labels = [];
    let lastMonth = -1;
    stats.heatmapCells.forEach(cell => {
      if (cell.row === 0) {
        const m = cell.date.getMonth();
        if (m !== lastMonth) {
          labels.push({ col: cell.col, text: formatMonthLabel(cell.date) });
          lastMonth = m;
        }
      }
    });
    // Remove labels that are too close to each other
    return labels.filter((lbl, idx, arr) => {
      if (idx === 0) return true;
      return lbl.col - arr[idx - 1].col >= 3;
    });
  }, [stats]);

  if (habits.length === 0) {
    return (
      <div className="analytics-page">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-quote">“Measure to refine. Numbers don't lie, actions don't cheat.”</p>
        </div>
        <div className="analytics-empty-state">
          <div className="analytics-empty-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-state-svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 11 2 2 4-4" />
            </svg>
          </div>
          <h3>No Protocols Monitored</h3>
          <p>You must establish active habits before your discipline and evolution indices can be compiled.</p>
        </div>
      </div>
    );
  }

  const {
    overallConsistency,
    currentStreak,
    bestStreak,
    monthlyImprovement,
    totalHabits,
    rankInfo,
    habitRankings,
    heatmapCells,
    mostConsistent,
    needsAttention,
    biggestImprovement,
    mostMissed
  } = stats;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-title">Discipline Analytics</h1>
        <p className="page-quote">“Identity is built by proof. We measure to conquer.”</p>
      </div>

      {/* Top: Summary Stats Cards */}
      <div className="analytics-top-grid">
        {/* Card 1: Habits Completed */}
        <div className="analytics-summary-card analytics-summary-card--habits">
          <div className="analytics-card-meta">
            <span className="analytics-card-label analytics-card-label--no-wrap">Habits Completed</span>
            <span className="analytics-card-desc">Check-ins</span>
          </div>
          <span className="analytics-card-value">{totalHabits}</span>
          <span className="analytics-card-detail analytics-card-detail--hide-mobile">Total habits completed</span>
        </div>

        {/* Card 2: Current Rank */}
        <div className="analytics-summary-card analytics-summary-card--rank">
          <div className="analytics-card-meta">
            <span className="analytics-card-label">Current Rank</span>
            <span className="analytics-card-desc">Level {rankInfo.level}</span>
          </div>
          <span className="analytics-card-value">{rankInfo.name}</span>
          {rankInfo.nextRankName ? (
            <div className="analytics-card-progress-container">
              <div className="analytics-mini-progress-track">
                <div className="analytics-mini-progress-bar" style={{ width: `${rankInfo.progressPercent}%` }} />
              </div>
              <span className="analytics-card-detail">
                {rankInfo.nextRankRequirement}
              </span>
            </div>
          ) : (
            <span className="analytics-card-detail">Maximum Rank Achieved</span>
          )}
        </div>

        {/* Card 3: Active Streak */}
        <div className="analytics-summary-card analytics-summary-card--streak">
          <div className="analytics-card-meta">
            <span className="analytics-card-label">Active Streak</span>
            <span className="analytics-card-desc">Current</span>
          </div>
          <span className="analytics-card-value analytics-card-value--large">
            {currentStreak} <span className="analytics-card-unit">Days</span>
          </span>
          <span className="analytics-card-detail analytics-card-detail--hide-mobile">Best streak: {bestStreak} days</span>
        </div>

        {/* Card 4: Consistency % */}
        <div className="analytics-summary-card analytics-summary-card--consistency">
          <div className="analytics-card-meta">
            <span className="analytics-card-label">Consistency</span>
            <span className="analytics-card-desc">30-day completion rate</span>
          </div>
          <span className="analytics-card-value">{overallConsistency}%</span>
          <span className={`analytics-card-detail trend-${monthlyImprovement >= 0 ? 'positive' : 'negative'}`}>
            {monthlyImprovement >= 0 ? `+${monthlyImprovement}%` : `${monthlyImprovement}%`} from last month
          </span>
        </div>
      </div>

      {/* Middle: Trends & Adherence */}
      <div className="analytics-middle-layout">
        {/* Charts Column */}
        <div className="analytics-charts-column">
          {/* Weekly Trend Chart */}
          <div className="analytics-card trend-chart-card">
            <div className="analytics-card-header">
              <div className="header-meta">
                <h3 className="analytics-card-title">Weekly Trend</h3>
                <p className="card-subtitle">Last 7 days adherence cycle</p>
              </div>
              {hoveredPointWeekly ? (
                <div className="chart-tooltip-indicator">
                  <span className="tooltip-date">{formatDisplayDate(hoveredPointWeekly.date)}</span>
                  <span className="tooltip-rate">{hoveredPointWeekly.rate}% completed</span>
                </div>
              ) : (
                <span className="chart-subtext">Hover points for daily values</span>
              )}
            </div>

            <div className="svg-chart-container">
              <svg viewBox="0 0 600 120" className="analytics-trend-chart">
                <defs>
                  <linearGradient id="chartGlowWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="45" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                <line x1="45" y1="60" x2="580" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                <line x1="45" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,0.06)" />

                {/* Axes */}
                <text x="35" y="24" className="chart-axis-text" textAnchor="end">100%</text>
                <text x="35" y="64" className="chart-axis-text" textAnchor="end">50%</text>
                <text x="35" y="104" className="chart-axis-text" textAnchor="end">0%</text>

                {/* Filled Area */}
                <path d={fillPathWeekly} fill="url(#chartGlowWeekly)" />

                {/* Main Polyline */}
                <path d={linePathWeekly} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive Points */}
                {chartPointsWeekly.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPointWeekly && hoveredPointWeekly.x === pt.x ? 4.5 : 2.5}
                    fill={hoveredPointWeekly && hoveredPointWeekly.x === pt.x ? 'var(--color-text-primary)' : 'var(--color-bg)'}
                    stroke="var(--color-accent)"
                    strokeWidth={hoveredPointWeekly && hoveredPointWeekly.x === pt.x ? 2.5 : 1.5}
                    className="chart-node"
                    onMouseEnter={() => setHoveredPointWeekly(pt)}
                    onMouseLeave={() => setHoveredPointWeekly(null)}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Monthly Trend Chart */}
          <div className="analytics-card trend-chart-card">
            <div className="analytics-card-header">
              <div className="header-meta">
                <h3 className="analytics-card-title">Monthly Trend</h3>
                <p className="card-subtitle">Last 30 days adherence velocity</p>
              </div>
              {hoveredPointMonthly ? (
                <div className="chart-tooltip-indicator">
                  <span className="tooltip-date">{formatDisplayDate(hoveredPointMonthly.date)}</span>
                  <span className="tooltip-rate">{hoveredPointMonthly.rate}% completed</span>
                </div>
              ) : (
                <span className="chart-subtext">Hover points for daily values</span>
              )}
            </div>

            <div className="svg-chart-container">
              <svg viewBox="0 0 600 120" className="analytics-trend-chart">
                <defs>
                  <linearGradient id="chartGlowMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="45" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                <line x1="45" y1="60" x2="580" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
                <line x1="45" y1="100" x2="580" y2="100" stroke="rgba(255,255,255,0.06)" />

                {/* Axes */}
                <text x="35" y="24" className="chart-axis-text" textAnchor="end">100%</text>
                <text x="35" y="64" className="chart-axis-text" textAnchor="end">50%</text>
                <text x="35" y="104" className="chart-axis-text" textAnchor="end">0%</text>

                {/* Filled Area */}
                <path d={fillPathMonthly} fill="url(#chartGlowMonthly)" />

                {/* Main Polyline */}
                <path d={linePathMonthly} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Interactive Points */}
                {chartPointsMonthly.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPointMonthly && hoveredPointMonthly.x === pt.x ? 4 : 2}
                    fill={hoveredPointMonthly && hoveredPointMonthly.x === pt.x ? 'var(--color-text-primary)' : 'var(--color-bg)'}
                    stroke="var(--color-accent)"
                    strokeWidth={hoveredPointMonthly && hoveredPointMonthly.x === pt.x ? 2 : 1}
                    className="chart-node"
                    onMouseEnter={() => setHoveredPointMonthly(pt)}
                    onMouseLeave={() => setHoveredPointMonthly(null)}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Adherence rankings list */}
        <div className="analytics-card analytics-rankings-card">
          <div className="analytics-card-meta-header">
            <h3 className="analytics-card-title">Protocol Adherence</h3>
            <p className="card-subtitle">Lifetime consistency comparison</p>
          </div>
          <div className="analytics-breakdown-list">
            {habitRankings.map(({ habit, consistency, completions }) => (
              <div key={habit.id} className="analytics-breakdown-item">
                <div className="analytics-breakdown-info">
                  <span className="analytics-breakdown-name">{habit.label}</span>
                  <span className="analytics-breakdown-percentage">
                    {consistency}% ({completions} checks)
                  </span>
                </div>
                <div className="analytics-progress-wrapper">
                  <div className="analytics-progress-bar" style={{ width: `${consistency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="analytics-card analytics-heatmap-card">
        <div className="analytics-card-header">
          <div className="header-meta">
            <h3 className="analytics-card-title">Consistency Calendar</h3>
            <p className="card-subtitle">Yearly completion distribution grid</p>
          </div>
          {hoveredCell ? (
            <div className="heatmap-tooltip-indicator">
              <span className="tooltip-date">{formatDisplayDate(hoveredCell.date)}</span>
              <span className="tooltip-rate">{hoveredCell.rate}% Completed</span>
            </div>
          ) : (
            <span className="heatmap-subtext">Hover cells for daily values</span>
          )}
        </div>

        <div className="heatmap-grid-scroll-container">
          <div className="heatmap-grid-container">
            {/* Month Headers */}
            <div className="heatmap-months">
              {heatmapMonthLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className="heatmap-month-label"
                  style={{ gridColumnStart: lbl.col + 1 }}
                >
                  {lbl.text}
                </span>
              ))}
            </div>

            <div className="heatmap-grid-wrapper">
              {/* Day of Week Labels */}
              <div className="heatmap-days-labels">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Heatmap Grid Cells */}
              <div className="heatmap-cells-grid">
                {heatmapCells.map((cell, idx) => {
                  let levelClass = 'cell-level-0';
                  if (!cell.isFuture && cell.rate !== null) {
                    if (cell.rate === 100) levelClass = 'cell-level-4';
                    else if (cell.rate >= 67) levelClass = 'cell-level-3';
                    else if (cell.rate >= 34) levelClass = 'cell-level-2';
                    else if (cell.rate > 0) levelClass = 'cell-level-1';
                  }

                  return (
                    <div
                      key={idx}
                      className={`heatmap-cell ${levelClass} ${cell.isFuture ? 'cell-future' : ''}`}
                      style={{
                        gridColumn: cell.col + 1,
                        gridRow: cell.row + 1
                      }}
                      onMouseEnter={() => !cell.isFuture && setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="heatmap-legend">
              <span>Less</span>
              <div className="heatmap-cell cell-level-0" />
              <div className="heatmap-cell cell-level-1" />
              <div className="heatmap-cell cell-level-2" />
              <div className="heatmap-cell cell-level-3" />
              <div className="heatmap-cell cell-level-4" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Performance Insights */}
      <div className="analytics-bottom-section">
        <h3 className="analytics-section-title">Performance Insights</h3>
        <div className="analytics-insights-grid">
          {/* Card 1: Best Habit */}
          <div className="insight-card">
            <div className="insight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="insight-svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 11 2 2 4-4" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-label">Best Habit</span>
              <h4 className="insight-value">
                {mostConsistent ? mostConsistent.habit.label : 'None'}
              </h4>
              <p className="insight-description">
                {mostConsistent
                  ? `Leading protocol with ${mostConsistent.consistency}% lifetime consistency.`
                  : 'Establish completions to analyze top performers.'}
              </p>
            </div>
          </div>

          {/* Card 2: Weakest Habit */}
          <div className="insight-card">
            <div className="insight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="insight-svg">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-label">Weakest Habit</span>
              <h4 className="insight-value">
                {needsAttention ? needsAttention.habit.label : 'None'}
              </h4>
              <p className="insight-description">
                {needsAttention
                  ? `Refine execution. Currently tracking at a low of ${needsAttention.consistency}% consistency.`
                  : 'Maintain logs to identify weaker links.'}
              </p>
            </div>
          </div>

          {/* Card 3: Recent Slip-ups */}
          <div className="insight-card">
            <div className="insight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="insight-svg">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-label">Recent Slip-ups</span>
              <h4 className="insight-value">
                {mostMissed && mostMissed.missedCount > 0 ? mostMissed.habit.label : 'None'}
              </h4>
              <p className="insight-description">
                {mostMissed && mostMissed.missedCount > 0
                  ? `Missed ${mostMissed.missedCount} checks in the last 7 days. Focus on restoration.`
                  : 'All monitored protocols have perfect completion rates this week.'}
              </p>
            </div>
          </div>

          {/* Card 4: Growth Summary */}
          <div className="insight-card">
            <div className="insight-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="insight-svg">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
            <div className="insight-content">
              <span className="insight-label">Growth Summary</span>
              <h4 className="insight-value">
                {biggestImprovement ? biggestImprovement.habit.label : 'Stable Adherence'}
              </h4>
              <p className="insight-description">
                {biggestImprovement
                  ? `Improver: +${biggestImprovement.improvement}% this week. Overall monthly change: ${monthlyImprovement >= 0 ? `+${monthlyImprovement}%` : `${monthlyImprovement}%`}.`
                  : `Consistency is holding steady. Overall monthly change: ${monthlyImprovement >= 0 ? `+${monthlyImprovement}%` : `${monthlyImprovement}%`}.`}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
