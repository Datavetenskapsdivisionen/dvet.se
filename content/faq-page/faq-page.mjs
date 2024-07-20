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
                name_en: "Dictionary",
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
                                <li><b>N1COS</b> / <b>DV</b>: Datavetenskapligt Program.</li>
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
                    </p>`,
                content_en: `
                <p>
                    The following is a list of words which will prove useful to you as a student:
                    <ul>
                        <li>
                            <b>Canvas</b>: The digital teaching platform the university uses.
                            Can be found at <a href="https://canvas.gu.se">canvas.gu.se</a>.
                        </li>
                        <li>
                            <b>Ladok</b>: The site the university uses to manage your courses and education.
                            It is used to registerer to courses you have applied for, see your grades and register for exams.
                            Can be found at <a href="https://student.ladok.se">student.ladok.se</a>.
                        </li>
                        <li>
                            <b>Antagning</b>: The site you use to apply to courses if you are a Swedish student. 
                            Can be found at <a href="https://antagning.se">antagning.se</a>.
                        </li>
                        <li>
                            <b>Term</b>: An academic year is dividied into two terms,
                            a fall term, and a spring term. Respectively these are called hösttermin (HT) and vårtermin (VT)
                            in Swedish.
                        </li>
                        <li>
                            <b>Study period</b>: Called läsperiod in Swedish, so it is commonly abbreviated to LP.<br/>
                            An academic year is divided into 4 study periods.
                            Study period one and two are during the fall term, and study period three and four are during the sprin term. 
                            <a href="https://www.chalmers.se/en/education/your-studies/plan-and-conduct-your-studies/the-academic-year/">
                                Exact dates for the different study periods can be found here
                            </a>.
                        </li>
                        <li><b>Labs</b>: 
                            The majority of courses will have labs (aka lab sessions) and 
                            these are parts of your courses which focus on the practical parts of what you learn during your courses.
                        </li>
                        <li>
                            <b>Teaching Assistant</b>: Usually abbreviated to TA.<br />
                            TAs are usually older students or Phd students which are hired by the institution
                            to help you and your teacher in your courses you will meet these during your lab sessions,
                            and they will most likely grade your submissions. Feel free to contact them any time you need help in 
                            one of your courses!
                        </li>
                        <li>
                            <b>Credits</b>: called högskolepoäng in Swedish which is usually abbreviated to <b>hp</b>.<br/>
                            Every course you take is worth x credits. Under our institution (CSE) the majority of courses
                            are worth 7.5 credits. A bachelor programme consists of 180 credits and a 
                            master programme consists of 120 credits.
                        </li>
                        <li><b>Exam</b>: A test, often done in writing on campus during four hours.</li>
                        <li><b>Home exam</b>: A test that can be done at home, and often during a longer period.</li>
                        <li><b>Oral exam</b>: A oral test, where instead of writing, you talk with your examinator.</li>
                        <li><b>Program abbreviations</b>:</li>
                        <ul>
                            <li><b>N1COS</b> / <b>DV</b>: Computer Science (Bachelor) or Datavetenskapligt program in Swedish.</li>
                            <li><b>N2COS</b> / <b>CS</b>: Computer Science, Master's Programme.</li>
                            <li><b>N2ADS</b> / <b>ADS</b>: Applied Data Science, Master's Programme.</li>
                        </ul>
                        <li>
                            <b>First cycle course</b>:
                            These are courses which focuses on the basics in different areas.
                            They often have less prerequisites compared to second cycle courses.
                            <br/>
                            <br/>
                            Sometimes called bachelor courses by students but this is not an official term.
                        </li>
                        <li>
                            <b>Second cycle course</b>: 
                            This is a course which focuses on expanding a students already basic knowledge about something.
                            <br/>
                            Sometimes called master courses by students but this is not an official term.
                        </li>
                    </ul>
                </p>`
            },
            {
                name: "Vad är Monaden?",
                name_en: "What is the Monad?",
                content: `
                    <p>
                        Monaden är våran studentlokal på campus Johanneberg! 
                        Det är lokalen vi pluggar, chillar, och festar i!
                    </p>
                    <p>
                        Som student under Datavetenskap, Computer Science och Applied Data Science 
                        är du alltid välkommen där!
                    </p>
                `,
                content_en: `
                <p>
                    The Monad is our section premises on the Johanneberg campus!
                    It is where we study, chill and party!
                </p>
                <p>
                    As a student under Computer Science (bachelor), Computer (master) and Applied Data Science (master)
                    you are always welcome there!
                </p>
            `
            },
            {
                name: "Vart är Monaden?",
                name_en: "Where is the Monad?",
                content: `
                    <p>
                        Monaden ligger på campus Johanneberg (Chalmers) i Edit-byggnaden på bottenvåningen.
                        <ul>
                            <li><b>Address</b>: Rännvägen 6, 412 58 Göteborg</li>
                            <li><b>Maps</b>: <a href="https://maps.app.goo.gl/2G1EPigP64ri62QP8">maps.app.goo.gl/2G1EPigP64ri62QP8</a></li>
                            <li><b>Video på hur man hittar från Chalmers hållplats</b>: <a href="https://youtu.be/uHyFgT8ZJPQ?si=d3TouE4d8AdcV9mN">youtu.be/uHyFgT8ZJPQ?si=d3TouE4d8AdcV9mN</a></li>
                        </ul>
                    </p>
                `,
                content_en: `
                <p>
                    The Monad is located on the Johanneberg campus in the Edit-building on the bottom floor.
                    <ul>
                        <li><b>Address</b>: Rännvägen 6, 412 58 Göteborg</li>
                        <li><b>Maps</b>: <a href="https://maps.app.goo.gl/2G1EPigP64ri62QP8">maps.app.goo.gl/2G1EPigP64ri62QP8</a></li>
                        <li><b>Video on how to get there from the Chalmers bus stop</b>: <a href="https://youtu.be/uHyFgT8ZJPQ?si=d3TouE4d8AdcV9mN">youtu.be/uHyFgT8ZJPQ?si=d3TouE4d8AdcV9mN</a></li>
                    </ul>
                </p>
                `
            },
            {
                name: "Finns det någon chat för mitt program?",
                name_en: "Is there a chat for my programme?",
                content: `
                    <p>
                        Det finns det! Föreningen driver en Discord kanal som heter MonadenDV vilket
                        består av Datavetenskaps, Computer Science och Applied Data Science studenter, och även ett par doktorander.
                    </p>
                    <p>
                        Linken till denna finns som QR koder i Monaden, men även i recceguiden du har fått mailat till dig om du är en ny student.
                        Om du av nån anledning inte kan få tag i nån av dessa så kan du maila <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se</a>
                        så skickar vi dig en länk!
                    </p>`,
                content_en: `
                    <p>
                        Sure there is! The student association runs a Discord channel called MonadenDV which consists of 
                        students from Computer Science (bachelor), Computer (master) and Applied Data Science (master), and even a few Phd students!
                    </p>
                    <p>
                        The link to this channel can be found as QR codes in the Monad, but also in the receptionguide you got as a new student.
                        If you for some reason can't find any of these, feel free to mail <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se</a>
                        and we will send you a link!
                    </p>`
            },
            {
                name: "Hur hittar man en bostad i Göteborg?",
                name_en: "How do I find a place to live in Gothenburg?",
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
                    </p>`,
                content_en: `
                    <p>
                        As a new or old student, someplace to live is of course needed, and Gothenburg has a 
                        a few housing queues you can use:
                    </p>
                    <p>
                        Student queues:
                        <ul>
                            <li>
                                <b>SGS Studentbostäder</b>: <a href="https://sgs.se/">sgs.se</a><br>
                                <i>(tip: as a member of Göta Student Union you gain 3 extra months when you register)</i>
                            </li>
                            <li><b>Chalmers Studentbostäder</b>: <a href="https://www.chalmersstudentbostader.se/">chalmersstudentbostader.se</a></li>
                        </ul>
                    </p>
                    <p>
                        Housing queues:
                        <ul>
                            <li><b>Boplats</b>: <a href="https://boplats.se/">boplats.se</a></li>
                            <li><b>HomeQ</b>: <a href="https://www.homeq.se/">homeq.se</a></li>
                            <li><i>Many, many more...</i></li>
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
                name: "Vilka kurser ingår i mitt program?",
                name_en: "What courses are included in my programme?",
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
                `,
                content_en: `
                <p>
                    All programmes have a unique set of courses in them, and the easiest way to find your syllbus is to look here:
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
                name_en: "How do I apply for courses?",
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
                `,
                content_en: `
                <p>
                    If you just started your education a few rules will apply:
                    <ul>
                        <li>
                            <b>Computer Science (bachelor)</b>: During the first year you are automatically registered
                            to all your courses, and you do not need to apply for them yourself.
                        </li>
                        <li>
                            <b>Computer Science (master)</b>: Before you start your education you have to send an email to 
                            the student counsellor, containing the a list of the four courses you want to read during study period one and two.   
                        </li>
                        <li>
                            <b>Applied Data Science</b>: uh idk. 
                        </li>
                    </ul>
                    Outside of these rules the following applies:
                </p>
                <p>
                    If you are an international student <b>INSERT GUIDE HERE</b>.
                </p>
                <p>
                    If you are a Swedish student, you use <a href="https://antagning.se">antagning.se</a> just like when you applied to the
                    programme. A hot tip is to select that you are only looking for courses and to enable the 
                    "Visa endast kurser inom mitt program som jag kan söka" option (requires that you are logged in), unless you are looking for courses
                    outside your programme.
                </p>
                <p>
                    Remember to take a look at the the prerequisites for a course, and you can only apply for 6 courses per term.
                    Tip is to search three courses per study period, so you have a "backup" course incase you do not meet 
                    prerequisites for a course you are applying to, and then only actually attend two of these courses.
                </p>
                `
            },
            {
                name: "Hur hittar jag vilka kurser jag kan välja?",
                name_en: "How do I find which courses I can apply for?",
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
                </p>`,
                content_en: `
                <p>
                    When you start studying you should have gotten a pdf file from your programme co-ordinator which 
                    should list all the courses you can apply for. Remember to look at the prerequisites for the courses you want to apply for.
                </p>
                <p>
                    Alternatively you can use
                    <a href="https://www.gu.se/en/study-gothenburg/study-options/find-courses?education_department=Department%20of%20Computer%20Science%20and%20Engineering&education_faculty=IT%20Faculty&q=%2A">
                        gu.se/en/study-gothenburg/study-options/find-courses
                    </a>
                    which lets you find all courses under the institution and Gothenburgs University.
                    Keep in mind that you may not necessarily count all these courses towards your exam, as they may overlap
                    with courses you have already taken, or they lie outside your programme plan.
                    The easiest way to doublecheck this is to enable the "Visa endast kurser inom mitt program som jag kan söka" option
                    when looking for courses on <a href="http://antagning.se">antagning.se</a>.
                    
                    <b>INSERT INTERNATIONAL STUDENT THINGS</b>
                </p>`
            },
            {
                name: "Hur många högskolepoäng får vara utanför programmet?",
                name_en: "How many credits can be outside of my programme?",
                content: `
                <p>
                    Alla kurser du läser behöver inte nödvändigtvis falla under ditt programmes huvudområde,
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
                `,
                content_en: `
                <p>
                    All the courses you take do not necessarily have to fall under the major area of your programme,
                    but you can only have a fixed amount of those courses in your exam.
                    <ul>
                        <li>
                            <b>Computer Science (bachelor)</b>: A maximum of 30 credits in computer science courses
                            may be allowed, but 15 of these credits need to be second cycle courses.
                        </li>
                        <li>
                            <b>Computer Science (master)</b>: 
                            In total you need to read 45hp of second cycle courses in computer science, 
                            and you need to do a 30/60 credit thesis.
                            This means that you can have 45 or 15 credits of courses outside of computer science.
                        </li>
                        <li>
                            <b>Applied Data Science (master)</b>: 
                            You will take 52.5 credits of obligatory courses in data science, 
                            and you need to do a 30/60 credit thesis.
                            This means that you can have 37.5 or 7.5 credits of courses outside of data science.
                        </li>
                    </ul>
                </p>`
            }
        ]
    },
    {
        name: "Tentor",
        name_en: "Exams",
        questions: [
            {
                name: "När är mina tentor?",
                name_en: "When are my exams?",
                content: `
                    <p>
                    Exakta tillfällen för tentor varierar mellan kurser, men publiceras 
                        under kursens gång på<a href = "https://student.ladok.se">student.ladok.se</a>.
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
                `,
                content_en: `
                    <p>
                        Exam dates vary between courses, but they are published during the course
                        over at <a href="https://student.ladok.se">student.ladok.se</a>.
                    </p>
                    <p>
                        Almost all exams are placed under so called exam-periods, and these can
                        <a href="https://www.chalmers.se/en/education/your-studies/plan-and-conduct-your-studies/the-academic-year/">
                            can be found here
                        </a>.
                    <p/>
                    <p>
                        Remember that to be allowed to do a on-campus written exam, you 
                        have to register for it before on <a href="https://student.ladok.se">student.ladok.se</a>.
                        Make sure you do this during the course, or in the middle of the course, as the 
                        registration for exams usually close a week or so before an exam.
                    </p>
                `
            },
            {
                name: "Jag misslyckades med en tenta, vad gör jag?",
                name_en: "I failed an exam, what can I do?",
                content: `
                <p>
                    Det är oftast inget att oroa sig över!
                    Tentor får man göra om hur många gånger som helst, men det kan ha inpakt på vilka kurser du kan gå,
                    då om du ej uppfyller förkunskapskraven för en kurs får du inte gå den.
                    Håll koll på när omtenta-tillfällen publiceras på <a href="https://student.ladok.se">student.ladok.se</a>.
                </p>
                <p>
                    Dock gäller detta inte under första året under din kandidat då du har platsgaranti på alla dina kurser.
                </p>`,
                content_en: `
                <p>
                    Usually you do not have to worry about this! 
                    You can retake exams however many times it takes, but it can make an impact on the courses you can apply for,
                    because if you do not fulfill the prerequisites for a courses, you can not take it!
                    Keep an on <a href="https://student.ladok.se">student.ladok.se</a> to see when re-exams popup.
                </p>
                <p>
                    Note: this does not apply if it is your first year of your bachelor, as you have guaranteed admission
                    to your courses.
                </p>
                <p>
                    Insert INTERNATIONAL information
                </p>`
            },
            {
                name: "<i>Vart</i> är min tenta?",
                name_en: "Where is my exam?",
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
                </p>`,
                content_en: `
                <p>
                    The majority of exam locations are listed here:
                    <a href="https://cloud.timeedit.net/chalmers/web/exampublic/">
                        cloud.timeedit.net/chalmers/web/exampublic/
                    </a>.
                </p>
                <p>
                    Remember to doublecheck with the courses Canvas-page if something special applies,
                    especially if its a home exam or oral exam.
                </p>`
            },
            {
                name: "Vad kan jag ta med mig till en tenta?",
                name_en: "What can I bring to an exam?",
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
                `,
                content_en: `
                <p>
                    The majority of your courses falls under the institution CSE,
                    which follows Chalmer's exam rules, which can be found here:
                    <a href="https://www.chalmers.se/en/education/your-studies/examinations-and-other-summative-assessments/during-and-after-the-examination-session/">
                        chalmers.se/en/education/your-studies/examinations-and-other-summative-assessments/during-and-after-the-examination-session/
                    </a>.
                </p>
                <p>
                    In short:
                    <ul>
                        <li>
                            <b>A pen and something to erase with</b>:
                            You will need something to write with of course, but remember that red pens are <b>NOT</b>
                            allowed as these are used for grading! 
                        </li>
                        <li>
                            <b>Ink pen</b>: 
                            This is used to write down your name and other identification on your exam.
                            Again, red pens are <b>NOT</b> allowed!
                        </li>
                        <li>
                            <b>Something to eat</b>:
                            As long as you do not disturb the other students you may bring something to eat and drink to your exam.
                            Peanuts, legumes and almonds are foridden.
                        </li>
                        <li>
                            <b>Other gear</b>: 
                            Every exam can have different rules, and some allow you to bring a dictionary, a course book etc.
                            It is important to look at the course's Canvas page to see what you may bring.
                        </li>
                    </ul>
                </p>
                `
            },
            {
                name: "Jag behöver extra hjälp, vad finns det för mig?",
                name_en: "I need extra help, what can I apply for?",
                content: `
                <p>
                    Om du som student har dokumenterad funktionsnedsättning och har blivit beviljad pedagogiskt stöd,
                    har du rätt till att begära en anpassad examination. Mer information om detta går att hitta här:
                    <a href="https://studentportal.gu.se/dina-studier/tentamen-och-examination?f_it=1&i_da=1#anpassad-examination">
                        studentportal.gu.se/dina-studier/tentamen-och-examination#anpassad-examination
                    </a>.
                </p>
                `,
                content_en: `
                <p>
                    If you have a documented disability and have been granted study support, you have to right to 
                    an adapted exam. More information about that can be found here:
                    <a href="https://studentportal.gu.se/en/your-studies/exams?f_it=1&i_da=1#adapted-exams">
                        studentportal.gu.se/en/your-studies/exams?f_it=1&i_da=1#adapted-exams
                    </a>.
                </p>
                `
            },
            {
                name: "Jag har två tentor samtidigt, hur gör jag?",
                name_en: "I have two exams at the same time, what do I do?",
                content: `
                <p>
                    Detta händer extremt sällan men ibland har man otur och två av dina tentor krockar!
                    Detta går att lösa men du kommer få göra båda tentorna under ett långt tillfälle.
                    Följ följande länk för att se hur man löser det:
                    <a href="https://www.chalmers.se/utbildning/dina-studier/tentamen-och-ovrig-examination/fore-examination/#plussning-dubbeltentamen-och-omtenta">
                        chalmers.se/utbildning/dina-studier/tentamen-och-ovrig-examination/fore-examination/#plussning-dubbeltentamen-och-omtenta
                    </a>.
                </p>`,
                content_en: `
                <p>
                    This is very rare, but sometimes you are unlucky and two of your exams overlap.
                    This is solveable but you will have to do both exams under one longer period.
                    See this link to see how you get permission to do this: 
                    <a href="https://www.chalmers.se/en/education/your-studies/examinations-and-other-summative-assessments/before-examination/#double-examinations-re-examinations-and-number-of-examination-sessions">
                        chalmers.se/en/education/your-studies/examinations-and-other-summative-assessments/before-examination/#double-examinations-re-examinations-and-number-of-examination-sessions
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
                name_en: "What is the Computer Science Division?",
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
                `,
                content_en: `
                <p>
                    The Computer Science Division is our student association, which for instance, is hosting the site you are currently using.
                    We arrange your reception, host numberous events during the year, and we make sure that you have 
                    a good time while studying with us. 
                </p>
                <p>
                    If you have questions, need help, or happen to find yourself in trouble with for example examinators or other students,
                    we are here to help you!
                    You can find our contant information under the <a href="/dviki">contact tab</a>, and more information at our
                    <a href="/dviki">wiki</a>!
                </p>
                `
            },
            {
                name: "Vad är Göta Studentkår?",
                name_en: "What is the Göta Student Union?",
                content: `
                <p>
                    Datavetenskapsdivsionen är en förening under Göta Studentkår, vilket är vår studentkår.
                    De är också här för att stödja dig under dina studier, och går även att kontakta om du behöver
                    hjälp. Mer information om dom går att hitta här: <a href="https://www.gotastudentkar.se">gotastudentkar.se</a>.
                </p>`,
                content_en: `
                <p>
                    The Computer Science Division is an association under the Göta Student Union, which is our student union.
                    They are also here to help you during your studies, and you can contact them if you are in need of help.
                    More information can be found here: <a href="https://www.gotastudentkar.se">gotastudentkar.se</a>.
                </p>
                `
            }
        ]
    }
];;;