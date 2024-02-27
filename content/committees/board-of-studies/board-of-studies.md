<style>
  p {
    font-size: 16px;
    font-family: "Tahoma", "Geneva", sans-serif;
  }

  main {
    padding: 0px;
    float: center;
    margin: 10px auto;
  }

  .page {
    padding: 0px;
  }

  .cimg img {
    padding: 1%;
  }

  .ctxt {
    background: #D8F3FC;
    display: flex;
    flex-direction: column;
    width: 70%;
    padding: 1%;
  }

  .cimg {
    background: #D8F3FC;
    display: flex;
    flex-direction: column;
    width: 30%;
  }

  .flex-co {
    display: flex;
    flex-direction: row;
    width: inherit;
    height: 100%;
  }

  @media screen and (max-width: 1300px) {
    .flex-co {
      flex-direction: column;
    }

    .ctxt {
      flex-direction: row;
      height: 50%;
      width: inherit;
      padding: 1% 3%;
      display: grid;
    }

    h1 {
      padding: 0px;
    }

    .grid-header {
      padding: 0px 1%;
    }

    .grid-txt {
      padding: 0px 1%;
    }

    .cimg {
      background: none;
      flex-direction: row;
      width: inherit;
      height: 30%;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    .cimg img {
      height: 650px;
    }
  }

  @media screen and (max-width: 600px) {
    .cimg img {
      height: 550px;
    }
  }

  @media screen and (max-width: 420px) {
    .cimg img {
      height: 450px;
    }
  }
</style>
<div class="flex-co">
  <div class="ctxt">
    <div class="grid-header">
      <h1>Studienämnden</h1>
    </div>
    <div class="grid-txt">
      <p>
        Datavetenskaps studienämnd är till för att säkerställa studie -och utbildningskvalitén på kandidatprogrammet. Vi
        arbetar med att föra fram studenternas åsik ter genom att bland annat delta i kursutvärderingsmöten för de
        obligatoriska kurserna.
      </p>
      <p>
        Vi uppmuntrar er också att fylla i kursutvärderingsenkäterna som kommer i slutet av varje kurs. Det är era
        åsikter och synpunkter som hjälper oss förbättra kurserna och göra utbildningen ännu bättre.
      </p>
      <p>
        Tveka inte att kontakta oss om ni har frågor, åsikter eller bara vill babbla om någon kurs, föreläsare eller
        examinator.
      </p>
      <a href="mailto:studienamnd@dvet.se">studienamnd@dvet.se</a>
      <p>
        Josefin & Alva
      </p>
    </div>
  </div>
  <div class="cimg">
    <img
      src="https://dvet.se/uploads/committee-images/loafey%20-%20566065dbcc415e9853a7c081cb7f9bbc%20-%20studienamnd.JPG" />
  </div>
</div>