import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingDown, MessageSquare, Eye, AlertCircle, CheckCircle, Clock, Zap, ThumbsDown, Flag, Ban, FileWarning, Sparkles, RefreshCw, Bell, Settings, Filter } from 'lucide-react';

const CrisisManagementAI = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [draftAnalysis, setDraftAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);

  // Initialize alerts directly with mock data
  const [alerts] = useState([
    {
      id: 1,
      type: 'critical',
      platform: 'Twitter',
      issue: 'Negative sentiment spike',
      description: 'Your latest post received 45% negative replies in the last hour',
      timestamp: '5 minutes ago',
      affectedPost: 'New product launch announcement',
      metrics: { negative: 45, neutral: 30, positive: 25 },
      suggestions: [
        'Post a clarification addressing main concerns',
        'Temporarily disable comments to prevent escalation',
        'Issue a public apology acknowledging feedback'
      ]
    },
    {
      id: 2,
      type: 'warning',
      platform: 'Instagram',
      issue: 'Controversial keyword detected',
      description: 'Draft contains potentially controversial political references',
      timestamp: '12 minutes ago',
      affectedPost: 'Draft: Weekend motivation post',
      riskScore: 72,
      suggestions: [
        'Remove political keywords',
        'Rephrase to neutral language',
        'Schedule for manual review'
      ]
    },
    {
      id: 3,
      type: 'info',
      platform: 'LinkedIn',
      issue: 'Unusual engagement pattern',
      description: 'Post receiving 3x more comments than usual - monitor for trolling',
      timestamp: '1 hour ago',
      affectedPost: 'Company culture update',
      metrics: { comments: 234, average: 78 },
      suggestions: [
        'Continue monitoring comment quality',
        'Enable comment moderation filters',
        'Prepare response templates'
      ]
    }
  ]);

  const riskCategories = [
    { name: 'Political Content', icon: Flag, color: 'red', risk: 'high' },
    { name: 'Offensive Language', icon: Ban, color: 'red', risk: 'critical' },
    { name: 'Copyright Issues', icon: FileWarning, color: 'orange', risk: 'medium' },
    { name: 'Sensitive Topics', icon: AlertCircle, color: 'yellow', risk: 'medium' },
    { name: 'Brand Safety', icon: Shield, color: 'blue', risk: 'low' }
  ];

  const monitoringMetrics = [
    { label: 'Active Alerts', value: '3', trend: '+2', icon: AlertTriangle, color: 'red' },
    { label: 'Risk Score', value: '68/100', trend: '-12', icon: Shield, color: 'orange' },
    { label: 'Comments Monitored', value: '1.2K', trend: '+340', icon: MessageSquare, color: 'blue' },
    { label: 'Auto-Mitigated', value: '15', trend: '+5', icon: CheckCircle, color: 'green' }
  ];

  const analyzeDraft = async () => {
    if (!draftText.trim()) return;

    setAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const risks = [];
    const text = draftText.toLowerCase();

    // Simple keyword-based analysis (replace with actual AI API)
    if (text.includes('politic') || text.includes('election') || text.includes('government')) {
      risks.push({
        type: 'Political Content',
        severity: 'high',
        description: 'Contains political keywords that may trigger controversy',
        keywords: ['political', 'election', 'government'],
        recommendation: 'Remove political references or rephrase neutrally'
      });
    }

    if (text.includes('free') && text.includes('click')) {
      risks.push({
        type: 'Spam-like Pattern',
        severity: 'medium',
        description: 'Language pattern similar to spam content',
        keywords: ['free', 'click'],
        recommendation: 'Rephrase call-to-action more authentically'
      });
    }

    const overallRisk = risks.length === 0 ? 15 : 
                       risks.some(r => r.severity === 'high') ? 75 : 45;

    setDraftAnalysis({
      riskScore: overallRisk,
      risks: risks,
      sentiment: overallRisk > 60 ? 'negative' : overallRisk > 30 ? 'neutral' : 'positive',
      safeToPublish: overallRisk < 40,
      suggestions: risks.length === 0 
        ? ['Content looks safe to publish']
        : ['Review and edit flagged content', 'Consider alternative phrasing', 'Run through brand guidelines']
    });

    setAnalyzing(false);
  };

  const getRiskColor = (type) => {
    if (type === 'critical') return 'from-red-500 to-red-600';
    if (type === 'warning') return 'from-orange-500 to-orange-600';
    return 'from-blue-500 to-blue-600';
  };

  const getRiskBadge = (type) => {
    if (type === 'critical') return 'bg-red-100 text-red-700';
    if (type === 'warning') return 'bg-orange-100 text-orange-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Crisis Management AI
              </h1>
              <p className="text-lg text-slate-600">
                Real-time protection & risk prevention for your social media
              </p>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${realTimeMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="font-semibold text-slate-800">
                {realTimeMonitoring ? 'Real-time monitoring active' : 'Monitoring paused'}
              </span>
            </div>
            <button
              onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                realTimeMonitoring 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {realTimeMonitoring ? 'Pause Monitoring' : 'Resume Monitoring'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-2 shadow-lg">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Eye },
            { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
            { id: 'analyze', label: 'Analyze Draft', icon: FileWarning }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {monitoringMetrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${metric.color}-100`}>
                        <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                      </div>
                      <span className={`text-sm font-semibold ${metric.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                        {metric.trend}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-600">{metric.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Risk Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-red-500" />
                Risk Categories Monitored
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {riskCategories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <div key={idx} className={`p-4 rounded-xl border-2 border-${category.color}-200 bg-${category.color}-50`}>
                      <Icon className={`w-6 h-6 text-${category.color}-600 mb-2`} />
                      <div className="text-sm font-semibold text-slate-800">{category.name}</div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                        category.risk === 'critical' ? 'bg-red-200 text-red-700' :
                        category.risk === 'high' ? 'bg-orange-200 text-orange-700' :
                        category.risk === 'medium' ? 'bg-yellow-200 text-yellow-700' :
                        'bg-green-200 text-green-700'
                      }`}>
                        {category.risk.toUpperCase()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: 'Comment flagged and hidden', time: '2 min ago', status: 'success' },
                  { action: 'Negative sentiment detected', time: '8 min ago', status: 'warning' },
                  { action: 'Draft approved for publishing', time: '15 min ago', status: 'success' },
                  { action: 'Troll account blocked', time: '23 min ago', status: 'success' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm text-slate-700">{activity.action}</span>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        {activeSection === 'alerts' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">All Clear!</h3>
                <p className="text-slate-600">No active alerts at the moment</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${getRiskColor(alert.type)}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${getRiskColor(alert.type)}`}>
                          <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskBadge(alert.type)}`}>
                              {alert.type.toUpperCase()}
                            </span>
                            <span className="text-sm text-slate-500">{alert.platform}</span>
                            <span className="text-sm text-slate-400">{alert.timestamp}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{alert.issue}</h3>
                          <p className="text-slate-600 mb-3">{alert.description}</p>
                          
                          {alert.affectedPost && (
                            <div className="bg-slate-50 rounded-lg p-3 mb-3">
                              <span className="text-xs font-semibold text-slate-500">AFFECTED POST</span>
                              <p className="text-sm text-slate-700 mt-1">{alert.affectedPost}</p>
                            </div>
                          )}

                          {alert.metrics && (
                            <div className="flex gap-4 mb-4">
                              {Object.entries(alert.metrics).map(([key, value]) => (
                                <div key={key} className="text-center">
                                  <div className="text-2xl font-bold text-slate-800">{value}{typeof value === 'number' && value <= 100 ? '%' : ''}</div>
                                  <div className="text-xs text-slate-500 capitalize">{key}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-orange-500" />
                              AI Suggestions
                            </h4>
                            {alert.suggestions.map((suggestion, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all">
                        Take Action
                      </button>
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analyze Draft Section */}
        {activeSection === 'analyze' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileWarning className="w-7 h-7 text-orange-500" />
                Analyze Draft Before Publishing
              </h3>
              <p className="text-slate-600 mb-6">
                AI will scan for political content, offensive language, copyright issues, and potential controversies
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Draft Content
                </label>
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Paste your draft content here to analyze for potential risks..."
                  className="w-full h-48 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 resize-none text-slate-800"
                  disabled={analyzing}
                />
              </div>

              <button
                onClick={analyzeDraft}
                disabled={analyzing || !draftText.trim()}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Analyze for Risks
                  </>
                )}
              </button>
            </div>

            {/* Analysis Results */}
            {draftAnalysis && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Analysis Results</h3>
                  <div className="text-right">
                    <div className={`text-4xl font-bold mb-1 ${
                      draftAnalysis.riskScore > 60 ? 'text-red-600' :
                      draftAnalysis.riskScore > 30 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {draftAnalysis.riskScore}/100
                    </div>
                    <div className="text-sm text-slate-600">Risk Score</div>
                  </div>
                </div>

                {/* Risk Meter */}
                <div className="mb-6">
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        draftAnalysis.riskScore > 60 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        draftAnalysis.riskScore > 30 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${draftAnalysis.riskScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Safe</span>
                    <span>Moderate</span>
                    <span>High Risk</span>
                  </div>
                </div>

                {/* Detected Risks */}
                {draftAnalysis.risks.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      Detected Risks
                    </h4>
                    <div className="space-y-3">
                      {draftAnalysis.risks.map((risk, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border-2 ${
                          risk.severity === 'high' ? 'border-red-200 bg-red-50' :
                          risk.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                          'border-yellow-200 bg-yellow-50'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-bold text-slate-800">{risk.type}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              risk.severity === 'high' ? 'bg-red-200 text-red-700' :
                              risk.severity === 'medium' ? 'bg-orange-200 text-orange-700' :
                              'bg-yellow-200 text-yellow-700'
                            }`}>
                              {risk.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 mb-2">{risk.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {risk.keywords.map((keyword, i) => (
                              <span key={i} className="px-2 py-1 bg-white rounded-md text-xs font-mono text-slate-600">
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 italic">💡 {risk.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-green-800 mb-2">Content looks safe!</h4>
                    <p className="text-sm text-green-700">No major risks detected in your draft</p>
                  </div>
                )}

                {/* AI Suggestions */}
                <div>
                  <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {draftAnalysis.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className={`flex-1 px-6 py-3 ${
                    draftAnalysis.safeToPublish 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                  } text-white font-bold rounded-xl transition-all`}>
                    {draftAnalysis.safeToPublish ? 'Approve & Publish' : 'Edit & Re-analyze'}
                  </button>
                  <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CrisisManagementAI;