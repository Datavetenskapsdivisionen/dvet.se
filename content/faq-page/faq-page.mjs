export default [
    {
        name: "Ny student",
        name_en: "New student",
        questions: [
            {
                name: "Bör jag vara med på mottagningen?",
                name_en: "Should I participate in the reception?",
                content: `
                    <p>Ja!!</p>
                    <p>
                        Mottagningen är inte obligatorisk att närvara på
                        men det rekommenderas <b>STARKT</b> då det är ett bra sätt att lära 
                        känna de andra studenterna i din klass.
                        Evenemangen är dessutom mycket roliga och helt gratis!
                    </p>
                    <p>
                        Om du är en äldre student och vill vara med på mottagningen måste du bli en phadder.
                        Vi brukar skicka ut information om detta runt läsperiod 3/4.
                    </p>`,
                content_en: `
                    <p>Yes!!</p>
                    <p>
                        It is not compulsory to attend the reception
                        but it is <b>HIGHLY</b> recommended as it is a good way to learn
                        know the other students in your class.
                        The events are also a lot of fun and completely free!
                    </p>
                    <p>
                        If you are an older student and want to join the reception, you must become a phadder.
                        We usually send out information about this around term 3/4.
                    </p>`
            },
            {
                name: "Ordlista",
                content: `
                    <p>
                        Nedan finns ord som kan vara bra att kunna att kunna som student:
                        <ul>
                            <li>
                                <b>Canvas</b>: Den digitala lärplatformen universitetet använder, kan nås på
                                <a href="https://canvas.gu.se">canvas.gu.se</a>.
                            </li>
                            <li>
                                <b>Ladok</b>: Sidan universitetet använder för att låta dig se vilka kurser och utbildningar du är antagen på.
                                Används för att registrera sig på kurser man har sökt och kommit in på med
                                <a href="https://antagning.se">antagning.se</a>.
                                Används även för att se dina betyg och för att registera sig på tentor.
                                Kan nås på <a href="https://student.ladok.se">student.ladok.se</a>.
                            </li>
                            <li>
                                <b>Antagning</b>: Sidan du använder för att söka kurser när du pluggar. 
                                Kan nås på <a href="https://antagning.se">antagning.se</a>.
                            </li>
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
                name: "Vad är Monaden?",
                content: `
                    <p>
                        Monaden är våran studentlokal på campus Johanneberg! 
                        Det är lokalen vi pluggar, chillar, och festar i!
                    </p>
                    <p>
                        Som student under Datavetenskap, Computer Science och Applied Data Science 
                        är du alltid välkommen där!
                    </p>
                `
            },
            {
                name: "Vart är Monaden?",
                content: `
                    <p>
                        Monaden ligger på campus Johanneberg (Chalmers) i EDIT byggnaden på bottenvåningen.
                        <ul>
                            <li><b>Address</b>: Rännvägen 6, 412 58 Göteborg</li>
                            <li><b>Maps</b>: <a href="https://maps.app.goo.gl/2G1EPigP64ri62QP8">maps.app.goo.gl/2G1EPigP64ri62QP8</a></li>
                            <li><b>Video på hur man hittar från Chalmers hållplats</b>: <a href="https://youtu.be/uHyFgT8ZJPQ?si=d3TouE4d8AdcV9mN">youtu.be/uHyFgT8ZJPQ?si=d3TouE4d8AdcV9mN</a></li>
                        </ul>
                    </p>
                `
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
                    <p/>
                    <p>
                        Kom ihåg att för att du ska få skriva en sals-tenta så måste du registera dig
                        innan på <a href="https://student.ladok.se">student.ladok.se</a>. 
                        Se till att göra detta i början av kursen, eller mitt under kursens gång, 
                        då registreringen brukar stänga någon vecka innan tentan.
                    </p>
                    `
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
                        Dock gäller detta inte under första året under din kandidat då du har platsgaranti på alla dina kurser.
                    </p>`
            },
            {
                name: "<i>Vart</i> är min tenta?",
                content: `
                    <p>
                        De flesta tentors salar är listade här: 
                        <a href="https://cloud.timeedit.net/chalmers/web/exampublic/">
                            cloud.timeedit.net/chalmers/web/exampublic/
                        </a>.
                    </p>
                    <p>
                        Kom ihåg att dubbelchecka på Canvas-sidan för kursen om något annat gäller, 
                        speciellt om det är en hem-tenta eller munta.
                    </p>`
            },
            {
                name: "Vad kan jag ta med mig till en tenta?",
                content: `
                    <p>
                        Majoriteten av dina kurser faller under institutionen CSE, 
                        vilket följer Chalmers tenta-regler som går att hitta här: 
                        <a href="https://www.chalmers.se/utbildning/dina-studier/tentamen-och-ovrig-examination/pa-tentamensdagen-och-efter-tentan/">
                            chalmers.se/utbildning/dina-studier/tentamen-och-ovrig-examination/pa-tentamensdagen-och-efter-tentan/
                        </a>.
                    </p>
                    <p>
                        I korta drag så gäller detta:
                        <ul>
                            <li>
                                <b>Penna och något att sudda med</b>:
                                Självfallet behöver du kunna skriva under tentamen, men du får <b>INTE</b> använda en röd penna,
                                då det är färgen som används under rättning.
                            </li>
                            <li>
                                <b>Bläckpenna</b>: Används för att skriva ditt namn, personnummer m.m på tentan.
                                Igen så är röda bläckpennor <b>INTE</b> tillåtna.
                            </li>
                            <li>
                                <b>Något att äta</b>: 
                                Så länge du inte stör de andra som sitter i salen får du ta med fika och något att dricka.
                                Jordnötter, baljväxter och mandlar är förbjudna.
                            </li>
                            <li>
                                <b>Andra saker</b>: Varje tenta kan ha olika regler, då vissa tillåter dig att ta med
                                ordböker, kursmaterial t.ex. 
                                Det är viktigt att titta på kursens Canvas-sida för att se vilket extra material du får ta med.
                            </li>
                        </ul>
                    </p>
                `
            },
            {
                name: "Jag behöver extra hjälp, vad finns det för mig?",
                content: `
                    <p>
                        Om du som student har dokumenterad funktionsnedsättning och har blivit beviljad pedagogiskt stöd,
                        har du rätt till att begära en anpassad examination. Mer information om detta går att hitta här:
                        <a href="https://studentportal.gu.se/dina-studier/tentamen-och-examination?f_it=1&i_da=1#anpassad-examination">
                            studentportal.gu.se/dina-studier/tentamen-och-examination#anpassad-examination
                        </a>.
                    </p>
                `
            },
            {
                name: "Jag har två tentor samtidigt, hur gör jag?",
                content: `
                    <p>
                        Det händer extremt sällan men ibland har man otur och två av dina tentor krockar!
                        Detta går att lösa men du kommer få göra båda tentorna under ett långt tillfälle.
                        Följ följande länk för att se hur man löser det: 
                        <a href="chalmers.se/utbildning/dina-studier/tentamen-och-ovrig-examination/fore-examination/#plussning-dubbeltentamen-och-omtenta">
                            https://www.chalmers.se/utbildning/dina-studier/tentamen-och-ovrig-examination/fore-examination/#plussning-dubbeltentamen-och-omtenta
                        </a>.
                    </p>`
            }
        ]
    },
    {
        name: "Studentliv",
        name_en: "Student Life",
        questions: [
            {
                name: "Vad är Datavetenskapsdivsionen?",
                content: `
                    <p>
                        Datavetenskapsdivsionen är vår studentförening, vilket bland annat driver sidan du nu är inne på.
                        Vi arrangerar din mottagning, håller ett flertal event under året, och vi ser till att du har
                        det bra när du studerar med oss!
                    </p>
                    <p>
                        Om du har frågor, behöver hjälp, eller råka falla illa ut, med examinatorer, tentor eller andra studenter etc, 
                        så är vi här för att hjälpa dig!
                        Du kan hitta vår kontakt information under <a href="/dviki">kontakt tabben</a>, och mer information om oss på våran 
                        <a href="/dviki">wiki</a>!
                    </p>
                    `
            },
            {
                name: "Vad är Göta Studentkår?",
                content: `
                    <p>
                        Datavetenskapsdivsionen är en förening under Göta Studentkår, vilket är vår studentkår.
                        De är också här för att stödja dig under dina studier, och går även att kontakta om du behöver
                        hjälp. Mer information om dom går att hitta här: <a href="https://www.gotastudentkar.se">gotastudentkar.se</a>.
                    </p>
                `
            }
        ]
    }
];