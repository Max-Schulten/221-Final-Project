/* eslint-disable react/prop-types */
import { Card, ProgressBar, Button } from "react-bootstrap";
import '../style/style.css'

const Artist = ({name, link, imgSrc, popularity}) => {
    return(
      <>
      <Card style={{ width: '20em', position: 'relative', backgroundColor:'rgb(83,83,83)'}}>
      <a href={link} target='_blank'>
        <Card.Img src={imgSrc} className="card-img" style={{height:'20em'}}/>
        <Card.ImgOverlay className="overlay justify-content-center text-center"><Button variant='dark' style={{color:'#212121', backgroundColor: '#1db954'}}>See On Spotify</Button></Card.ImgOverlay>
      </a>
      <Card.Footer style={{color: 'rgb(29,185,84)'}}>
                    <h3>{name}</h3>
                    <ProgressBar variant='success' style={{ backgroundColor: '#212121', color: 'rgb(29,185,84)' }} now={parseInt(popularity, 10)} label={<span style={{ color: 'rgb(33,33,33)' }}>Popularity</span>}/>
            </Card.Footer>
        </Card>
      </>
    );
}

export default Artist