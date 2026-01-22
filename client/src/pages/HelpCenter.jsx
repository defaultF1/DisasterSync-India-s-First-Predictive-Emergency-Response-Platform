import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Zap, Map, Bell, Shield } from 'lucide-react';

const HelpCenter = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqData = [
        {
            category: 'AI & Predictions',
            icon: <Zap size={18} />,
            items: [
                { q: 'How accurate are the disaster predictions?', a: 'Our DisasterSync AI Engine aggregates satellite data, seismic sensors, and live weather APIs. It currently operates with a 94% accuracy rate for flood and cyclone prediction, constantly learning from historical patterns.' },
                { q: 'What data sources power the system?', a: 'We synthesize real-time feeds from USGS (Earthquakes), IMD (Weather), ISRO satellites, and our local IoT sensor network. Data refreshes every 30 seconds.' },
                { q: 'How far in advance can disasters be predicted?', a: 'Cyclones and floods can be predicted 24-72 hours ahead. Earthquakes have early warning of 10-60 seconds post P-wave detection.' }
            ]
        },
        {
            category: 'Live Map & Interface',
            icon: <Map size={18} />,
            items: [
                { q: 'What do the map markers indicate?', a: 'Red pulses = Critical alerts. Yellow ripples = Moderate risk / seismic activity. Green markers = Available NDRF response teams. Blue icons = Water resources.' },
                { q: 'Can I filter map layers?', a: 'The map auto-focuses on active alerts. Manual layer toggling (Rainfall, Seismic, Satellite) is planned for a future update.' },
                { q: 'Why does the map show international data?', a: 'USGS earthquake data is global. Our system displays relevant regional events that may indicate cross-border geological activity.' }
            ]
        },
        {
            category: 'Alerts & Response',
            icon: <Bell size={18} />,
            items: [
                { q: 'How are alerts disseminated?', a: 'When AI confidence exceeds 85%, alerts broadcast via: 1) SMS/Cell Broadcast to residents in the geofence. 2) Radio frequencies for offline areas. 3) Direct line to local NDRF/SDMA control rooms.' },
                { q: 'What is the Resource Manager?', a: 'It tracks inventory (Boats, MedKits, Food Rations) in real-time and suggests optimal allocation based on predicted disaster severity and population density.' },
                { q: 'Who can trigger manual alerts?', a: 'Only verified agency personnel with Admin or Operator roles can trigger manual alerts after two-factor authentication.' }
            ]
        },
        {
            category: 'Technical & Security',
            icon: <Shield size={18} />,
            items: [
                { q: '"System Live" indicator is red?', a: 'This indicates a disconnection from our WebSocket server. Check your internet connection or contact admin support if the issue persists.' },
                { q: 'Is my data secure?', a: 'All communications are encrypted via TLS 1.3. Agency personnel data is role-restricted and logged for audit purposes. We comply with government data protection guidelines.' },
                { q: 'Can the system work offline?', a: 'The mobile app caches recent data. Critical alerts can be received via SMS even without internet connectivity.' }
            ]
        }
    ];

    const toggleFaq = (categoryIdx, itemIdx) => {
        const key = `${categoryIdx}-${itemIdx}`;
        setOpenFaq(openFaq === key ? null : key);
    };

    return (
        <div className="help-center">

            {/* FAQ Section */}
            <div className="faq-section">
                <h3 className="section-title">
                    <HelpCircle size={22} /> Frequently Asked Questions
                </h3>

                <div className="faq-grid">
                    {faqData.map((category, catIdx) => (
                        <div key={catIdx} className="faq-category glass-panel">
                            <div className="category-header">
                                <span className="category-icon">{category.icon}</span>
                                <h4>{category.category}</h4>
                            </div>
                            <div className="category-items">
                                {category.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className={`faq-item ${openFaq === `${catIdx}-${itemIdx}` ? 'open' : ''}`}
                                    >
                                        <button
                                            className="faq-question"
                                            onClick={() => toggleFaq(catIdx, itemIdx)}
                                        >
                                            <span>{item.q}</span>
                                            {openFaq === `${catIdx}-${itemIdx}` ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </button>
                                        {openFaq === `${catIdx}-${itemIdx}` && (
                                            <div className="faq-answer">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .help-center {
                    padding: 1.5rem;
                    height: 100%;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }



                /* FAQ Section */
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.2rem;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                }
                .faq-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.25rem;
                }
                .faq-category {
                    padding: 1.25rem;
                }
                .faq-category:hover {
                    transform: none;
                }
                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border-color);
                }
                .category-icon {
                    color: var(--accent-primary);
                }
                .category-header h4 {
                    font-size: 1rem;
                    color: var(--text-primary);
                    margin: 0;
                }
                .category-items {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .faq-item {
                    border-radius: 8px;
                    overflow: hidden;
                    transition: background 0.2s;
                }
                .faq-question {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.02);
                    border: none;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-family: var(--font-body);
                    border-radius: 8px;
                }
                .faq-question:hover {
                    background: rgba(255,255,255,0.05);
                }
                .faq-item.open .faq-question {
                    background: rgba(59, 130, 246, 0.1);
                    color: var(--accent-primary);
                    border-radius: 8px 8px 0 0;
                }
                .faq-answer {
                    padding: 0.75rem 1rem;
                    background: rgba(0,0,0,0.2);
                    color: var(--text-secondary);
                    font-size: 0.85rem;
                    line-height: 1.6;
                    border-radius: 0 0 8px 8px;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 900px) {
                    .faq-grid {
                        grid-template-columns: 1fr;
                    }

                }
            `}</style>
        </div>
    );
};

export default HelpCenter;
