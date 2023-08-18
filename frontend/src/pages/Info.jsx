import React from 'react';
import '../style/Info.css';

function InfoPage() {
    return (
        <div className="info">
            <div className="container">
                <h1>Info</h1>
                
                <section className="section">
                    <h2>When are Greenheads likely?</h2>
                    <ul>
                        <li>During westerly winds</li>
                        <li>In high temperatures</li>
                        <li>With high humidity</li>
                        <li>During their season, from June to September, especially in the last two weeks of July and the first week of August</li>
                        <li>During the middle of the day</li>
                    </ul>
                </section>
                
                <section className="section">
                    <h2>How to avoid them:</h2>
                    <ul>
                        <li>Dry off after exiting the ocean</li>
                        <li>Avoid staying in the shade</li>
                        <li>Wear long-sleeved clothes (though it might be challenging at the beach!)</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default InfoPage;
