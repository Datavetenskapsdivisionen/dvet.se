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
                                <b>Läsperiod</b>: Brukar förkortas till LP, och kan kallas för studieperiod.<br/>
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
                                Varje kurs du går är värd x antal hp. Under vår institution (CSE) är majoriteten av kurserna värda 7,5hp. 
                                Kandidatprogram kräver att du har tagit 180hp och masterprogram kräver 120hp.
                            </li>
                            <li><b>Tenta</b>: Ett prov, oftast gjord skriftligt i sal under fyra timmar.</li>
                            <li><b>Hemtenta</b>: Ett prov som kan göras hemma, oftast över längre tid.</li>
                            <li><b>Munta</b>: Ett muntligt prov, ganska sällsynt.</li>
                            <li><b>Dugga</b>: Ett miniprov i en kurs. Det varierar mellan kurser om dessa är betygsgrundade eller ej.</li>
                            <li><b>Programförkortningar</b>:</li>
                            <ul>
                                <li><b>N1COS</b> / <b>DV</b>: Datavetenskapligt program.</li>
                                <li><b>N2COS</b> / <b>CS</b>: Computer Science, Master's Programme.</li>
                                <li><b>N2ADS</b> / <b>ADS</b>: Applied Data Science Master's Programme.</li>
                            </ul>
                            <li>
                                <b>Grundläggande kurser</b>: 
                                Detta är kurser som går igenom grunder till olika ämnen.
                                De har oftast mindre förkunskapskrav jämnfört med avancerade kurser.
                                <br/>
                                <br/>
                                Kallas ibland för kandidatkurser av studenter men detta är ingen officiell term.
                            </li>
                            <li>
                                <b>Avancerade kurser</b>: 
                                Kallas ibland <b>fördjupningskurser</b>.<br/>
                                Detta är kurser som har som mål att fördjupa en students, redan grundläggande, kunskap inom ett ämne.
                                <br/>
                                <br/>
                                <i>Viktigt att komma ihåg att en avancerad kurs behöver nödvändigtvis inte vara en svår kurs!</i>
                                <br/>
                                <br/>
                                Kallas ibland för masterkurser av studenter men detta är ingen officiell term.
                            </li>
                        </ul>
                    </p>`
            },
            {
                name: "Finns det någon chat för mitt program?",
                content: `
                    <p>
                        Det finns det! Föreningen driver en Discord kanal som heter MonadenDV vilket
                        består av Datavetenskaps, Computer Science och Applied Data Science studenter och även ett par doktorander.
                    </p>
                    <p>
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
            }
        ]
    },
    {
        name: "Program Info",
        name_en: "Program Info",
        questions: [
            {
                name: "Vilka kurser ingår i mitt programs?",
                content: `
                <p>
                    Alla program har ett unikt upplägg med kurser, och listan på kurser du kommer gå, går lättast att hitta
                    på utbildningsplanen vilket går att hitta här:
                    <ul>
                        <li>
                            <b>Data Vetenskap (kandidat)</b>:
                            <a href="https://www.gu.se/studera/hitta-utbildning/n1cos-obligatoriska-kurser">
                                <b>gu.se/studera/hitta-utbildning/n1cos-obligatoriska-kurser</b>
                            </a>
                        </li> 
                        <li>
                            <b>Computer Science (master)</b>:
                            <a href="https://www.gu.se/en/study-gothenburg/computer-science-masters-programme-n2cos">
                                gu.se/en/study-gothenburg/computer-science-masters-programme-n2cos
                            </a>
                        </li> 
                        <li>
                            <b>Applied Data Science (master)</b>:
                            <a href="https://www.gu.se/studera/hitta-utbildning/applied-data-science-masterprogram-n2ads">
                                gu.se/studera/hitta-utbildning/applied-data-science-masterprogram-n2ads
                            </a>
                        </li> 
                    </ul>
                </p>
                `
            },
            {
                name: "Hur söker jag kurser?",
                content: `
                <p>
                    Om du har precis börjat din utbildning så är det speciella regler som gäller:
                    <ul>
                        <li>
                            <b>Datavetenskap</b>: Under första året är du automatiskt registrerad på 
                            alla dina kurser och du behöver inte söka dom själv. 
                        </li>
                        <li>
                            <b>Computer Science</b>: Innan du börjar din utbildning ska du ha skickat ett mail till studievägledaren
                            vilket innehåller en lista på de fyra kurser du vill läsa under läsperiod ett och två.
                        </li>
                        <li>
                            <b>Applied Data Science</b>: uh idk. 
                        </li>
                    </ul>
                    Utöver dessa speciella regler så gäller följande:
                </p>
                <p>
                    För att söka kurser använder man <a href="https://antagning.se">antagning.se</a> precis som när du sökte
                    programmet. Tips är att trycka i att du endast söker efter kurser och "Visa endast kurser inom mitt program som jag kan söka" 
                    (kräver att du är inloggad) om du inte letar efter kurser utanför programmet.
                </p>
                <p>
                    Kom ihåg att titta förkunskapskraven för kursen du vill läsa, och att du enbart kan komma in på 6 kurser på en termin.
                    Tips är att söka tre kurser per läsperiod så att du har en "backup" 
                    om du inte kommer in på en kurs, och sen enbart gå två av dessa kurser.
                </p>
                `
            },
            {
                name: "Hur hittar jag vilka kurser jag kan välja?",
                content: `
                <p>
                    När du börja studera lär du ha fått en pdf fil från din programansvarig vilket innehåller en lista på alla 
                    kurser du kan söka. Kom ihåg att titta på förkunskapskraven så att du kan läsa kurserna du är intresserad av.
                </p>
                <p>
                    Alternativt så kan du använda 
                    <a href="https://www.gu.se/studera/hitta-utbildning?education_department=Institutionen%20f%C3%B6r%20data-%20och%20informationsteknik&education_faculty=IT-fakulteten&education_type.keyword=Kurs&q=%2A&subject_area=IT">
                        gu.se/studera/hitta-utbildning
                    </a>
                    vilket låter dig hitta alla kurser under institution och GU. 
                    Det är dock viktigt att komma ihåg att alla dessa kurser är inte nödvändigtvis ligger inom ditt program, och lättaste
                    sättet att dubbelchecka detta är om kursen kommer upp efter du har tryckt i "Visa endast kurser inom mitt program som jag kan söka"
                    när du söker kurser på <a href="http://antagning.se">antagning.se</a>.
                </p>`
            },
            {
                name: "Hur många högskolepoäng får vara utanför programmet?",
                content: `
                <p>
                    Alla kurser du läser behöver inte nödvändigtvis falla under ditt programs huvudområde,
                    men man får inte räkna med hur många som helst i sin examen.
                    <ul>
                        <li>
                            <b>Datavetenskap (kandidat)</b>: Max 30hp valbara kurser utanför området datavetenskap får räknas med,
                            där 15hp av dessa är avancerade kurser.
                        </li>
                        <li>
                            <b>Computer Science (master)</b>: Totalt behöver du läsa 45hp avancerade kurser inom datavetenskap, och göra 
                            ett examensarbete på antingen 30hp eller 60hp. 
                            Detta betyder att du som student har 45hp eller 15hp för valfria kurser.
                        </li>
                        <li>
                            <b>Applied Data Science (master)</b>: 
                            Totalt kommer du läsa 52,5hp obligatoriska kurser inom Data Science, och göra 
                            ett examensarbete på antingen 30hp eller 60hp. 
                            Detta betyder att du som student har 37.5hp eller 7.5hp för valfria kurser.
                        </li>
                    </ul>
                </p>
                `
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
                        då om du ej uppfyller förkunskapskraven för en kurs får du inte gå den.
                    </p>
                    <p>
                        Dock gäller detta inte under första året under din kandidat då du har platsgaranti på alla dina kurser då.
                    </p>`
            },
            {
                name: "<i>Vart</i> är min tenta?"
            },
            {
                name: "Vad kan jag ta med mig till en tenta?"
            },
            {
                name: "Jag behöver extra hjälp, vad finns det för mig?"
            },
            {
                name: "Jag har två tentor samtidigt, hur gör jag?"
            }
        ]
    },
    {
        name: "Studentliv",
        name_en: "Student Life",
        questions: [
            {
                name: "Vad är Datavetenskapsdivsionen?"
            },
            {
                name: "Vad är Göta Studentkår?"
            }
        ]
    }
];