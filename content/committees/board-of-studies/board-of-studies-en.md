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
      <h1>Board of studies</h1>
    </div>
    <div class="grid-txt">
      <p>
        We at the Computer Science education committee (studienämnden) are here to ensure the quality of education and
        studies in the bachelor program. We work to represent students’ opinions by actively participating in course
        evaluation meetings for the mandatory courses.
      </p>
      <p>
        We also encourage you to take part in the course valuation surveys that are sent out at the end of each course.
        Your feedback and insights help us improve the courses and make the education even better.
      </p>
      <p>
        Feel free to reach out to us if you have any questions, opinions, or just want to chat about a course,lecturer,
        or examiner.
      </p>
      <a href="mailto:studienamnd@dvet.se">studienamnd@dvet.se</a>
      <p>
        Josefin & Alva
      </p>
    </div>
  </div>
  <div class="cimg">
    <img
      src="https://media.discordapp.net/attachments/969589372955557898/1148207876754645022/studienamnd.JPG?width=440&height=660" />
  </div>
</div>