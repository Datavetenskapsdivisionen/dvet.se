export default [
    {
        name: "Ny student",
        name_en: "New student",
        questions: [
            {
                name: "Bör jag vara med på mottagningen?",
                content: `
                    <p>Ja!!</p>
                    <p>Mottagningen är inte obligatorisk att närvara på
                        men det rekommenderas <b>STARKT</b> då det är ett bra sätt att lära 
                        känna de andra studenterna i din klass.
                        Evenemangen är dessutom mycket roliga och helt gratis!
                    </p>
                    <p>
                        Om du är en äldre student och vill vara med på mottagningen måste du bli en phadder.
                        Vi brukar skicka ut information om detta runt läsperiod 3/4.
                    </p>`
            },
            {
                name: "Ordlista",
                content: `
                    <p>
                        Nedan finns ord som kan vara bra att kunna att kunna som student:
                        <ul>
                            <li><b>Termin</b>: Ett läsår är indelat i två terminer: en hösttermin (HT) och en vårtermin (VT).</li>
                            <li>
                                <b>Läsperiod</b>: Brukar förkortas till LP.<br/>
                                Ett läsår är indelat i fyra läsperioder. Läsperiod 1 & 2 är under höstterminen och läsperiod 3 & 4 är under vårterminen.
                                <a href="https://www.chalmers.se/utbildning/dina-studier/planera-och-genomfora-studier/datum-och-tider-for-lasaret/">
                                    Exakta datum för läsperioderna går att hitta här
                                </a>.
                            </li>
                            <li><b>Laboration</b>: De flesta kurserna kommer att ha laborationer (aka labbpass) och är delmoment i kursen för att applicera praktiska moment i det du lär dig under kursens gång.</li>
                            <li>
                                <b>Teaching Assistant</b>: Brukar förkortas till TA och kallas för lärarassistant på svenska.<br />
                                TAs brukar vara äldre studenter eller doktorander som är anställda av institutionen och de är där för att hjälpa dig och din lärare i dina kurser. Du kommer att stöta på dem på dina lektioner och de rättar oftast dina inlämningar. Kontakta gärna dem om du behöver hjälp i din kurs!<br />
                            </li>
                            <li>
                                <b>Högskolepoäng</b>: Brukar förkortas till <b>hp</b>.<br/>
                                Varje kurs du går är värd x antal hp. Under vår institution (CSE) är majoriteten av kurserna värda 7,5hp. Kandidatprogram kräver att du har tagit 180hp och masterprogram kräver 120hp.
                            </li>
                            <li><b>Tenta</b>: Ett prov, oftast gjord skriftligt i sal under fyra timmar.</li>
                            <li><b>Hemtenta</b>: Ett prov som kan göras hemma, oftast över längre tid.</li>
                            <li><b>Munta</b>: Ett muntligt prov, ganska sällsynt.</li>
                            <li><b>Dugga</b>: Ett miniprov i en kurs. Det varierar mellan kurser om dessa är betygsgrundade eller ej.</li>
                            <li><b>Programförkortningar</b>:</li>
                            <ul>
                                <li><b>N1COS</b>: Datavetenskapligt program.</li>
                                <li><b>N2COS</b>: Computer Science, Master's Programme.</li>
                                <li><b>N2ADS</b>: Applied Data Science Master's Programme.</li>
                            </ul>
                        </ul>
                    </p>`
            },
            {
                name: "Finns det någon chat för mitt program?",
                content: `
                    <p>
                        Det finns det! Föreningen driver en Discord kanal som heter MonadenDV vilket
                        består av Datavetenskaps, Computer Science och Applied Data Science studenter och även ett par doktorander.
                        <br/>
                        Linken till denna finns som QR koder i Monaden, men även i recceguiden du har fått mailat till dig om du är en ny student.
                        Om du av nån anledning inte kan få tag i nån av dessa så kan du maila <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se</a>
                        så skickar vi dig en länk!
                    </p>`
            },
            {
                name: "Hur hittar man en bostad i Göteborg?",
                content: `
                    <p>
                        Som ny eller gammal student kan en studentbostad behövas, 
                        och Göteborg har ett flertal köer man kan använda:
                    </p>
                    <p>
                        Studentköer:
                        <ul>
                            <li>
                                <b>SGS Studentbostäder</b>: <a href="https://sgs.se/">sgs.se</a><br>
                                <i>(tips: som medlem i Göta Studentkår får du 3 extra månader när registrerar dig)</i>
                            </li>
                            <li><b>Chalmers Studentbostäder</b>: <a href="https://www.chalmersstudentbostader.se/">chalmersstudentbostader.se</a></li>
                        </ul>
                    </p>
                    <p>
                        Bostadsköer:
                        <ul>
                            <li><b>Boplats</b>: <a href="https://boplats.se/">boplats.se</a></li>
                            <li><b>HomeQ</b>: <a href="https://www.homeq.se/">homeq.se</a></li>
                            <li><i>Många, många mer...</i></li>
                        </ul>
                    </p>`
            },
            {
                name: "Hur många högskolepoäng får vara utanför programmet?"
            },
            {
                name: "Hur hittar jag vilka kurser jag kan välja?"
            }
        ]
    },
    {
        name: "Tentor",
        name_en: "Exams",
        questions: [
            {
                name: "När är mina tentor?",
                content: `
                    <p>
                        Exakta tillfällen för tentor varierar mellan kurser, men publiceras 
                        under kursens gång på <a href="https://student.ladok.se">student.ladok.se</a>.
                    </p>
                    <p>
                        Nästan alla tentor ligger under vad som kallas tentaperioder, och 
                        <a href="https://www.chalmers.se/utbildning/dina-studier/planera-och-genomfora-studier/datum-och-tider-for-lasaret/">
                            dessa går att hitta här
                        </a>.
                    <p/>`
            },
            {
                name: "Jag misslyckades med en tenta, vad gör jag?",
                content: `
                    <p>
                        Det är oftast inget att oroa sig över! 
                        Tentor får man göra om hur många gånger som helst, men det kan ha inpakt på vilka kurser du kan gå,
                        då om du ej uppfyller förkunskapskraven för en kurs får du inte gå den.<br/>
                        Dock gäller detta inte under första året under din kandidat då du har platsgaranti på alla dina kurser då.
                    </p>`
            },
            {
                name: "Jag behöver extra hjälp, vad finns det för mig?"
            },
            {
                name: "Jag har två tentor samtidigt, hur gör jag?"
            }
        ]
    }
];