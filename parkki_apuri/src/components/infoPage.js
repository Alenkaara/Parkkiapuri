import React from 'react';
import './infoPage.css';


function InfoPage() {
    return (
        <div className="info-page">
            <h1>Usein kysyttyjä kysymyksiä</h1>
            <ul>
                <li>
                    <h2>Mikä tämä verkkosivusto on?</h2>
                    <p>Tämä verkkosivusto on pysäköintiavustin, joka auttaa sinua löytämään vapaat pysäköintipaikat alueeltasi.</p>
                </li>
                <li>
                    <h2>Miten käytän pysäköintiavustinta?</h2>
                    <p>Luo vain tili, ja pääset selaamaan sijainteja ja parkkipaikkoja. Voit luoda varauksia varaussivulta..</p>
                </li>
                <li>
                    <h2>Onko pysäköintiavustin ilmaista käyttää?</h2>
                    <p>Paikkojen tutkiminen on ilmaista, mutta varauksiin sisältyy normaali tuntihintainen maksu.</p>
                </li>
            </ul>
            <h1>Ota yhteyttä</h1>
            <p>Jos sinulla on kysyttävää tai palautetta, ota yhteyttä verkkosivuston ylläpitäjään.</p>
        </div>
    );
}

export default InfoPage;
