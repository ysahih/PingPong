import Image from "next/image"

const Games = () => {
    return (

      <div className="Games">

          <div className="darkRow">

            <div className="darktable">
                <Image src="homeimages/Darktable.svg" alt="table" width={200} height={200}/>
            </div>

            <div className="tabledescribtion">
                <h2> Dark Valley</h2>
                <p>Play in a dark environment and get Dark</p>
                <p>Valley’s achievement</p>
                <button className="Playbutton">Play</button>
            </div>
          </div>

          <div className="LightRow">

            <div className="tabledescribtion">
                <h2> Frozen Arena</h2>
                <p>Play in a Light environment and get Frozen</p>
                <p>Arena's achievement</p>
                <button className="Playbutton">Play</button>
            </div>

            <div className="Lighttable">
                <Image src="homeimages/lighttable.svg" alt="table" width={200} height={200}/>
            </div>
          </div>

      </div>
    )
  }

export default Games