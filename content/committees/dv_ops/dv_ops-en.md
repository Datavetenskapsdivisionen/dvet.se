<style>
    .committee-page-holder {
        display: flex;
        hyphens: auto;
        word-wrap: break-word;
        flex-direction: row;
        overflow-wrap: break-word;
        gap: 40px;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .committee-page-text {
        max-width: 540;
    }

    @media (max-width: 1100px) {
        .committee-page-holder {
            gap: 10px;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: start;
        }
    }

    .committee-page-image {
        display: grid;
        grid-template-rows: auto auto;
        min-width: 300px;
        background-color: #161616;
        overflow: hidden;
        box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.75);
    }
    .committee-page-image div { 
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .committee-page-image div img {
        width: 300px;
    }
    .committee-page-image span {
        color: white;
        text-align: center;
        font-size: 1.4em;
        line-height: 1.4em;
        padding: 10px;
        box-shadow: 0px -15px 56px 4px rgba(255, 255, 255, 0.25);
        font-family: "Press Start 2P";
    }
</style>

# DV_Ops
<div class="committee-page-holder">
    <div lang="se-SE" class="committee-page-text">
        <p>
            DV_Ops is the IT Committee of
            DVD. We are responsible for all
            IT-related matters in Monaden,
            including maintaining our wonderful website.
        </p>
        <p>
            DV_Ops also exists to promote
            IT interest for everyone and
            foster open-source software
            and the hacker spirit within the
            program.
        </p>
        <p>
            Throughout the year, we plan
            game jams, hackathons, and
            maybe even a LAN party in Monaden.
        </p>
        <p>
            Everyone is always welcome,
            regardless of your level of expertise. As long as you have an interest, that’s what matters! You
            can recognize us by our constant
            preaching about why you should
            install Linux on your laptop..
        </p>
        <p>
            <a href="mailto:dvops@dvet.se">dvops@dvet.se</a>
        </p>
    </div>
    <div class="committee-page-image">
        <div>
            <img src="https://www.dvet.se/uploads/samuel/kevin_13dd66f436b312f9a33c97b2447e6fbd.png" />
        </div>
        <span>Our beloved chairman</span>
    </div>
</div>
